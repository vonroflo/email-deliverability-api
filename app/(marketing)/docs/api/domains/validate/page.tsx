import { EndpointDoc, type ApiEndpoint } from '@/components/docs';

const validateDomainEndpoint: ApiEndpoint = {
  method: 'POST',
  path: '/v1/domains/{domain}/validate',
  title: 'Validate domain',
  description:
    'Validates the SPF, DKIM, and DMARC DNS records for a domain. This endpoint performs comprehensive DNS lookups to verify that email authentication is correctly configured for the domain.',
  parameters: [
    {
      name: 'domain',
      type: 'string',
      required: true,
      description:
        'The domain name to validate (e.g., "example.com"). Do not include protocol or paths.',
    },
    {
      name: 'dkim_selector',
      type: 'string',
      required: false,
      description:
        'The DKIM selector to check. Defaults to "default". Common selectors include "google", "selector1", "s1", etc.',
      defaultValue: 'default',
    },
  ],
  requestExample: {
    dkim_selector: 'google',
  },
  responseExample: {
    domain: 'example.com',
    spf: {
      valid: true,
      record: 'v=spf1 include:_spf.google.com ~all',
      issues: [],
    },
    dkim: {
      valid: true,
      selector: 'google',
      record: 'v=DKIM1; k=rsa; p=MIIBIjANBg...',
      issues: [],
    },
    dmarc: {
      valid: true,
      policy: 'quarantine',
      record: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com',
      issues: [],
    },
    overall_status: 'pass',
    checked_at: '2024-01-15T10:30:00Z',
  },
};

export default function ValidateDomainPage() {
  return (
    <EndpointDoc
      endpoint={validateDomainEndpoint}
      breadcrumb={['API Reference', 'DOMAINS']}
    />
  );
}
