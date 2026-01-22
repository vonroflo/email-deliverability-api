import { EndpointDoc, type ApiEndpoint } from '@/components/docs';

const listTestsEndpoint: ApiEndpoint = {
  method: 'GET',
  path: '/v1/tests',
  title: 'List all tests',
  description:
    'Returns a paginated list of all tests created by your account. Tests are returned sorted by creation date, with the most recent tests appearing first.',
  parameters: [
    {
      name: 'limit',
      type: 'number',
      required: false,
      description:
        'Maximum number of tests to return per page. Defaults to 20, maximum is 100.',
      defaultValue: '20',
    },
    {
      name: 'starting_after',
      type: 'string',
      required: false,
      description:
        'A cursor for pagination. Pass the ID of the last test from the previous page to get the next page.',
    },
    {
      name: 'ending_before',
      type: 'string',
      required: false,
      description:
        'A cursor for pagination. Pass the ID of the first test from the previous page to get the previous page.',
    },
    {
      name: 'status',
      type: 'enum',
      required: false,
      description: 'Filter tests by status.',
      enumValues: ['queued', 'processing', 'completed', 'failed'],
    },
    {
      name: 'created_gte',
      type: 'string',
      required: false,
      description:
        'Filter tests created on or after this date (ISO 8601 format).',
    },
    {
      name: 'created_lte',
      type: 'string',
      required: false,
      description:
        'Filter tests created on or before this date (ISO 8601 format).',
    },
  ],
  requestExample: {},
  responseExample: {
    object: 'list',
    data: [
      {
        id: 'test_abc123xyz',
        object: 'test',
        name: 'Welcome Email Test',
        type: 'integration',
        status: 'completed',
        created_at: '2024-01-15T10:30:00Z',
        completed_at: '2024-01-15T10:33:42Z',
        from: 'hello@yourdomain.com',
        subject: 'Welcome to Our Service',
      },
      {
        id: 'test_def456uvw',
        object: 'test',
        name: 'Password Reset Test',
        type: 'unit',
        status: 'completed',
        created_at: '2024-01-14T15:20:00Z',
        completed_at: '2024-01-14T15:22:18Z',
        from: 'noreply@yourdomain.com',
        subject: 'Reset Your Password',
      },
    ],
    has_more: true,
    url: '/v1/tests',
  },
};

export default function ListTestsPage() {
  return (
    <EndpointDoc
      endpoint={listTestsEndpoint}
      breadcrumb={['API Reference', 'TESTS']}
    />
  );
}
