import Link from 'next/link';
import { Mail, Lock, ShieldCheck } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-charcoal-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-charcoal-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue">
                <Mail className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-text-primary">
                DeliverabilityAPI
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Security badges */}
      <div className="flex items-center justify-center gap-6 py-6">
        <div className="flex items-center gap-2 text-text-dimmed">
          <Lock className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Secure</span>
        </div>
        <div className="flex items-center gap-2 text-text-dimmed">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Encrypted</span>
        </div>
      </div>

      {/* Footer links */}
      <footer className="border-t border-charcoal-800 py-6">
        <div className="flex items-center justify-center gap-8">
          <Link
            href="/docs"
            className="text-xs font-medium text-text-dimmed hover:text-text-muted uppercase tracking-wider transition-colors"
          >
            Documentation
          </Link>
          <Link
            href="/status"
            className="text-xs font-medium text-text-dimmed hover:text-text-muted uppercase tracking-wider transition-colors"
          >
            Status
          </Link>
          <Link
            href="/support"
            className="text-xs font-medium text-text-dimmed hover:text-text-muted uppercase tracking-wider transition-colors"
          >
            Support
          </Link>
        </div>
      </footer>
    </div>
  );
}
