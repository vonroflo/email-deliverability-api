import Link from 'next/link';
import { Mail, FileText, MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'Support - Email Deliverability API',
  description: 'Get help with the Email Deliverability API.',
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-charcoal-900">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold text-text-primary mb-4">Support</h1>
        <p className="text-xl text-text-muted mb-12">
          Need help? We're here to assist you.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/docs"
            className="p-6 rounded-xl bg-charcoal-800 border border-charcoal-700 hover:border-brand-blue/50 transition-colors group"
          >
            <FileText className="h-8 w-8 text-brand-blue mb-4" />
            <h2 className="text-xl font-semibold text-text-primary mb-2">Documentation</h2>
            <p className="text-text-muted">
              Browse our comprehensive API documentation and guides.
            </p>
          </Link>

          <a
            href="mailto:support@deliverability.dev"
            className="p-6 rounded-xl bg-charcoal-800 border border-charcoal-700 hover:border-brand-blue/50 transition-colors group"
          >
            <Mail className="h-8 w-8 text-brand-blue mb-4" />
            <h2 className="text-xl font-semibold text-text-primary mb-2">Email Support</h2>
            <p className="text-text-muted">
              Contact us at support@deliverability.dev
            </p>
          </a>

          <Link
            href="/docs/quickstart"
            className="p-6 rounded-xl bg-charcoal-800 border border-charcoal-700 hover:border-brand-blue/50 transition-colors group"
          >
            <MessageCircle className="h-8 w-8 text-brand-blue mb-4" />
            <h2 className="text-xl font-semibold text-text-primary mb-2">Getting Started</h2>
            <p className="text-text-muted">
              New to the API? Check out our quickstart guide.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
