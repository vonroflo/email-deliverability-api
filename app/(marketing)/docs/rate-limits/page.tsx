'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, ArrowRight, AlertCircle, Gauge, Clock, Zap } from 'lucide-react';

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

interface RateLimit {
  plan: string;
  requestsPerMinute: number;
  requestsPerDay: number;
  concurrentTests: number;
  highlight?: boolean;
}

const rateLimits: RateLimit[] = [
  { plan: 'Free', requestsPerMinute: 10, requestsPerDay: 100, concurrentTests: 5 },
  { plan: 'Starter', requestsPerMinute: 60, requestsPerDay: 1000, concurrentTests: 20 },
  { plan: 'Pro', requestsPerMinute: 120, requestsPerDay: 5000, concurrentTests: 50, highlight: true },
  { plan: 'Enterprise', requestsPerMinute: 500, requestsPerDay: 50000, concurrentTests: 200 },
];

export default function RateLimitsPage() {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-text-muted mb-4">
          <Link href="/docs" className="hover:text-text-secondary">
            Documentation
          </Link>
          <span>/</span>
          <span className="text-text-secondary">Rate Limits</span>
        </div>
        <h1 className="text-4xl font-bold text-text-primary mb-4">Rate Limits</h1>
        <p className="text-lg text-text-muted">
          The DeliverabilityAPI applies rate limiting to ensure fair usage and
          maintain service reliability for all users.
        </p>
      </div>

      {/* Overview */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Rate Limit Overview
        </h2>
        <p className="text-text-muted mb-6">
          Rate limits vary by plan and are applied per API key. When you exceed a
          rate limit, you&apos;ll receive a <code className="text-warning">429 Too Many Requests</code>{' '}
          response.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-charcoal-800 border border-charcoal-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/10">
                <Zap className="h-5 w-5 text-brand-blue" />
              </div>
              <span className="text-sm font-medium text-text-muted">Per Minute</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">10-500</p>
            <p className="text-xs text-text-dimmed">requests/min</p>
          </div>

          <div className="p-4 rounded-lg bg-charcoal-800 border border-charcoal-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Clock className="h-5 w-5 text-success" />
              </div>
              <span className="text-sm font-medium text-text-muted">Per Day</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">100-50K</p>
            <p className="text-xs text-text-dimmed">requests/day</p>
          </div>

          <div className="p-4 rounded-lg bg-charcoal-800 border border-charcoal-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Gauge className="h-5 w-5 text-warning" />
              </div>
              <span className="text-sm font-medium text-text-muted">Concurrent</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">5-200</p>
            <p className="text-xs text-text-dimmed">active tests</p>
          </div>
        </div>
      </div>

      {/* Rate Limits by Plan */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Limits by Plan
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                  Plan
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                  Requests/Min
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                  Requests/Day
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">
                  Concurrent Tests
                </th>
              </tr>
            </thead>
            <tbody>
              {rateLimits.map((limit) => (
                <tr
                  key={limit.plan}
                  className={`border-b border-charcoal-800 ${
                    limit.highlight ? 'bg-brand-blue/5' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-text-primary">
                      {limit.plan}
                    </span>
                    {limit.highlight && (
                      <span className="ml-2 text-xs text-brand-blue">Popular</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-text-secondary font-mono">
                    {limit.requestsPerMinute.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-text-secondary font-mono">
                    {limit.requestsPerDay.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-text-secondary font-mono">
                    {limit.concurrentTests}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rate Limit Headers */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Rate Limit Headers
        </h2>
        <p className="text-text-muted mb-6">
          Every API response includes headers to help you track your rate limit usage.
        </p>

        <CodeBlock
          title="Response Headers"
          code={`X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1706115600
Retry-After: 30  # Only present when rate limited`}
        />

        <div className="mt-6 space-y-3">
          {[
            {
              header: 'X-RateLimit-Limit',
              description: 'The maximum number of requests allowed per minute',
            },
            {
              header: 'X-RateLimit-Remaining',
              description: 'The number of requests remaining in the current window',
            },
            {
              header: 'X-RateLimit-Reset',
              description: 'Unix timestamp when the rate limit window resets',
            },
            {
              header: 'Retry-After',
              description: 'Seconds to wait before retrying (only on 429 responses)',
            },
          ].map((item) => (
            <div
              key={item.header}
              className="flex items-start gap-3 p-3 rounded-lg bg-charcoal-800/50"
            >
              <code className="text-sm font-mono text-brand-blue shrink-0">
                {item.header}
              </code>
              <span className="text-sm text-text-muted">{item.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Handling Rate Limits */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Handling Rate Limits
        </h2>
        <p className="text-text-muted mb-6">
          When you exceed a rate limit, you&apos;ll receive a 429 response. We recommend
          implementing exponential backoff with jitter.
        </p>

        <CodeBlock
          title="429 Response"
          code={`{
  "error": {
    "type": "rate_limit_error",
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded. Please retry after 30 seconds.",
    "retry_after": 30
  }
}`}
        />

        <div className="mt-6">
          <CodeBlock
            title="Handling Rate Limits in Node.js"
            code={`async function makeRequest(fn) {
  const response = await fn();

  // Check rate limit headers
  const remaining = response.headers.get('X-RateLimit-Remaining');
  const reset = response.headers.get('X-RateLimit-Reset');

  if (remaining && parseInt(remaining) < 5) {
    console.warn('Approaching rate limit, slow down requests');
  }

  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After') || 30;
    console.log(\`Rate limited. Retrying in \${retryAfter} seconds\`);
    await new Promise(r => setTimeout(r, retryAfter * 1000));
    return makeRequest(fn);
  }

  return response;
}`}
          />
        </div>
      </div>

      {/* Best Practices */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Best Practices
        </h2>

        <div className="grid gap-4">
          <div className="p-4 rounded-lg bg-charcoal-800 border border-charcoal-700">
            <h3 className="text-sm font-semibold text-text-primary mb-2">
              1. Monitor your usage
            </h3>
            <p className="text-sm text-text-muted">
              Check the <code>X-RateLimit-Remaining</code> header to avoid hitting
              limits. Slow down when approaching the limit.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-charcoal-800 border border-charcoal-700">
            <h3 className="text-sm font-semibold text-text-primary mb-2">
              2. Implement exponential backoff
            </h3>
            <p className="text-sm text-text-muted">
              When rate limited, wait for the <code>Retry-After</code> period, then
              retry with increasing delays on subsequent failures.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-charcoal-800 border border-charcoal-700">
            <h3 className="text-sm font-semibold text-text-primary mb-2">
              3. Batch your requests
            </h3>
            <p className="text-sm text-text-muted">
              Instead of making many small requests, batch operations where possible
              to stay within rate limits.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-charcoal-800 border border-charcoal-700">
            <h3 className="text-sm font-semibold text-text-primary mb-2">
              4. Use webhooks for results
            </h3>
            <p className="text-sm text-text-muted">
              Instead of polling for test results, use webhooks to receive
              notifications when tests complete.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-charcoal-800 border border-charcoal-700">
            <h3 className="text-sm font-semibold text-text-primary mb-2">
              5. Cache when possible
            </h3>
            <p className="text-sm text-text-muted">
              Domain validation results and reputation checks can be cached locally
              to reduce API calls.
            </p>
          </div>
        </div>
      </div>

      {/* Upgrade CTA */}
      <div className="mb-12 p-6 rounded-lg bg-brand-blue/5 border border-brand-blue/20">
        <div className="flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-brand-blue shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Need higher limits?
            </h3>
            <p className="text-text-muted mb-4">
              If you&apos;re hitting rate limits regularly, consider upgrading your plan
              or contact us for custom Enterprise limits.
            </p>
            <div className="flex gap-3">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-blue text-white text-sm font-medium hover:bg-brand-blue-hover transition-colors"
              >
                View Plans
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-charcoal-700 text-text-secondary text-sm font-medium hover:text-text-primary transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Next steps */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/docs/errors"
          className="group p-5 rounded-lg bg-charcoal-800 border border-charcoal-700 hover:border-brand-blue/50 transition-colors"
        >
          <h3 className="text-base font-semibold text-text-primary mb-1 flex items-center gap-2">
            Error Handling
            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </h3>
          <p className="text-sm text-text-muted">
            Learn about error codes and how to handle them.
          </p>
        </Link>
        <Link
          href="/docs/api/tests/create"
          className="group p-5 rounded-lg bg-charcoal-800 border border-charcoal-700 hover:border-brand-blue/50 transition-colors"
        >
          <h3 className="text-base font-semibold text-text-primary mb-1 flex items-center gap-2">
            Create Test API
            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </h3>
          <p className="text-sm text-text-muted">
            Full API reference for the test creation endpoint.
          </p>
        </Link>
      </div>
    </div>
  );
}
