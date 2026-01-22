import { EndpointDoc, type ApiEndpoint } from '@/components/docs';

const listResultsEndpoint: ApiEndpoint = {
  method: 'GET',
  path: '/v1/results',
  title: 'List results',
  description:
    'Returns a paginated list of test results. Results are returned sorted by completion date, with the most recent results appearing first. Only completed tests will have results.',
  parameters: [
    {
      name: 'limit',
      type: 'number',
      required: false,
      description:
        'Maximum number of results to return per page. Defaults to 20, maximum is 100.',
      defaultValue: '20',
    },
    {
      name: 'starting_after',
      type: 'string',
      required: false,
      description:
        'A cursor for pagination. Pass the ID of the last result from the previous page.',
    },
    {
      name: 'test_id',
      type: 'string',
      required: false,
      description:
        'Filter results to a specific test.',
    },
    {
      name: 'inbox_placement',
      type: 'enum',
      required: false,
      description: 'Filter by inbox placement outcome for any provider.',
      enumValues: ['inbox', 'spam', 'missing'],
    },
  ],
  requestExample: {},
  responseExample: {
    object: 'list',
    data: [
      {
        id: 'result_abc123xyz',
        object: 'result',
        test_id: 'test_abc123xyz',
        provider: 'gmail',
        placement: 'inbox',
        delivery_time_ms: 2340,
        headers_received: {
          'received-spf': 'pass',
          'authentication-results': 'spf=pass dkim=pass dmarc=pass',
        },
        completed_at: '2024-01-15T10:33:42Z',
      },
      {
        id: 'result_def456uvw',
        object: 'result',
        test_id: 'test_abc123xyz',
        provider: 'outlook',
        placement: 'inbox',
        delivery_time_ms: 3120,
        headers_received: {
          'received-spf': 'pass',
          'authentication-results': 'spf=pass dkim=pass dmarc=pass',
        },
        completed_at: '2024-01-15T10:33:45Z',
      },
    ],
    has_more: true,
    url: '/v1/results',
  },
};

export default function ListResultsPage() {
  return (
    <EndpointDoc
      endpoint={listResultsEndpoint}
      breadcrumb={['API Reference', 'RESULTS']}
    />
  );
}
