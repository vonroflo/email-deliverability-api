import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CodeBlockWithTabs } from './code-block';

const apiExamples = [
  {
    label: 'cURL',
    language: 'curl',
    code: `curl -X POST https://api.deliverability.dev/v1/tests \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "hello@yourdomain.com",
    "subject": "Test Email",
    "html": "<h1>Hello World</h1>"
  }'`,
  },
  {
    label: 'Node.js',
    language: 'javascript',
    code: `const response = await fetch('https://api.deliverability.dev/v1/tests', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: 'hello@yourdomain.com',
    subject: 'Test Email',
    html: '<h1>Hello World</h1>'
  })
});

const result = await response.json();`,
  },
  {
    label: 'Python',
    language: 'python',
    code: `import requests

response = requests.post(
    'https://api.deliverability.dev/v1/tests',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'from': 'hello@yourdomain.com',
        'subject': 'Test Email',
        'html': '<h1>Hello World</h1>'
    }
)

result = response.json()`,
  },
];

export function Hero() {
  return (
    <section className="relative min-h-screen bg-charcoal-900 pt-16">
      {/* Background gradient effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-blue/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - Text content */}
          <div className="space-y-8">
            {/* Version badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal-800 border border-charcoal-700">
              <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-text-muted">
                v2.0 Now Available
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary">
              Test Email Deliverability in{' '}
              <span className="text-gradient-blue">One API Call</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-text-muted max-w-xl leading-relaxed">
              Ensure your emails hit the inbox, not the spam folder. A simple,
              robust API for developers who care about deliverability. Integrated
              in minutes, trusted by 10,000+ engineers.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-brand-blue hover:bg-brand-blue-hover text-white px-8"
              >
                <Link href="/sign-up">
                  Get API Key
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-charcoal-600 text-text-primary hover:bg-charcoal-800 hover:text-text-primary px-8"
              >
                <Link href="/docs">View Docs</Link>
              </Button>
            </div>

            {/* Social proof */}
            <div className="pt-4 flex items-center gap-6 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <span className="text-text-primary font-semibold">50M+</span>
                <span>API calls/month</span>
              </div>
              <div className="h-4 w-px bg-charcoal-700" />
              <div className="flex items-center gap-2">
                <span className="text-text-primary font-semibold">99.9%</span>
                <span>Uptime SLA</span>
              </div>
            </div>
          </div>

          {/* Right column - Code example */}
          <div className="relative">
            {/* Glow effect behind code block */}
            <div className="absolute -inset-4 bg-brand-blue/5 rounded-2xl blur-xl" />

            <div className="relative">
              <CodeBlockWithTabs tabs={apiExamples} />

              {/* Response preview */}
              <div className="mt-4 rounded-lg bg-charcoal-800 border border-charcoal-700 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-2 w-2 rounded-full bg-success" />
                  <span className="text-xs font-medium text-text-muted">Response</span>
                </div>
                <pre className="text-sm font-mono text-text-secondary overflow-x-auto">
{`{
  "id": "test_abc123",
  "status": "processing",
  "created_at": "2024-01-15T10:30:00Z"
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
