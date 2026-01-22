import { withApiAuth, apiSuccess, parseJsonBody } from '@/lib/api/middleware';
import { Errors } from '@/lib/api/errors';
import { validateDomainSchema, type ValidateDomainInput } from '@/lib/api/schemas';
import { validateDomainDns } from '@/lib/email/dns-validation';

interface DomainParams extends Record<string, string> {
  domain: string;
}

export const POST = withApiAuth<DomainParams>(async (request, context, params) => {
  const { domain } = params;

  // Validate domain format
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
  if (!domainRegex.test(domain)) {
    throw Errors.ValidationError('Invalid domain format');
  }

  // Parse optional body for DKIM selector
  let dkimSelector: string | undefined;
  try {
    const body = await parseJsonBody<ValidateDomainInput>(request);
    const result = validateDomainSchema.safeParse(body);
    if (result.success && result.data.dkim_selector) {
      dkimSelector = result.data.dkim_selector;
    }
  } catch {
    // Body is optional, ignore parse errors
  }

  // Perform DNS validation
  const validation = await validateDomainDns(domain, dkimSelector);

  return apiSuccess({
    domain: validation.domain,
    spf: {
      valid: validation.spf.valid,
      record: validation.spf.record,
      issues: validation.spf.issues,
    },
    dkim: {
      valid: validation.dkim.valid,
      selector: validation.dkim.selector,
      record: validation.dkim.record,
      issues: validation.dkim.issues,
    },
    dmarc: {
      valid: validation.dmarc.valid,
      policy: validation.dmarc.policy,
      record: validation.dmarc.record,
      issues: validation.dmarc.issues,
    },
    issues: validation.issues,
  });
});
