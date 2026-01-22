import dns from 'dns/promises';

export interface SpfResult {
  valid: boolean;
  record: string | null;
  issues: string[];
}

export interface DkimResult {
  valid: boolean;
  selector: string;
  record: string | null;
  issues: string[];
}

export interface DmarcResult {
  valid: boolean;
  policy: 'none' | 'quarantine' | 'reject' | null;
  record: string | null;
  issues: string[];
}

export interface DnsValidationResult {
  domain: string;
  spf: SpfResult;
  dkim: DkimResult;
  dmarc: DmarcResult;
  issues: string[];
}

// Common DKIM selectors to try
const COMMON_DKIM_SELECTORS = [
  'default',
  'google',
  'selector1',
  'selector2',
  'k1',
  's1',
  's2',
  'dkim',
  'mail',
  'email',
  'smtp',
];

/**
 * Validate SPF, DKIM, and DMARC records for a domain
 */
export async function validateDomainDns(
  domain: string,
  dkimSelector?: string
): Promise<DnsValidationResult> {
  const issues: string[] = [];

  const [spf, dkim, dmarc] = await Promise.all([
    validateSpf(domain),
    validateDkim(domain, dkimSelector),
    validateDmarc(domain),
  ]);

  if (!spf.valid) issues.push('SPF record is missing or invalid');
  if (!dkim.valid) issues.push('DKIM record not found');
  if (!dmarc.valid) issues.push('DMARC record is missing or invalid');

  return {
    domain,
    spf,
    dkim,
    dmarc,
    issues,
  };
}

/**
 * Validate SPF record for a domain
 */
async function validateSpf(domain: string): Promise<SpfResult> {
  const issues: string[] = [];

  try {
    const records = await dns.resolveTxt(domain);
    const flatRecords = records.map((r) => r.join(''));
    const spfRecord = flatRecords.find((r) => r.startsWith('v=spf1'));

    if (!spfRecord) {
      return { valid: false, record: null, issues: ['No SPF record found'] };
    }

    // Basic SPF validation
    if (
      !spfRecord.includes('~all') &&
      !spfRecord.includes('-all') &&
      !spfRecord.includes('?all')
    ) {
      issues.push('SPF record should end with ~all, -all, or ?all');
    }

    // Check record length
    if (spfRecord.length > 255) {
      issues.push(
        'SPF record exceeds 255 character limit - may cause DNS issues'
      );
    }

    // Count DNS lookups (max 10 allowed per RFC 7208)
    const lookupPatterns = ['include:', 'a:', 'mx:', 'ptr:', 'redirect='];
    const lookupCount = lookupPatterns.reduce((count, pattern) => {
      return count + (spfRecord.match(new RegExp(pattern, 'g')) || []).length;
    }, 0);

    if (lookupCount > 10) {
      issues.push(
        `SPF record has ${lookupCount} DNS lookups (max 10 allowed per RFC)`
      );
    }

    // Check for deprecated mechanisms
    if (spfRecord.includes('ptr:') || spfRecord.includes('ptr ')) {
      issues.push('PTR mechanism is deprecated and should not be used');
    }

    // Check for +all (very permissive)
    if (spfRecord.includes('+all')) {
      issues.push(
        'Using +all defeats the purpose of SPF - anyone can send as your domain'
      );
    }

    return {
      valid: issues.length === 0,
      record: spfRecord,
      issues,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      (error as NodeJS.ErrnoException).code === 'ENODATA'
    ) {
      return { valid: false, record: null, issues: ['No TXT records found'] };
    }
    if (
      error instanceof Error &&
      (error as NodeJS.ErrnoException).code === 'ENOTFOUND'
    ) {
      return { valid: false, record: null, issues: ['Domain not found'] };
    }
    return { valid: false, record: null, issues: ['DNS lookup failed'] };
  }
}

/**
 * Validate DKIM record for a domain
 */
async function validateDkim(
  domain: string,
  selector?: string
): Promise<DkimResult> {
  const selectorsToTry = selector ? [selector] : COMMON_DKIM_SELECTORS;

  for (const sel of selectorsToTry) {
    try {
      const dkimDomain = `${sel}._domainkey.${domain}`;
      const records = await dns.resolveTxt(dkimDomain);
      const dkimRecord = records.map((r) => r.join('')).join('');

      if (dkimRecord.includes('v=DKIM1')) {
        const issues: string[] = [];

        // Check for public key
        if (!dkimRecord.includes('p=')) {
          issues.push('DKIM record missing public key');
        }

        // Check if key is revoked (empty p= value)
        const keyMatch = dkimRecord.match(/p=([^;]*)/);
        if (keyMatch && keyMatch[1].trim() === '') {
          issues.push('DKIM key is revoked (empty public key)');
        }

        // Check key type
        if (dkimRecord.includes('k=') && !dkimRecord.includes('k=rsa')) {
          issues.push('Non-RSA DKIM keys may have compatibility issues');
        }

        return {
          valid: issues.length === 0,
          selector: sel,
          record: dkimRecord,
          issues,
        };
      }
    } catch {
      // Try next selector
      continue;
    }
  }

  return {
    valid: false,
    selector: selector || 'not_found',
    record: null,
    issues: selector
      ? [`No DKIM record found for selector "${selector}"`]
      : ['No DKIM record found for common selectors'],
  };
}

/**
 * Validate DMARC record for a domain
 */
async function validateDmarc(domain: string): Promise<DmarcResult> {
  const issues: string[] = [];

  try {
    const dmarcDomain = `_dmarc.${domain}`;
    const records = await dns.resolveTxt(dmarcDomain);
    const flatRecords = records.map((r) => r.join(''));
    const dmarcRecord = flatRecords.find((r) => r.startsWith('v=DMARC1'));

    if (!dmarcRecord) {
      return {
        valid: false,
        policy: null,
        record: null,
        issues: ['No DMARC record found'],
      };
    }

    // Extract policy
    const policyMatch = dmarcRecord.match(/p=(none|quarantine|reject)/i);
    const policy = policyMatch
      ? (policyMatch[1].toLowerCase() as 'none' | 'quarantine' | 'reject')
      : null;

    if (!policy) {
      issues.push('DMARC record missing policy (p=)');
    } else if (policy === 'none') {
      issues.push(
        'DMARC policy is set to "none" - consider "quarantine" or "reject" for better protection'
      );
    }

    // Check for aggregate report address
    if (!dmarcRecord.includes('rua=')) {
      issues.push(
        'DMARC record missing aggregate report address (rua) - you won\'t receive reports'
      );
    }

    // Check for forensic report address
    if (!dmarcRecord.includes('ruf=')) {
      issues.push(
        'Consider adding forensic report address (ruf) for detailed failure reports'
      );
    }

    // Check subdomain policy
    if (
      policy === 'reject' &&
      dmarcRecord.includes('sp=none')
    ) {
      issues.push(
        'Subdomain policy (sp=none) is weaker than main policy - consider aligning them'
      );
    }

    // Check percentage
    const pctMatch = dmarcRecord.match(/pct=(\d+)/);
    if (pctMatch) {
      const pct = parseInt(pctMatch[1], 10);
      if (pct < 100) {
        issues.push(
          `DMARC policy only applies to ${pct}% of emails - consider increasing to 100%`
        );
      }
    }

    return {
      valid: policy !== null,
      policy,
      record: dmarcRecord,
      issues,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      (error as NodeJS.ErrnoException).code === 'ENODATA'
    ) {
      return {
        valid: false,
        policy: null,
        record: null,
        issues: ['No DMARC TXT record found'],
      };
    }
    if (
      error instanceof Error &&
      (error as NodeJS.ErrnoException).code === 'ENOTFOUND'
    ) {
      return {
        valid: false,
        policy: null,
        record: null,
        issues: ['DMARC domain not found'],
      };
    }
    return {
      valid: false,
      policy: null,
      record: null,
      issues: ['DNS lookup failed'],
    };
  }
}
