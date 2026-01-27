import { z } from 'zod';

// =============================================================================
// SSRF Protection Helper
// =============================================================================

/**
 * Validates that a webhook URL is safe (not pointing to internal services)
 */
function isPublicUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);

    // Only allow HTTP(S) protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false;
    }

    const hostname = url.hostname.toLowerCase();

    // Block localhost variations
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '[::1]' ||
      hostname.endsWith('.localhost')
    ) {
      return false;
    }

    // Block common internal hostnames
    if (
      hostname === 'metadata' ||
      hostname === 'metadata.google.internal' ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.local')
    ) {
      return false;
    }

    // Block private IP ranges (basic check for common patterns)
    // 10.x.x.x, 172.16-31.x.x, 192.168.x.x, 169.254.x.x
    const ipPatterns = [
      /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
      /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/,
      /^192\.168\.\d{1,3}\.\d{1,3}$/,
      /^169\.254\.\d{1,3}\.\d{1,3}$/,
      /^0\.0\.0\.0$/,
    ];

    if (ipPatterns.some((pattern) => pattern.test(hostname))) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

// =============================================================================
// Request Schemas
// =============================================================================

export const createTestSchema = z
  .object({
    from: z.string().email('Invalid from address'),
    subject: z.string().min(1, 'Subject is required').max(500),
    html: z.string().optional(),
    text: z.string().optional(),
    webhook_url: z
      .string()
      .url()
      .refine((url) => isPublicUrl(url), {
        message: 'Webhook URL must be a public HTTPS endpoint',
      })
      .optional(),
  })
  .refine((data) => data.html || data.text, {
    message: 'Either html or text content is required',
  });

export const validateDomainSchema = z.object({
  dkim_selector: z.string().optional(),
});

// =============================================================================
// Response Types (for documentation/validation)
// =============================================================================

export const testStatusSchema = z.enum(['processing', 'completed', 'failed']);

export const placementResultSchema = z.enum([
  'inbox',
  'spam',
  'promotions',
  'junk',
  'bulk',
  'not_found',
  'pending',
]);

export const inboxPlacementSchema = z.object({
  gmail: placementResultSchema.optional(),
  outlook: placementResultSchema.optional(),
  yahoo: placementResultSchema.optional(),
});

export const authenticationResultSchema = z.object({
  spf: z.enum(['pass', 'fail', 'neutral', 'softfail', 'none']).optional(),
  dkim: z.enum(['pass', 'fail', 'none']).optional(),
  dmarc: z.enum(['pass', 'fail', 'none']).optional(),
});

export const testResponseSchema = z.object({
  test_id: z.string().uuid(),
  status: testStatusSchema,
  created_at: z.string().datetime(),
  estimated_completion: z.string().datetime().optional(),
  completed_at: z.string().datetime().optional().nullable(),
  inbox_placement: inboxPlacementSchema.optional().nullable(),
  spam_score: z.number().optional().nullable(),
  authentication: authenticationResultSchema.optional().nullable(),
  recommendations: z.array(z.string()).optional().nullable(),
});

export const spfResultSchema = z.object({
  valid: z.boolean(),
  record: z.string().nullable(),
  issues: z.array(z.string()),
});

export const dkimResultSchema = z.object({
  valid: z.boolean(),
  selector: z.string(),
  record: z.string().nullable(),
  issues: z.array(z.string()),
});

export const dmarcResultSchema = z.object({
  valid: z.boolean(),
  policy: z.enum(['none', 'quarantine', 'reject']).nullable(),
  record: z.string().nullable(),
  issues: z.array(z.string()),
});

export const domainValidationResponseSchema = z.object({
  domain: z.string(),
  spf: spfResultSchema,
  dkim: dkimResultSchema,
  dmarc: dmarcResultSchema,
  issues: z.array(z.string()),
});

export const apiErrorSchema = z.object({
  error: z.object({
    message: z.string(),
    code: z.string(),
    status: z.number(),
  }),
});

// =============================================================================
// Inferred Types
// =============================================================================

export type CreateTestInput = z.infer<typeof createTestSchema>;
export type ValidateDomainInput = z.infer<typeof validateDomainSchema>;
export type TestStatus = z.infer<typeof testStatusSchema>;
export type PlacementResult = z.infer<typeof placementResultSchema>;
export type InboxPlacement = z.infer<typeof inboxPlacementSchema>;
export type AuthenticationResult = z.infer<typeof authenticationResultSchema>;
export type TestResponse = z.infer<typeof testResponseSchema>;
export type SpfResult = z.infer<typeof spfResultSchema>;
export type DkimResult = z.infer<typeof dkimResultSchema>;
export type DmarcResult = z.infer<typeof dmarcResultSchema>;
export type DomainValidationResponse = z.infer<
  typeof domainValidationResponseSchema
>;
export type ApiErrorResponse = z.infer<typeof apiErrorSchema>;
