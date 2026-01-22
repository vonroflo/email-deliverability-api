import { EndpointDoc, type ApiEndpoint } from '@/components/docs';

const deleteTestEndpoint: ApiEndpoint = {
  method: 'DELETE',
  path: '/v1/tests/{test_id}',
  title: 'Delete a test',
  description:
    'Permanently deletes a test and all associated data. This action cannot be undone. If the test is currently processing, it will be cancelled before deletion.',
  parameters: [
    {
      name: 'test_id',
      type: 'string',
      required: true,
      description:
        'The unique identifier of the test to delete. Starts with "test_".',
    },
  ],
  requestExample: {},
  responseExample: {
    id: 'test_abc123xyz',
    object: 'test',
    deleted: true,
  },
};

export default function DeleteTestPage() {
  return (
    <EndpointDoc
      endpoint={deleteTestEndpoint}
      breadcrumb={['API Reference', 'TESTS']}
    />
  );
}
