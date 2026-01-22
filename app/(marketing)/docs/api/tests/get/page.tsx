import { EndpointDoc, type ApiEndpoint } from '@/components/docs';

const getTestEndpoint: ApiEndpoint = {
  method: 'GET',
  path: '/v1/tests/{test_id}',
  title: 'Get a test',
  description:
    'Retrieves the details of an existing test. Supply the unique test ID that was returned from your previous request, and the API will return the corresponding test object with its current status and results.',
  parameters: [
    {
      name: 'test_id',
      type: 'string',
      required: true,
      description:
        'The unique identifier of the test to retrieve. Starts with "test_".',
    },
  ],
  requestExample: {},
  responseExample: {
    id: 'test_abc123xyz',
    object: 'test',
    name: 'My Awesome Test',
    type: 'integration',
    status: 'completed',
    created_at: '2024-01-15T10:30:00Z',
    completed_at: '2024-01-15T10:33:42Z',
    from: 'hello@yourdomain.com',
    subject: 'Test Email Subject',
    tags: ['marketing', 'q4-campaign'],
    inbox_placement: {
      gmail: 'inbox',
      outlook: 'inbox',
      yahoo: 'spam',
      apple_mail: 'inbox',
    },
    spam_score: 2.8,
    authentication: {
      spf: 'pass',
      dkim: 'pass',
      dmarc: 'pass',
    },
    recommendations: [
      'Consider warming up your IP for Yahoo',
      'Reduce image-to-text ratio',
    ],
  },
};

export default function GetTestPage() {
  return (
    <EndpointDoc
      endpoint={getTestEndpoint}
      breadcrumb={['API Reference', 'TESTS']}
    />
  );
}
