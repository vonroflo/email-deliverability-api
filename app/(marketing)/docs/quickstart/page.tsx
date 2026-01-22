'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Copy,
  Check,
  ArrowRight,
  Key,
  FlaskConical,
  FileText,
  Terminal,
  CheckCircle2,
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
  language = 'bash',
  title,
}: {
  code: string;
  language?: string;
  title?: string;
}) {
  return (
    <div className="rounded-lg bg-charcoal-800 border border-charcoal-700 overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-charcoal-700 bg-charcoal-900/50">
          <span className="text-xs font-medium text-text-muted">{title}</span>
          <CopyButton text={code} />
        </div>
      )}
      {!title && (
        <div className="flex justify-end px-4 py-2 border-b border-charcoal-700 bg-charcoal-900/50">
          <CopyButton text={code} />
        </div>
      )}
      <pre className="p-4 text-sm font-mono text-text-secondary overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative pl-12 pb-8 last:pb-0">
      {/* Step number */}
      <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue text-white text-sm font-bold">
        {step}
      </div>
      {/* Connecting line */}
      <div className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-charcoal-700 last:hidden" />

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
        <p className="text-text-muted mb-4">{description}</p>
        {children}
      </div>
    </div>
  );
}

export default function QuickstartPage() {
  const [activeTab, setActiveTab] = useState<'node' | 'python' | 'curl'>('node');

  const nodeCode = `import { DeliverabilityClient } from '@deliverability/sdk';

const client = new DeliverabilityClient('sk_live_xxxxx');

// Create a test
const test = await client.tests.create({
  from: 'noreply@yourapp.com',
  subject: 'Welcome to Our App',
  html: '<h1>Welcome!</h1><p>Thanks for signing up.</p>',
});

console.log('Test created:', test.id);

// Poll for results (or use webhooks)
const result = await client.tests.get(test.id);

console.log('Inbox placement:', result.inbox_placement);
// { gmail: 'inbox', outlook: 'inbox', yahoo: 'spam' }`;

  const pythonCode = `from deliverability import DeliverabilityClient

client = DeliverabilityClient('sk_live_xxxxx')

# Create a test
test = client.tests.create(
    from_address='noreply@yourapp.com',
    subject='Welcome to Our App',
    html='<h1>Welcome!</h1><p>Thanks for signing up.</p>',
)

print(f'Test created: {test.id}')

# Poll for results (or use webhooks)
result = client.tests.get(test.id)

print(f'Inbox placement: {result.inbox_placement}')
# {'gmail': 'inbox', 'outlook': 'inbox', 'yahoo': 'spam'}`;

  const curlCode = `# Create a test
curl -X POST https://api.deliverability.dev/v1/tests \\
  -H "Authorization: Bearer sk_live_xxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "noreply@yourapp.com",
    "subject": "Welcome to Our App",
    "html": "<h1>Welcome!</h1><p>Thanks for signing up.</p>"
  }'

# Response:
# {
#   "id": "test_abc123xyz",
#   "status": "processing",
#   "created_at": "2026-01-21T15:00:00Z"
# }

# Get results
curl https://api.deliverability.dev/v1/tests/test_abc123xyz \\
  -H "Authorization: Bearer sk_live_xxxxx"`;

  const codes = { node: nodeCode, python: pythonCode, curl: curlCode };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-text-muted mb-4">
          <Link href="/docs" className="hover:text-text-secondary">
            Documentation
          </Link>
          <span>/</span>
          <span className="text-text-secondary">Quickstart</span>
        </div>
        <h1 className="text-4xl font-bold text-text-primary mb-4">Quickstart</h1>
        <p className="text-lg text-text-muted">
          Get started with DeliverabilityAPI in under 5 minutes. Test your first email
          and see inbox placement results.
        </p>
      </div>

      {/* Overview */}
      <div className="mb-12 p-6 rounded-lg bg-charcoal-800 border border-charcoal-700">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          What you&apos;ll accomplish
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: Key, text: 'Create an API key' },
            { icon: FlaskConical, text: 'Run your first test' },
            { icon: FileText, text: 'View inbox placement results' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/10">
                <item.icon className="h-5 w-5 text-brand-blue" />
              </div>
              <span className="text-sm text-text-secondary">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="mb-12">
        <StepCard
          step={1}
          title="Get your API key"
          description="Sign up for a free account and create an API key from your dashboard."
        >
          <div className="space-y-4">
            <p className="text-sm text-text-muted">
              Your API key authenticates requests to the DeliverabilityAPI. Keep it
              secure and never expose it in client-side code.
            </p>
            <div className="flex gap-3">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-blue text-white text-sm font-medium hover:bg-brand-blue-hover transition-colors"
              >
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/api-keys"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-charcoal-700 text-text-secondary text-sm font-medium hover:text-text-primary transition-colors"
              >
                Go to API Keys
              </Link>
            </div>
            <div className="p-4 rounded-lg bg-charcoal-900 border border-charcoal-700">
              <p className="text-xs text-text-muted mb-2">Your API key will look like this:</p>
              <code className="text-sm font-mono text-brand-blue">
                sk_live_1a2b3c4d5e6f7g8h9i0j...
              </code>
            </div>
          </div>
        </StepCard>

        <StepCard
          step={2}
          title="Install the SDK (optional)"
          description="Install our official SDK for your language, or use the REST API directly."
        >
          <div className="space-y-3">
            <CodeBlock
              code="npm install @deliverability/sdk"
              title="Node.js"
            />
            <CodeBlock code="pip install deliverability" title="Python" />
          </div>
        </StepCard>

        <StepCard
          step={3}
          title="Run your first test"
          description="Create a deliverability test by providing your email content. Results are typically ready within 2-3 minutes."
        >
          {/* Language tabs */}
          <div className="rounded-lg bg-charcoal-800 border border-charcoal-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-charcoal-700 bg-charcoal-900/50">
              <div className="flex items-center gap-1">
                {(['node', 'python', 'curl'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium rounded transition-colors',
                      activeTab === tab
                        ? 'bg-charcoal-700 text-text-primary'
                        : 'text-text-muted hover:text-text-secondary'
                    )}
                  >
                    {tab === 'node' ? 'Node.js' : tab === 'python' ? 'Python' : 'cURL'}
                  </button>
                ))}
              </div>
              <CopyButton text={codes[activeTab]} />
            </div>
            <pre className="p-4 text-sm font-mono text-text-secondary overflow-x-auto">
              <code>{codes[activeTab]}</code>
            </pre>
          </div>
        </StepCard>

        <StepCard
          step={4}
          title="View your results"
          description="Once the test completes, you'll receive detailed inbox placement data across major email providers."
        >
          <div className="rounded-lg bg-charcoal-800 border border-charcoal-700 overflow-hidden">
            <div className="px-4 py-2 border-b border-charcoal-700 bg-charcoal-900/50">
              <span className="text-xs font-medium text-text-muted">Response</span>
            </div>
            <pre className="p-4 text-sm font-mono text-text-secondary overflow-x-auto">
              <code>{`{
  "id": "test_abc123xyz",
  "status": "completed",
  "inbox_placement": {
    "gmail": "inbox",
    "outlook": "inbox",
    "yahoo": "spam",
    "apple_mail": "inbox"
  },
  "spam_score": 2.8,
  "authentication": {
    "spf": "pass",
    "dkim": "pass",
    "dmarc": "pass"
  },
  "recommendations": [
    "Consider warming up your IP for Yahoo",
    "Reduce image-to-text ratio"
  ]
}`}</code>
            </pre>
          </div>
        </StepCard>
      </div>

      {/* Success box */}
      <div className="mb-12 p-6 rounded-lg bg-success/5 border border-success/20">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="h-6 w-6 text-success shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              You&apos;re all set!
            </h3>
            <p className="text-text-muted mb-4">
              You&apos;ve successfully tested email deliverability with the API. Here are
              some next steps to explore:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { href: '/docs/api/tests/create', label: 'API Reference: Create Test' },
                { href: '/docs/authentication', label: 'Authentication Guide' },
                { href: '/docs/api/domains/validate', label: 'Validate Domain DNS' },
                { href: '/docs/sdks', label: 'SDK Documentation' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 text-sm text-brand-blue hover:underline"
                >
                  <ArrowRight className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CI/CD Integration */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          CI/CD Integration
        </h2>
        <p className="text-text-muted mb-6">
          Add deliverability testing to your CI/CD pipeline with our GitHub Action.
          Tests fail automatically when emails land in spam.
        </p>
        <CodeBlock
          title=".github/workflows/email-test.yml"
          language="yaml"
          code={`name: Test Email Deliverability
on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: deliverability/action@v1
        with:
          api-key: \${{ secrets.DELIVERABILITY_API_KEY }}
          template: ./emails/welcome.html
          fail-on-spam: true`}
        />
      </div>

      {/* Next steps */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/docs/authentication"
          className="group p-5 rounded-lg bg-charcoal-800 border border-charcoal-700 hover:border-brand-blue/50 transition-colors"
        >
          <h3 className="text-base font-semibold text-text-primary mb-1 flex items-center gap-2">
            Authentication
            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </h3>
          <p className="text-sm text-text-muted">
            Learn about API keys and authentication methods.
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
