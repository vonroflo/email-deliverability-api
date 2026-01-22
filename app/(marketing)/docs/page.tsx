import Link from 'next/link';
import { ArrowRight, Key, FlaskConical, FileText, Zap } from 'lucide-react';

const quickLinks = [
  {
    icon: Key,
    title: 'Authentication',
    description: 'Learn how to authenticate your API requests using API keys.',
    href: '/docs/authentication',
  },
  {
    icon: FlaskConical,
    title: 'Create a Test',
    description: 'Start testing email deliverability with a simple API call.',
    href: '/docs/api/tests/create',
  },
  {
    icon: FileText,
    title: 'View Results',
    description: 'Access detailed deliverability reports and analytics.',
    href: '/docs/api/results',
  },
  {
    icon: Zap,
    title: 'Quickstart Guide',
    description: 'Get up and running in under 5 minutes.',
    href: '/docs/quickstart',
  },
];

export default function DocsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-text-primary mb-4">
        API Documentation
      </h1>
      <p className="text-lg text-text-muted mb-8 max-w-2xl">
        Welcome to the DeliverabilityAPI documentation. Learn how to integrate
        our email deliverability testing API into your applications.
      </p>

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group p-5 rounded-lg bg-charcoal-800 border border-charcoal-700 hover:border-brand-blue/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue group-hover:bg-brand-blue/20 transition-colors">
                <link.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-text-primary mb-1 flex items-center gap-2">
                  {link.title}
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-sm text-text-muted">{link.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Getting started */}
      <div className="rounded-lg bg-charcoal-800 border border-charcoal-700 p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Getting Started
        </h2>
        <div className="space-y-4 text-text-secondary">
          <p>
            The DeliverabilityAPI allows you to test email deliverability across
            60+ inbox providers with a single API call. Our API is organized
            around REST principles and returns JSON responses.
          </p>
          <p>
            To get started, you&apos;ll need an API key. You can create one in your{' '}
            <Link href="/dashboard/api-keys" className="text-brand-blue hover:underline">
              dashboard
            </Link>
            .
          </p>
        </div>

        {/* Base URL */}
        <div className="mt-6 p-4 rounded-lg bg-charcoal-900 border border-charcoal-700">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-2">
            Base URL
          </p>
          <code className="text-sm font-mono text-text-primary">
            https://api.deliverability.dev/v1
          </code>
        </div>
      </div>
    </div>
  );
}
