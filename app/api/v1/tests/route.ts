import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth, apiSuccess, parseJsonBody } from '@/lib/api/middleware';
import { Errors } from '@/lib/api/errors';
import { createTestSchema, type CreateTestInput } from '@/lib/api/schemas';
import { db } from '@/lib/db/drizzle';
import { tests } from '@/lib/db/schema';
import { inngest } from '@/lib/jobs/inngest';

export const POST = withApiAuth(async (request, context) => {
  // Parse and validate request body
  const body = await parseJsonBody<CreateTestInput>(request);

  const result = createTestSchema.safeParse(body);
  if (!result.success) {
    throw Errors.ValidationError(result.error.issues[0]?.message || 'Invalid request body');
  }

  const { from, subject, html, text, webhook_url } = result.data;

  // Create test record in database
  const [newTest] = await db
    .insert(tests)
    .values({
      userId: context.userId,
      teamId: context.teamId ?? null,
      status: 'processing',
      fromAddress: from,
      subject,
      htmlContent: html ?? null,
      textContent: text ?? null,
      webhookUrl: webhook_url ?? null,
      inboxPlacement: {
        gmail: 'pending',
        outlook: 'pending',
        yahoo: 'pending',
      },
    })
    .returning();

  // Trigger background job to process the test
  await inngest.send({
    name: 'test/created',
    data: {
      testId: newTest.id,
      userId: context.userId,
      mode: context.mode,
    },
  });

  // Calculate estimated completion time (5 minutes from now)
  const estimatedCompletion = new Date(Date.now() + 5 * 60 * 1000);

  return apiSuccess({
    test_id: newTest.id,
    status: newTest.status,
    created_at: newTest.createdAt.toISOString(),
    estimated_completion: estimatedCompletion.toISOString(),
  }, 201);
});
