import { EndpointDoc, type ApiEndpoint } from '@/components/docs';

const getResultEndpoint: ApiEndpoint = {
  method: 'GET',
  path: '/v1/results/{result_id}',
  title: 'Get result',
  description:
    'Retrieves the detailed result for a specific inbox provider from a test. This includes the full email headers received, delivery time, and authentication status.',
  parameters: [
    {
      name: 'result_id',
      type: 'string',
      required: true,
      description:
        'The unique identifier of the result to retrieve. Starts with "result_".',
    },
  ],
  requestExample: {},
  responseExample: {
    id: 'result_abc123xyz',
    object: 'result',
    test_id: 'test_abc123xyz',
    provider: 'gmail',
    placement: 'inbox',
    delivery_time_ms: 2340,
    spam_score: 1.2,
    headers_received: {
      'received-spf': 'pass (google.com: domain of noreply@example.com designates 123.45.67.89 as permitted sender)',
      'authentication-results': 'mx.google.com; dkim=pass header.i=@example.com header.s=google header.b=abc123; spf=pass smtp.mailfrom=noreply@example.com; dmarc=pass (p=QUARANTINE sp=QUARANTINE dis=NONE) header.from=example.com',
      'arc-authentication-results': 'i=1; mx.google.com; dkim=pass; spf=pass; dmarc=pass',
      'dkim-signature': 'v=1; a=rsa-sha256; c=relaxed/relaxed; d=example.com; s=google; h=...',
    },
    authentication: {
      spf: {
        result: 'pass',
        domain: 'example.com',
        ip: '123.45.67.89',
      },
      dkim: {
        result: 'pass',
        domain: 'example.com',
        selector: 'google',
      },
      dmarc: {
        result: 'pass',
        policy: 'quarantine',
        alignment: 'strict',
      },
    },
    metadata: {
      folder: 'INBOX',
      message_id: '<abc123@mail.example.com>',
      received_at: '2024-01-15T10:33:42Z',
    },
    completed_at: '2024-01-15T10:33:42Z',
  },
};

export default function GetResultPage() {
  return (
    <EndpointDoc
      endpoint={getResultEndpoint}
      breadcrumb={['API Reference', 'RESULTS']}
    />
  );
}
