'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Copy,
  Check,
  Key,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

function CodeBlock({
  code,
  title,
}: {
  code: string;
  title?: string;
}) {
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

function ApiKeyDemo() {
  const [visible, setVisible] = useState(false);
  const apiKey = 'deliverability_live_EXAMPLE_KEY_PLACEHOLDER_DO_NOT_USE_IN_PRODUCTION';

  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-charcoal-900 border border-charcoal-700">
      <Key className="h-5 w-5 text-brand-blue shrink-0" />
      <code className="flex-1 text-sm font-mono text-text-primary">
        {visible ? apiKey : 'sk_live_••••••••••••••••••••••••••••••••'}
      </code>
      <button
        onClick={() => setVisible(!visible)}
        className="p-1.5 rounded hover:bg-charcoal-700 text-text-muted hover:text-text-primary transition-colors"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
      <CopyButton text={apiKey} />
    </div>
  );
}

export default function AuthenticationPage() {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-text-muted mb-4">
          <Link href="/docs" className="hover:text-text-secondary">
            Documentation
          </Link>
          <span>/</span>
          <span className="text-text-secondary">Authentication</span>
        </div>
        <h1 className="text-4xl font-bold text-text-primary mb-4">Authentication</h1>
        <p className="text-lg text-text-muted">
          The DeliverabilityAPI uses API keys to authenticate requests. You can view
          and manage your API keys in the{' '}
          <Link href="/dashboard/api-keys" className="text-brand-blue hover:underline">
            Dashboard
          </Link>
          .
        </p>
      </div>

      {/* API Keys Overview */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">API Keys</h2>
        <p className="text-text-muted mb-6">
          Your API keys carry many privileges, so be sure to keep them secure. Don&apos;t
          share your secret API keys in publicly accessible areas such as GitHub,
          client-side code, and so forth.
        </p>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-charcoal-800 border border-charcoal-700">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/10 shrink-0">
                <Key className="h-5 w-5 text-brand-blue" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text-primary mb-1">
                  Live API Keys
                </h3>
                <p className="text-sm text-text-muted mb-2">
                  Prefixed with <code className="text-brand-blue">sk_live_</code>. Use
                  these in production. Requests will send actual test emails.
                </p>
                <code className="text-xs font-mono text-text-dimmed">
                  sk_live_1a2b3c4d5e6f7g8h...
                </code>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-charcoal-800 border border-charcoal-700">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 shrink-0">
                <Shield className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text-primary mb-1">
                  Test API Keys
                </h3>
                <p className="text-sm text-text-muted mb-2">
                  Prefixed with <code className="text-warning">sk_test_</code>. Use
                  these for development. No actual emails are sent—mock responses are
                  returned.
                </p>
                <code className="text-xs font-mono text-text-dimmed">
                  sk_test_1a2b3c4d5e6f7g8h...
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Using API Keys */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Using Your API Key
        </h2>
        <p className="text-text-muted mb-6">
          Authentication to the API is performed via HTTP Bearer authentication.
          Provide your API key as the bearer token value in the{' '}
          <code className="text-brand-blue">Authorization</code> header.
        </p>

        <CodeBlock
          title="Authorization Header"
          code="Authorization: Bearer sk_live_xxxxx"
        />

        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">Request Examples</h3>

          <CodeBlock
            title="cURL"
            code={`curl https://api.deliverability.dev/v1/tests \\
  -H "Authorization: Bearer sk_live_xxxxx" \\
  -H "Content-Type: application/json"`}
          />

          <CodeBlock
            title="Node.js"
            code={`const response = await fetch('https://api.deliverability.dev/v1/tests', {
  headers: {
    'Authorization': 'Bearer sk_live_xxxxx',
    'Content-Type': 'application/json'
  }
});`}
          />

          <CodeBlock
            title="Python"
            code={`import requests

response = requests.get(
    'https://api.deliverability.dev/v1/tests',
    headers={
        'Authorization': 'Bearer sk_live_xxxxx',
        'Content-Type': 'application/json'
    }
)`}
          />
        </div>
      </div>

      {/* Handling API Keys Securely */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Security Best Practices
        </h2>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-error/5 border border-error/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-error shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-text-primary mb-1">
                  Never expose API keys in client-side code
                </h3>
                <p className="text-sm text-text-muted">
                  API keys should only be used in server-side code. Never include them
                  in JavaScript bundles, mobile apps, or any code that runs on the
                  client.
                </p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: 'Use environment variables',
                description:
                  'Store API keys in environment variables, not in your codebase.',
                code: 'DELIVERABILITY_API_KEY=sk_live_xxxxx',
              },
              {
                title: 'Rotate keys regularly',
                description:
                  'Generate new API keys periodically and revoke old ones.',
                action: 'Manage in Dashboard',
              },
              {
                title: 'Use test keys for development',
                description:
                  'Test keys don\'t send actual emails and are safe to use locally.',
                code: 'sk_test_xxxxx',
              },
              {
                title: 'Monitor key usage',
                description:
                  'Review API usage logs regularly for unexpected activity.',
                action: 'View Usage',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-charcoal-800 border border-charcoal-700"
              >
                <h4 className="text-sm font-semibold text-text-primary mb-1">
                  {item.title}
                </h4>
                <p className="text-sm text-text-muted mb-2">{item.description}</p>
                {item.code && (
                  <code className="text-xs font-mono text-brand-blue bg-charcoal-900 px-2 py-1 rounded">
                    {item.code}
                  </code>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Environment Variables Example */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Environment Variables
        </h2>
        <p className="text-text-muted mb-6">
          Here&apos;s how to securely use your API key with environment variables in
          different environments.
        </p>

        <div className="space-y-4">
          <CodeBlock
            title=".env.local (Next.js)"
            code="DELIVERABILITY_API_KEY=sk_live_xxxxx"
          />

          <CodeBlock
            title="Usage in code"
            code={`// Server-side only (API routes, Server Components)
const apiKey = process.env.DELIVERABILITY_API_KEY;

const client = new DeliverabilityClient(apiKey);`}
          />
        </div>
      </div>

      {/* Error Responses */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Authentication Errors
        </h2>
        <p className="text-text-muted mb-6">
          If your API key is invalid or missing, you&apos;ll receive a{' '}
          <code className="text-error">401 Unauthorized</code> response.
        </p>

        <CodeBlock
          title="401 Unauthorized Response"
          code={`{
  "error": {
    "type": "authentication_error",
    "message": "Invalid API key provided.",
    "code": "invalid_api_key"
  }
}`}
        />

        <div className="mt-4 p-4 rounded-lg bg-charcoal-800 border border-charcoal-700">
          <h4 className="text-sm font-semibold text-text-primary mb-2">
            Common authentication issues
          </h4>
          <ul className="space-y-2 text-sm text-text-muted">
            <li className="flex items-start gap-2">
              <span className="text-error">•</span>
              Missing <code>Authorization</code> header
            </li>
            <li className="flex items-start gap-2">
              <span className="text-error">•</span>
              Using <code>Bearer</code> without a space before the key
            </li>
            <li className="flex items-start gap-2">
              <span className="text-error">•</span>
              Using a revoked or deleted API key
            </li>
            <li className="flex items-start gap-2">
              <span className="text-error">•</span>
              Using a test key for live endpoints that require a live key
            </li>
          </ul>
        </div>
      </div>

      {/* Next steps */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/docs/quickstart"
          className="group p-5 rounded-lg bg-charcoal-800 border border-charcoal-700 hover:border-brand-blue/50 transition-colors"
        >
          <h3 className="text-base font-semibold text-text-primary mb-1 flex items-center gap-2">
            Quickstart Guide
            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </h3>
          <p className="text-sm text-text-muted">
            Run your first deliverability test in minutes.
          </p>
        </Link>
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
      </div>
    </div>
  );
}
