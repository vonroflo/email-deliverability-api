import { EndpointDoc, type ApiEndpoint } from '@/components/docs';

const createTestEndpoint: ApiEndpoint = {
  method: 'POST',
  path: '/v1/tests',
  title: 'Create a test',
  description:
    'Creates a new test object for your project. Tests can be categorized as unit, integration, or end-to-end (e2e). This operation is asynchronous and will return a test object with a status of queued.',
  parameters: [
    {
      name: 'name',
      type: 'string',
      required: true,
      description:
        'A human-readable name for the test. This will be displayed in the dashboard and results.',
    },
    {
      name: 'type',
      type: 'enum',
      required: true,
      description: 'The type of test to perform.',
      enumValues: ['unit', 'integration', 'e2e'],
    },
    {
      name: 'from',
      type: 'string',
      required: true,
      description: 'The sender email address to use for the test.',
    },
    {
      name: 'subject',
      type: 'string',
      required: true,
      description: 'The email subject line to test.',
    },
    {
      name: 'html',
      type: 'string',
      required: false,
      description: 'The HTML content of the email body.',
    },
    {
      name: 'text',
      type: 'string',
      required: false,
      description: 'The plain text content of the email body.',
    },
    {
      name: 'tags',
      type: 'array',
      required: false,
      description:
        'A list of tags to associate with the test for organizational purposes.',
    },
  ],
  requestExample: {
    name: 'My Awesome Test',
    type: 'integration',
    from: 'hello@yourdomain.com',
    subject: 'Test Email Subject',
    html: '<h1>Hello World</h1><p>This is a test email.</p>',
    tags: ['marketing', 'q4-campaign'],
  },
  responseExample: {
    id: 'test_abc123xyz',
    object: 'test',
    name: 'My Awesome Test',
    type: 'integration',
    status: 'queued',
    created_at: '2024-01-15T10:30:00Z',
    from: 'hello@yourdomain.com',
    subject: 'Test Email Subject',
    tags: ['marketing', 'q4-campaign'],
  },
};

export default function CreateTestPage() {
  return (
    <EndpointDoc
      endpoint={createTestEndpoint}
      breadcrumb={['API Reference', 'TESTS']}
    />
  );
}
