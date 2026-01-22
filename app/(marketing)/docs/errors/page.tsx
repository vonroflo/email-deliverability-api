'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, ArrowRight, AlertCircle, XCircle, AlertTriangle } from 'lucide-react';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-success" />
          <span className="text-success">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

function CodeBlock({ code, title }: { code: string; title?: string }) {
  return (
    <div className="rounded-lg bg-charcoal-800 border border-charcoal-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-charcoal-700 bg-charcoal-900/50">
        {title && <span className="text-xs font-medium text-text-muted">{title}</span>}
        {!title && <span />}
        <CopyButton text={code} />
      </div>
      <pre className="p-4 text-sm font-mono text-text-secondary overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

interface ErrorCode {
  code: string;
  httpStatus: number;
  description: string;
  resolution: string;
}

const errorCodes: ErrorCode[] = [
  {
    code: 'invalid_api_key',
    httpStatus: 401,
    description: 'The API key provided is invalid or has been revoked.',
    resolution: 'Check your API key in the Dashboard and ensure it\'s correctly formatted.',
  },
  {
    code: 'missing_api_key',
    httpStatus: 401,
    description: 'No API key was provided in the request.',
    resolution: 'Add the Authorization header with your API key: Bearer sk_live_xxxxx',
  },
  {
    code: 'invalid_request',
    httpStatus: 400,
    description: 'The request body or parameters are invalid.',
    resolution: 'Check the request format against the API documentation.',
  },
  {
    code: 'missing_parameter',
    httpStatus: 400,
    description: 'A required parameter is missing from the request.',
    resolution: 'Include all required parameters as specified in the endpoint documentation.',
  },
  {
    code: 'invalid_parameter',
    httpStatus: 400,
    description: 'A parameter value is invalid or in the wrong format.',
    resolution: 'Check the parameter type and format requirements in the documentation.',
  },
  {
    code: 'resource_not_found',
    httpStatus: 404,
    description: 'The requested resource (test, domain, etc.) does not exist.',
    resolution: 'Verify the resource ID is correct and belongs to your account.',
  },
  {
    code: 'rate_limit_exceeded',
    httpStatus: 429,
    description: 'Too many requests have been made in a short period.',
    resolution: 'Wait before retrying. Implement exponential backoff in your code.',
  },
  {
    code: 'quota_exceeded',
    httpStatus: 402,
    description: 'Your monthly test quota has been exceeded.',
    resolution: 'Upgrade your plan or wait until your quota resets next month.',
  },
  {
    code: 'test_failed',
    httpStatus: 500,
    description: 'The deliverability test failed to complete.',
    resolution: 'Retry the test. If the issue persists, contact support.',
  },
  {
    code: 'internal_error',
    httpStatus: 500,
    description: 'An unexpected error occurred on our servers.',
    resolution: 'Retry the request. If the issue persists, contact support.',
  },
];

function StatusBadge({ status }: { status: number }) {
  let colorClass = '';
  if (status >= 200 && status < 300) {
    colorClass = 'bg-success/10 text-success';
  } else if (status >= 400 && status < 500) {
    colorClass = 'bg-warning/10 text-warning';
  } else {
    colorClass = 'bg-error/10 text-error';
  }

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${colorClass}`}>
      {status}
    </span>
  );
}

export default function ErrorsPage() {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-text-muted mb-4">
          <Link href="/docs" className="hover:text-text-secondary">
            Documentation
          </Link>
          <span>/</span>
          <span className="text-text-secondary">Errors</span>
        </div>
        <h1 className="text-4xl font-bold text-text-primary mb-4">Errors</h1>
        <p className="text-lg text-text-muted">
          DeliverabilityAPI uses conventional HTTP response codes to indicate the
          success or failure of an API request.
        </p>
      </div>

      {/* HTTP Status Codes Overview */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          HTTP Status Codes
        </h2>
        <p className="text-text-muted mb-6">
          In general: codes in the <code className="text-success">2xx</code> range
          indicate success, codes in the <code className="text-warning">4xx</code>{' '}
          range indicate an error from information provided, and codes in the{' '}
          <code className="text-error">5xx</code> range indicate an error with our
          servers.
        </p>

        <div className="grid gap-4">
          <div className="p-4 rounded-lg bg-success/5 border border-success/20">
            <div className="flex items-center gap-3 mb-2">
              <StatusBadge status={200} />
              <span className="font-medium text-text-primary">OK</span>
            </div>
            <p className="text-sm text-text-muted">
              The request succeeded. The response will contain the requested data.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
            <div className="flex items-center gap-3 mb-2">
              <StatusBadge status={400} />
              <span className="font-medium text-text-primary">Bad Request</span>
            </div>
            <p className="text-sm text-text-muted">
              The request was malformed or missing required parameters.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
            <div className="flex items-center gap-3 mb-2">
              <StatusBadge status={401} />
              <span className="font-medium text-text-primary">Unauthorized</span>
            </div>
            <p className="text-sm text-text-muted">
              No valid API key was provided.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
            <div className="flex items-center gap-3 mb-2">
              <StatusBadge status={402} />
              <span className="font-medium text-text-primary">Payment Required</span>
            </div>
            <p className="text-sm text-text-muted">
              Your quota has been exceeded. Upgrade your plan to continue.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
            <div className="flex items-center gap-3 mb-2">
              <StatusBadge status={404} />
              <span className="font-medium text-text-primary">Not Found</span>
            </div>
            <p className="text-sm text-text-muted">
              The requested resource doesn&apos;t exist.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
            <div className="flex items-center gap-3 mb-2">
              <StatusBadge status={429} />
              <span className="font-medium text-text-primary">Too Many Requests</span>
            </div>
            <p className="text-sm text-text-muted">
              Too many requests hit the API too quickly. Implement exponential backoff.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-error/5 border border-error/20">
            <div className="flex items-center gap-3 mb-2">
              <StatusBadge status={500} />
              <span className="font-medium text-text-primary">Server Error</span>
            </div>
            <p className="text-sm text-text-muted">
              Something went wrong on our end. Please retry or contact support.
            </p>
          </div>
        </div>
      </div>

      {/* Error Response Format */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Error Response Format
        </h2>
        <p className="text-text-muted mb-6">
          All errors return a JSON response with an <code>error</code> object
          containing details about what went wrong.
        </p>

        <CodeBlock
          title="Error Response Structure"
          code={`{
  "error": {
    "type": "invalid_request_error",
    "code": "missing_parameter",
    "message": "Missing required parameter: 'from'",
    "param": "from",
    "doc_url": "https://docs.deliverability.dev/api/tests/create"
  }
}`}
        />

        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold text-text-primary">Error Object Fields</h3>
          <div className="space-y-2">
            {[
              { name: 'type', description: 'The type of error (e.g., authentication_error, invalid_request_error)' },
              { name: 'code', description: 'A short string identifying the specific error' },
              { name: 'message', description: 'A human-readable description of the error' },
              { name: 'param', description: 'The parameter that caused the error (if applicable)' },
              { name: 'doc_url', description: 'A link to the relevant documentation (if applicable)' },
            ].map((field) => (
              <div key={field.name} className="flex items-start gap-3 p-3 rounded-lg bg-charcoal-800/50">
                <code className="text-sm font-mono text-brand-blue shrink-0">{field.name}</code>
                <span className="text-sm text-text-muted">{field.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error Codes Reference */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Error Codes Reference
        </h2>
        <p className="text-text-muted mb-6">
          Below is a complete list of error codes you may encounter when using the API.
        </p>

        <div className="space-y-3">
          {errorCodes.map((error) => (
            <div
              key={error.code}
              className="p-4 rounded-lg bg-charcoal-800 border border-charcoal-700"
            >
              <div className="flex items-center gap-3 mb-2">
                <code className="text-sm font-mono text-text-primary font-semibold">
                  {error.code}
                </code>
                <StatusBadge status={error.httpStatus} />
              </div>
              <p className="text-sm text-text-muted mb-2">{error.description}</p>
              <p className="text-sm text-text-dimmed">
                <span className="text-text-muted">Resolution:</span> {error.resolution}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Handling Errors */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Handling Errors
        </h2>
        <p className="text-text-muted mb-6">
          We recommend writing code that gracefully handles all possible API errors.
        </p>

        <CodeBlock
          title="Node.js Error Handling"
          code={`import { DeliverabilityClient, DeliverabilityError } from '@deliverability/sdk';

const client = new DeliverabilityClient('sk_live_xxxxx');

try {
  const test = await client.tests.create({
    from: 'noreply@example.com',
    subject: 'Test Email',
    html: '<p>Hello World</p>',
  });
  console.log('Test created:', test.id);
} catch (error) {
  if (error instanceof DeliverabilityError) {
    switch (error.code) {
      case 'invalid_api_key':
        console.error('Check your API key');
        break;
      case 'rate_limit_exceeded':
        console.error('Rate limited, retrying in', error.retryAfter, 'seconds');
        break;
      case 'quota_exceeded':
        console.error('Quota exceeded, upgrade your plan');
        break;
      default:
        console.error('API error:', error.message);
    }
  } else {
    console.error('Unexpected error:', error);
  }
}`}
        />
      </div>

      {/* Retry Strategy */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Retry Strategy
        </h2>
        <p className="text-text-muted mb-6">
          For transient errors (5xx and 429), we recommend implementing exponential
          backoff with jitter.
        </p>

        <div className="p-4 rounded-lg bg-brand-blue/5 border border-brand-blue/20 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-text-primary mb-1">
                Rate Limit Headers
              </h3>
              <p className="text-sm text-text-muted">
                When rate limited, check the <code>Retry-After</code> header for the
                number of seconds to wait before retrying.
              </p>
            </div>
          </div>
        </div>

        <CodeBlock
          title="Exponential Backoff Example"
          code={`async function fetchWithRetry(fn, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error.code === 'rate_limit_exceeded' || error.status >= 500) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
        const jitter = Math.random() * 1000;
        await new Promise(r => setTimeout(r, delay + jitter));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}`}
        />
      </div>

      {/* Next steps */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/docs/rate-limits"
          className="group p-5 rounded-lg bg-charcoal-800 border border-charcoal-700 hover:border-brand-blue/50 transition-colors"
        >
          <h3 className="text-base font-semibold text-text-primary mb-1 flex items-center gap-2">
            Rate Limits
            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </h3>
          <p className="text-sm text-text-muted">
            Learn about API rate limits and how to handle them.
          </p>
        </Link>
        <Link
          href="/docs/authentication"
          className="group p-5 rounded-lg bg-charcoal-800 border border-charcoal-700 hover:border-brand-blue/50 transition-colors"
        >
          <h3 className="text-base font-semibold text-text-primary mb-1 flex items-center gap-2">
            Authentication
            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </h3>
          <p className="text-sm text-text-muted">
            Learn about API keys and authentication.
          </p>
        </Link>
      </div>
    </div>
  );
}
