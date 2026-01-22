'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  Github,
  Package,
  Terminal,
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

interface SDK {
  name: string;
  language: string;
  packageName: string;
  installCommand: string;
  github: string;
  docs: string;
  icon: string;
  status: 'stable' | 'beta' | 'coming_soon';
}

const sdks: SDK[] = [
  {
    name: 'Node.js',
    language: 'TypeScript / JavaScript',
    packageName: '@deliverability/sdk',
    installCommand: 'npm install @deliverability/sdk',
    github: 'https://github.com/deliverability/sdk-node',
    docs: '/docs/sdks/node',
    icon: '🟢',
    status: 'stable',
  },
  {
    name: 'Python',
    language: 'Python 3.8+',
    packageName: 'deliverability',
    installCommand: 'pip install deliverability',
    github: 'https://github.com/deliverability/sdk-python',
    docs: '/docs/sdks/python',
    icon: '🐍',
    status: 'stable',
  },
  {
    name: 'Go',
    language: 'Go 1.18+',
    packageName: 'deliverability-go',
    installCommand: 'go get github.com/deliverability/sdk-go',
    github: 'https://github.com/deliverability/sdk-go',
    docs: '/docs/sdks/go',
    icon: '🔵',
    status: 'beta',
  },
  {
    name: 'Ruby',
    language: 'Ruby 3.0+',
    packageName: 'deliverability',
    installCommand: 'gem install deliverability',
    github: 'https://github.com/deliverability/sdk-ruby',
    docs: '/docs/sdks/ruby',
    icon: '💎',
    status: 'coming_soon',
  },
  {
    name: 'PHP',
    language: 'PHP 8.1+',
    packageName: 'deliverability/sdk',
    installCommand: 'composer require deliverability/sdk',
    github: 'https://github.com/deliverability/sdk-php',
    docs: '/docs/sdks/php',
    icon: '🐘',
    status: 'coming_soon',
  },
];

function StatusBadge({ status }: { status: SDK['status'] }) {
  const styles = {
    stable: 'bg-success/10 text-success',
    beta: 'bg-warning/10 text-warning',
    coming_soon: 'bg-charcoal-700 text-text-dimmed',
  };

  const labels = {
    stable: 'Stable',
    beta: 'Beta',
    coming_soon: 'Coming Soon',
  };

  return (
    <span className={cn('px-2 py-0.5 rounded text-xs font-medium', styles[status])}>
      {labels[status]}
    </span>
  );
}

export default function SDKsPage() {
  const [activeTab, setActiveTab] = useState<'node' | 'python' | 'curl'>('node');

  const nodeExample = `import { DeliverabilityClient } from '@deliverability/sdk';

// Initialize the client
const client = new DeliverabilityClient({
  apiKey: process.env.DELIVERABILITY_API_KEY,
});

// Create a test
const test = await client.tests.create({
  from: 'noreply@yourapp.com',
  subject: 'Welcome to Our App',
  html: '<h1>Welcome!</h1><p>Thanks for signing up.</p>',
});

// Get the test result
const result = await client.tests.get(test.id);
console.log(result.inbox_placement);`;

  const pythonExample = `from deliverability import DeliverabilityClient
import os

# Initialize the client
client = DeliverabilityClient(
    api_key=os.environ['DELIVERABILITY_API_KEY']
)

# Create a test
test = client.tests.create(
    from_address='noreply@yourapp.com',
    subject='Welcome to Our App',
    html='<h1>Welcome!</h1><p>Thanks for signing up.</p>',
)

# Get the test result
result = client.tests.get(test.id)
print(result.inbox_placement)`;

  const curlExample = `# Create a test
curl -X POST https://api.deliverability.dev/v1/tests \\
  -H "Authorization: Bearer $DELIVERABILITY_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "noreply@yourapp.com",
    "subject": "Welcome to Our App",
    "html": "<h1>Welcome!</h1><p>Thanks for signing up.</p>"
  }'

# Get the test result
curl https://api.deliverability.dev/v1/tests/test_abc123 \\
  -H "Authorization: Bearer $DELIVERABILITY_API_KEY"`;

  const examples = { node: nodeExample, python: pythonExample, curl: curlExample };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-text-muted mb-4">
          <Link href="/docs" className="hover:text-text-secondary">
            Documentation
          </Link>
          <span>/</span>
          <span className="text-text-secondary">SDKs & Libraries</span>
        </div>
        <h1 className="text-4xl font-bold text-text-primary mb-4">SDKs & Libraries</h1>
        <p className="text-lg text-text-muted">
          Official client libraries for the DeliverabilityAPI. Use our SDKs to
          integrate email deliverability testing into your applications.
        </p>
      </div>

      {/* Quick Start */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">Quick Start</h2>
        <p className="text-text-muted mb-6">
          Get started quickly with our official SDKs. All libraries are fully typed
          and support async/await patterns.
        </p>

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
            <CopyButton text={examples[activeTab]} />
          </div>
          <pre className="p-4 text-sm font-mono text-text-secondary overflow-x-auto">
            <code>{examples[activeTab]}</code>
          </pre>
        </div>
      </div>

      {/* Available SDKs */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Available Libraries
        </h2>

        <div className="space-y-4">
          {sdks.map((sdk) => (
            <div
              key={sdk.name}
              className={cn(
                'p-5 rounded-lg bg-charcoal-800 border border-charcoal-700',
                sdk.status === 'coming_soon' && 'opacity-60'
              )}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{sdk.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-text-primary">
                        {sdk.name}
                      </h3>
                      <StatusBadge status={sdk.status} />
                    </div>
                    <p className="text-sm text-text-muted">{sdk.language}</p>
                  </div>
                </div>
                {sdk.status !== 'coming_soon' && (
                  <div className="flex items-center gap-2">
                    <a
                      href={sdk.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-charcoal-700 text-text-muted hover:text-text-primary transition-colors"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                    <a
                      href={sdk.docs}
                      className="p-2 rounded-lg bg-charcoal-700 text-text-muted hover:text-text-primary transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>

              {sdk.status !== 'coming_soon' && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-charcoal-900">
                  <Terminal className="h-4 w-4 text-text-dimmed shrink-0" />
                  <code className="text-sm font-mono text-text-secondary flex-1">
                    {sdk.installCommand}
                  </code>
                  <CopyButton text={sdk.installCommand} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* REST API */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          REST API
        </h2>
        <p className="text-text-muted mb-6">
          Prefer to use the API directly? Our REST API works with any HTTP client
          and returns JSON responses.
        </p>

        <div className="p-5 rounded-lg bg-charcoal-800 border border-charcoal-700">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-blue/10">
              <Package className="h-6 w-6 text-brand-blue" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                Base URL
              </h3>
              <code className="text-sm font-mono text-brand-blue">
                https://api.deliverability.dev/v1
              </code>
              <p className="text-sm text-text-muted mt-3">
                All requests require an API key in the Authorization header. See the{' '}
                <Link
                  href="/docs/authentication"
                  className="text-brand-blue hover:underline"
                >
                  Authentication guide
                </Link>{' '}
                for details.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SDK Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          SDK Features
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              title: 'Fully Typed',
              description:
                'TypeScript types and Python type hints for autocomplete and type checking.',
            },
            {
              title: 'Async Support',
              description:
                'Native async/await support in all SDKs for non-blocking operations.',
            },
            {
              title: 'Automatic Retries',
              description:
                'Built-in retry logic with exponential backoff for transient errors.',
            },
            {
              title: 'Request Logging',
              description:
                'Debug mode for logging requests and responses during development.',
            },
            {
              title: 'Error Handling',
              description:
                'Typed error classes for easy error handling and recovery.',
            },
            {
              title: 'Webhook Verification',
              description:
                'Helper methods to verify webhook signatures for security.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-4 rounded-lg bg-charcoal-800 border border-charcoal-700"
            >
              <h3 className="text-sm font-semibold text-text-primary mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Community SDKs */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Community Libraries
        </h2>
        <p className="text-text-muted mb-6">
          These libraries are maintained by the community. They are not officially
          supported but may be helpful for your use case.
        </p>

        <div className="p-4 rounded-lg bg-charcoal-800 border border-charcoal-700">
          <p className="text-sm text-text-muted">
            No community libraries available yet. Want to contribute?{' '}
            <a
              href="https://github.com/deliverability"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue hover:underline"
            >
              Get in touch
            </a>
            .
          </p>
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
          href="/docs/api/tests/create"
          className="group p-5 rounded-lg bg-charcoal-800 border border-charcoal-700 hover:border-brand-blue/50 transition-colors"
        >
          <h3 className="text-base font-semibold text-text-primary mb-1 flex items-center gap-2">
            API Reference
            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </h3>
          <p className="text-sm text-text-muted">
            Explore the full API reference documentation.
          </p>
        </Link>
      </div>
    </div>
  );
}
