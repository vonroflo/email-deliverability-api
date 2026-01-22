import { Resend } from 'resend';
import crypto from 'crypto';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Seed inbox email addresses (configured via environment variables)
const SEED_INBOXES = {
  gmail: process.env.SEED_GMAIL_USER,
  outlook: process.env.SEED_OUTLOOK_USER,
  yahoo: process.env.SEED_YAHOO_USER,
};

export interface SendTestEmailParams {
  from: string;
  subject: string;
  html?: string;
  text?: string;
}

export interface SendTestEmailResult {
  success: boolean;
  testMarker: string;
  messageIds: {
    gmail?: string;
    outlook?: string;
    yahoo?: string;
  };
  errors?: {
    gmail?: string;
    outlook?: string;
    yahoo?: string;
  };
}

/**
 * Get list of configured seed inbox addresses
 */
export function getSeedInboxAddresses(): { provider: string; email: string }[] {
  const addresses: { provider: string; email: string }[] = [];

  if (SEED_INBOXES.gmail) {
    addresses.push({ provider: 'gmail', email: SEED_INBOXES.gmail });
  }
  if (SEED_INBOXES.outlook) {
    addresses.push({ provider: 'outlook', email: SEED_INBOXES.outlook });
  }
  if (SEED_INBOXES.yahoo) {
    addresses.push({ provider: 'yahoo', email: SEED_INBOXES.yahoo });
  }

  return addresses;
}

/**
 * Send test email to all configured seed inboxes
 */
export async function sendTestEmail(
  params: SendTestEmailParams
): Promise<SendTestEmailResult> {
  const seedAddresses = getSeedInboxAddresses();

  if (seedAddresses.length === 0) {
    throw new Error('No seed inbox addresses configured');
  }

  // Generate unique test marker for tracking
  const testMarker = `deliverability-test-${crypto.randomUUID()}`;

  // Add marker to subject for easy identification
  const markedSubject = `${params.subject} [${testMarker}]`;

  const messageIds: SendTestEmailResult['messageIds'] = {};
  const errors: SendTestEmailResult['errors'] = {};

  // Send to each seed inbox
  for (const { provider, email } of seedAddresses) {
    try {
      // Build email options - Resend requires at least html or text
      // Construct conditionally to satisfy TypeScript's strict union types
      const baseOptions = {
        from: params.from,
        to: email,
        subject: markedSubject,
        headers: {
          'X-Test-Marker': testMarker,
        },
      };

      // Ensure at least one content type is present
      const emailContent = params.html || params.text || 'Test email content';
      
      let emailOptions;
      if (params.html && params.text) {
        // Both html and text
        emailOptions = { ...baseOptions, html: params.html, text: params.text };
      } else if (params.html) {
        // Only html
        emailOptions = { ...baseOptions, html: params.html };
      } else if (params.text) {
        // Only text
        emailOptions = { ...baseOptions, text: params.text };
      } else {
        // Fallback: use text
        emailOptions = { ...baseOptions, text: emailContent };
      }

      const result = await resend.emails.send(emailOptions);

      if (result.data?.id) {
        messageIds[provider as keyof typeof messageIds] = result.data.id;
      } else if (result.error) {
        errors[provider as keyof typeof errors] = result.error.message;
      }
    } catch (error) {
      console.error(`Failed to send to ${provider} (${email}):`, error);
      errors[provider as keyof typeof errors] =
        error instanceof Error ? error.message : 'Unknown error';
    }
  }

  const successCount = Object.keys(messageIds).length;
  const totalCount = seedAddresses.length;

  return {
    success: successCount > 0,
    testMarker,
    messageIds,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
}

/**
 * Build raw email content for spam checking
 * (Used by the spam score module)
 */
export function buildRawEmail(params: {
  from: string;
  to: string;
  subject: string;
  html?: string;
  text?: string;
}): string {
  const boundary = `----=_Part_${crypto.randomUUID().replace(/-/g, '')}`;
  const date = new Date().toUTCString();

  let email = `From: ${params.from}\r\n`;
  email += `To: ${params.to}\r\n`;
  email += `Subject: ${params.subject}\r\n`;
  email += `Date: ${date}\r\n`;
  email += `MIME-Version: 1.0\r\n`;

  if (params.html && params.text) {
    // Multipart email
    email += `Content-Type: multipart/alternative; boundary="${boundary}"\r\n\r\n`;
    email += `--${boundary}\r\n`;
    email += `Content-Type: text/plain; charset=UTF-8\r\n\r\n`;
    email += `${params.text}\r\n\r\n`;
    email += `--${boundary}\r\n`;
    email += `Content-Type: text/html; charset=UTF-8\r\n\r\n`;
    email += `${params.html}\r\n\r\n`;
    email += `--${boundary}--\r\n`;
  } else if (params.html) {
    email += `Content-Type: text/html; charset=UTF-8\r\n\r\n`;
    email += params.html;
  } else {
    email += `Content-Type: text/plain; charset=UTF-8\r\n\r\n`;
    email += params.text || '';
  }

  return email;
}
