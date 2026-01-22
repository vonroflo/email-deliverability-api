'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

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

export default function PaginationPage() {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-text-muted mb-4">
          <Link href="/docs" className="hover:text-text-secondary">
            Documentation
          </Link>
          <span>/</span>
          <span className="text-text-secondary">Pagination</span>
        </div>
        <h1 className="text-4xl font-bold text-text-primary mb-4">Pagination</h1>
        <p className="text-lg text-text-muted">
          All list endpoints in the DeliverabilityAPI use cursor-based pagination to
          efficiently navigate through large result sets.
        </p>
      </div>

      {/* Overview */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          How Pagination Works
        </h2>
        <p className="text-text-muted mb-6">
          The API uses cursor-based pagination rather than offset-based pagination.
          This approach is more efficient and handles real-time data changes better.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-charcoal-800 border border-charcoal-700">
            <h3 className="text-sm font-semibold text-text-primary mb-2">
              Cursor-based (our approach)
            </h3>
            <ul className="text-sm text-text-muted space-y-1">
              <li>+ Consistent results with real-time data</li>
              <li>+ Efficient for large datasets</li>
              <li>+ Handles insertions/deletions gracefully</li>
              <li>- Cannot jump to arbitrary pages</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-charcoal-800 border border-charcoal-700 opacity-60">
            <h3 className="text-sm font-semibold text-text-primary mb-2">
              Offset-based (not used)
            </h3>
            <ul className="text-sm text-text-muted space-y-1">
              <li>- Can skip or duplicate items</li>
              <li>- Slower for large offsets</li>
              <li>- Issues with concurrent changes</li>
              <li>+ Can jump to any page</li>
            </ul>
          </div>
        </div>
      </div>

      {/* List Response Format */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          List Response Format
        </h2>
        <p className="text-text-muted mb-6">
          All list endpoints return responses in a consistent format with pagination
          metadata.
        </p>

        <CodeBlock
          title="List Response Structure"
          code={`{
  "object": "list",
  "data": [
    { "id": "test_abc123", ... },
    { "id": "test_def456", ... },
    { "id": "test_ghi789", ... }
  ],
  "has_more": true,
  "url": "/v1/tests"
}`}
        />

        <div className="mt-6 space-y-3">
          {[
            {
              field: 'object',
              description: 'Always "list" for paginated endpoints',
            },
            {
              field: 'data',
              description: 'Array of objects for the current page',
            },
            {
              field: 'has_more',
              description: 'Boolean indicating if more results exist',
            },
            {
              field: 'url',
              description: 'The API endpoint URL for this resource',
            },
          ].map((item) => (
            <div
              key={item.field}
              className="flex items-start gap-3 p-3 rounded-lg bg-charcoal-800/50"
            >
              <code className="text-sm font-mono text-brand-blue shrink-0">
                {item.field}
              </code>
              <span className="text-sm text-text-muted">{item.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Parameters */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Pagination Parameters
        </h2>
        <p className="text-text-muted mb-6">
          Use these query parameters to control pagination.
        </p>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-charcoal-800 border border-charcoal-700">
            <div className="flex items-center justify-between mb-2">
              <code className="text-sm font-mono text-text-primary font-semibold">
                limit
              </code>
              <span className="text-xs text-text-dimmed">Optional</span>
            </div>
            <p className="text-sm text-text-muted mb-2">
              Maximum number of objects to return per page. Default is 20, maximum is
              100.
            </p>
            <code className="text-xs font-mono text-brand-blue bg-charcoal-900 px-2 py-1 rounded">
              ?limit=50
            </code>
          </div>

          <div className="p-4 rounded-lg bg-charcoal-800 border border-charcoal-700">
            <div className="flex items-center justify-between mb-2">
              <code className="text-sm font-mono text-text-primary font-semibold">
                starting_after
              </code>
              <span className="text-xs text-text-dimmed">Optional</span>
            </div>
            <p className="text-sm text-text-muted mb-2">
              A cursor for pagination. Pass the ID of the last object from the
              previous page to fetch the next page.
            </p>
            <code className="text-xs font-mono text-brand-blue bg-charcoal-900 px-2 py-1 rounded">
              ?starting_after=test_abc123
            </code>
          </div>

          <div className="p-4 rounded-lg bg-charcoal-800 border border-charcoal-700">
            <div className="flex items-center justify-between mb-2">
              <code className="text-sm font-mono text-text-primary font-semibold">
                ending_before
              </code>
              <span className="text-xs text-text-dimmed">Optional</span>
            </div>
            <p className="text-sm text-text-muted mb-2">
              A cursor for pagination. Pass the ID of the first object from the
              current page to fetch the previous page.
            </p>
            <code className="text-xs font-mono text-brand-blue bg-charcoal-900 px-2 py-1 rounded">
              ?ending_before=test_xyz789
            </code>
          </div>
        </div>
      </div>

      {/* Navigating Pages */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Navigating Pages
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              Fetching the first page
            </h3>
            <CodeBlock
              title="Request"
              code={`curl https://api.deliverability.dev/v1/tests?limit=20 \\
  -H "Authorization: Bearer sk_live_xxxxx"`}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              Fetching the next page
            </h3>
            <p className="text-sm text-text-muted mb-3">
              If <code>has_more</code> is <code>true</code>, use the ID of the last
              item to get the next page.
            </p>
            <CodeBlock
              title="Request"
              code={`curl "https://api.deliverability.dev/v1/tests?limit=20&starting_after=test_ghi789" \\
  -H "Authorization: Bearer sk_live_xxxxx"`}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              Fetching the previous page
            </h3>
            <p className="text-sm text-text-muted mb-3">
              Use the ID of the first item from the current page with{' '}
              <code>ending_before</code>.
            </p>
            <CodeBlock
              title="Request"
              code={`curl "https://api.deliverability.dev/v1/tests?limit=20&ending_before=test_abc123" \\
  -H "Authorization: Bearer sk_live_xxxxx"`}
            />
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Iterating Through All Results
        </h2>
        <p className="text-text-muted mb-6">
          Here&apos;s how to iterate through all pages of results programmatically.
        </p>

        <CodeBlock
          title="Node.js - Auto-pagination"
          code={`import { DeliverabilityClient } from '@deliverability/sdk';

const client = new DeliverabilityClient('sk_live_xxxxx');

// Option 1: Async iterator (recommended)
for await (const test of client.tests.list({ limit: 50 })) {
  console.log(test.id, test.status);
}

// Option 2: Manual pagination
let hasMore = true;
let startingAfter: string | undefined;

while (hasMore) {
  const response = await client.tests.list({
    limit: 50,
    starting_after: startingAfter,
  });

  for (const test of response.data) {
    console.log(test.id, test.status);
  }

  hasMore = response.has_more;
  if (response.data.length > 0) {
    startingAfter = response.data[response.data.length - 1].id;
  }
}`}
        />
      </div>

      {/* Next steps */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/docs/api/tests"
          className="group p-5 rounded-lg bg-charcoal-800 border border-charcoal-700 hover:border-brand-blue/50 transition-colors"
        >
          <h3 className="text-base font-semibold text-text-primary mb-1 flex items-center gap-2">
            List Tests
            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </h3>
          <p className="text-sm text-text-muted">
            See pagination in action with the list tests endpoint.
          </p>
        </Link>
        <Link
          href="/docs/rate-limits"
          className="group p-5 rounded-lg bg-charcoal-800 border border-charcoal-700 hover:border-brand-blue/50 transition-colors"
        >
          <h3 className="text-base font-semibold text-text-primary mb-1 flex items-center gap-2">
            Rate Limits
            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </h3>
          <p className="text-sm text-text-muted">
            Learn about API rate limits when paginating.
          </p>
        </Link>
      </div>
    </div>
  );
}
