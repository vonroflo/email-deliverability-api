import { EndpointDoc, type ApiEndpoint } from '@/components/docs';

const checkDnsEndpoint: ApiEndpoint = {
  method: 'GET',
  path: '/v1/domains/{domain}/dns',
  title: 'Check DNS',
  description:
    'Retrieves the current DNS configuration for a domain including MX records, SPF, DKIM, and DMARC records. This is useful for debugging email deliverability issues and verifying DNS propagation.',
  parameters: [
    {
      name: 'domain',
      type: 'string',
      required: true,
      description:
        'The domain name to check (e.g., "example.com"). Do not include protocol or paths.',
    },
    {
      name: 'record_types',
      type: 'array',
      required: false,
      description:
        'Specific record types to check. If not provided, all email-related records are checked.',
    },
  ],
  requestExample: {},
  responseExample: {
    domain: 'example.com',
    mx_records: [
      {
        priority: 1,
        host: 'aspmx.l.google.com',
      },
      {
        priority: 5,
        host: 'alt1.aspmx.l.google.com',
      },
      {
        priority: 5,
        host: 'alt2.aspmx.l.google.com',
      },
    ],
    spf_record: 'v=spf1 include:_spf.google.com ~all',
    dkim_records: [
      {
        selector: 'google',
        record: 'v=DKIM1; k=rsa; p=MIIBIjANBg...',
      },
    ],
    dmarc_record: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com',
    bimi_record: null,
    ttl: {
      mx: 3600,
      spf: 3600,
      dkim: 3600,
      dmarc: 3600,
    },
    checked_at: '2024-01-15T10:30:00Z',
  },
};

export default function CheckDnsPage() {
  return (
    <EndpointDoc
      endpoint={checkDnsEndpoint}
      breadcrumb={['API Reference', 'DOMAINS']}
    />
  );
}
