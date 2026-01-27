import Link from 'next/link';

export const metadata = {
  title: 'Blog - Email Deliverability API',
  description: 'Latest news, tutorials, and best practices for email deliverability.',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-charcoal-900">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold text-text-primary mb-4">Blog</h1>
        <p className="text-xl text-text-muted mb-12">
          Coming soon. We're working on tutorials and best practices for email deliverability.
        </p>

        <div className="p-8 rounded-xl bg-charcoal-800 border border-charcoal-700 text-center">
          <p className="text-text-secondary mb-6">
            Want to be notified when we publish new content?
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-brand-blue text-white font-medium hover:bg-brand-blue-hover transition-colors"
          >
            Get Started with the API
          </Link>
        </div>
      </div>
    </div>
  );
}
