import { inngest } from '../inngest';
import { db } from '@/lib/db/drizzle';
import { tests } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendTestEmail } from '@/lib/email/send';
import { checkInboxPlacement } from '@/lib/email/imap';
import { calculateSpamScore } from '@/lib/email/spam-score';
import { validateDomainDns } from '@/lib/email/dns-validation';

export const processTest = inngest.createFunction(
  {
    id: 'process-test',
    retries: 3,
    onFailure: async ({ error, event }) => {
      // Mark test as failed when all retries are exhausted
      // In onFailure, the original event is nested inside event.data.event
      const originalEvent = (event as { data: { event?: { data?: { testId?: string } } } }).data?.event;
      const testId = originalEvent?.data?.testId;
      if (!testId) {
        console.error('No testId found in failure event');
        return;
      }
      try {
        await db
          .update(tests)
          .set({
            status: 'failed',
            errorMessage: error?.message || 'Test processing failed after retries',
            completedAt: new Date(),
          })
          .where(eq(tests.id, testId));
      } catch (dbError) {
        console.error('Failed to mark test as failed:', dbError);
      }
    },
  },
  { event: 'test/created' },
  async ({ event, step }) => {
    const { testId, mode } = event.data;

    // Step 1: Get test details from database
    const test = await step.run('fetch-test', async () => {
      const result = await db.query.tests.findFirst({
        where: eq(tests.id, testId),
      });

      if (!result) {
        throw new Error(`Test ${testId} not found`);
      }

      return result;
    });

    // Step 2: Send test emails to seed inboxes (or simulate in test mode)
    const emailResult = await step.run('send-test-emails', async () => {
      if (mode === 'test') {
        // In test mode, simulate sending
        return {
          success: true,
          testMarker: `test-${testId.slice(0, 8)}`,
          messageIds: {
            gmail: 'mock-gmail-id',
            outlook: 'mock-outlook-id',
            yahoo: 'mock-yahoo-id',
          },
        };
      }

      // Live mode: actually send emails
      return await sendTestEmail({
        from: test.fromAddress,
        subject: test.subject,
        html: test.htmlContent || undefined,
        text: test.textContent || undefined,
      });
    });

    // Update test with marker
    await step.run('update-test-marker', async () => {
      await db
        .update(tests)
        .set({ testMarker: emailResult.testMarker })
        .where(eq(tests.id, testId));
    });

    // Step 3: Wait for email delivery (60 seconds in live mode, skip in test mode)
    if (mode === 'live') {
      await step.sleep('wait-for-delivery', '60s');
    }

    // Step 4: Check inbox placement
    const placements = await step.run('check-inbox-placement', async () => {
      if (mode === 'test') {
        // Simulated results for test mode
        return {
          gmail: 'inbox' as const,
          outlook: 'inbox' as const,
          yahoo: 'spam' as const,
        };
      }

      return await checkInboxPlacement(emailResult.testMarker);
    });

    // Step 5: Calculate spam score using Postmark SpamCheck
    const spamResult = await step.run('calculate-spam-score', async () => {
      return await calculateSpamScore({
        from: test.fromAddress,
        subject: test.subject,
        html: test.htmlContent || undefined,
        text: test.textContent || undefined,
      });
    });

    // Step 6: Validate DNS authentication
    const domain = test.fromAddress.split('@')[1];
    const dnsResult = await step.run('validate-dns', async () => {
      if (!domain) {
        return {
          spf: 'none' as const,
          dkim: 'none' as const,
          dmarc: 'none' as const,
        };
      }

      const validation = await validateDomainDns(domain);
      return {
        spf: validation.spf.valid ? ('pass' as const) : ('fail' as const),
        dkim: validation.dkim.valid ? ('pass' as const) : ('fail' as const),
        dmarc: validation.dmarc.valid ? ('pass' as const) : ('fail' as const),
      };
    });

    // Step 7: Generate recommendations
    const recommendations = await step.run('generate-recommendations', async () => {
      const recs: string[] = [];

      // Based on inbox placement
      if (placements.gmail === 'spam') {
        recs.push('Gmail placed your email in spam - review content for spam triggers');
      }
      if (placements.outlook === 'spam' || placements.outlook === 'junk') {
        recs.push('Outlook flagged your email - check your sender reputation');
      }
      if (placements.yahoo === 'spam' || placements.yahoo === 'bulk') {
        recs.push('Consider warming up your IP for Yahoo');
      }

      // Based on spam score
      if (spamResult.score > 5) {
        recs.push('High spam score detected - reduce spam trigger words in subject and content');
      } else if (spamResult.score > 3) {
        recs.push('Moderate spam score - review content for potential spam triggers');
      }

      // Based on DNS authentication
      if (dnsResult.spf !== 'pass') {
        recs.push('SPF record is missing or invalid - configure SPF for better deliverability');
      }
      if (dnsResult.dkim !== 'pass') {
        recs.push('DKIM is not configured - add DKIM signing to improve authentication');
      }
      if (dnsResult.dmarc !== 'pass') {
        recs.push('DMARC policy is missing - implement DMARC to prevent spoofing');
      }

      // Add triggered spam rules as recommendations
      if (spamResult.rules && spamResult.rules.length > 0) {
        const topRules = spamResult.rules.slice(0, 3);
        topRules.forEach((rule) => {
          if (rule.description) {
            recs.push(`Spam filter triggered: ${rule.description}`);
          }
        });
      }

      return recs.length > 0 ? recs : ['No issues detected - your email configuration looks good!'];
    });

    // Step 8: Finalize test with all results
    await step.run('finalize-test', async () => {
      await db
        .update(tests)
        .set({
          status: 'completed',
          inboxPlacement: placements,
          spamScore: spamResult.score.toString(),
          authenticationResults: dnsResult,
          recommendations,
          completedAt: new Date(),
        })
        .where(eq(tests.id, testId));
    });

    return {
      testId,
      status: 'completed',
      placements,
      spamScore: spamResult.score,
      authentication: dnsResult,
    };
  }
);
