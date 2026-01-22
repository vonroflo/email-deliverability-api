'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Key,
  AlertCircle,
  Layers,
  FlaskConical,
  FileText,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}

interface NavSection {
  title: string;
  icon?: React.ElementType;
  items: NavItem[];
  defaultOpen?: boolean;
}

const navSections: NavSection[] = [
  {
    title: 'Getting Started',
    icon: BookOpen,
    defaultOpen: true,
    items: [
      { href: '/docs', label: 'Introduction' },
      { href: '/docs/quickstart', label: 'Quickstart' },
      { href: '/docs/sdks', label: 'SDKs & Libraries' },
    ],
  },
  {
    title: 'Core Resources',
    items: [
      { href: '/docs/authentication', label: 'Authentication' },
      { href: '/docs/errors', label: 'Errors' },
      { href: '/docs/pagination', label: 'Pagination' },
      { href: '/docs/rate-limits', label: 'Rate Limits' },
    ],
  },
  {
    title: 'Tests',
    icon: FlaskConical,
    defaultOpen: true,
    items: [
      { href: '/docs/api/tests', label: 'List all tests', method: 'GET' },
      { href: '/docs/api/tests/create', label: 'Create a test', method: 'POST' },
      { href: '/docs/api/tests/get', label: 'Get a test', method: 'GET' },
      { href: '/docs/api/tests/delete', label: 'Delete a test', method: 'DELETE' },
    ],
  },
  {
    title: 'Results',
    icon: FileText,
    items: [
      { href: '/docs/api/results', label: 'List results', method: 'GET' },
      { href: '/docs/api/results/get', label: 'Get result', method: 'GET' },
    ],
  },
  {
    title: 'Domains',
    items: [
      { href: '/docs/api/domains/validate', label: 'Validate domain', method: 'POST' },
      { href: '/docs/api/domains/dns', label: 'Check DNS', method: 'GET' },
    ],
  },
];

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: 'bg-success/10 text-success',
    POST: 'bg-brand-blue/10 text-brand-blue',
    PUT: 'bg-warning/10 text-warning',
    DELETE: 'bg-error/10 text-error',
    PATCH: 'bg-purple-500/10 text-purple-400',
  };

  return (
    <span
      className={cn(
        'px-1.5 py-0.5 rounded text-[10px] font-bold',
        colors[method] || colors.GET
      )}
    >
      {method}
    </span>
  );
}

function NavSectionComponent({ section }: { section: NavSection }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(section.defaultOpen ?? false);
  const Icon = section.icon;

  const isActive = section.items.some((item) => pathname === item.href);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          isActive
            ? 'text-text-primary'
            : 'text-text-muted hover:text-text-secondary'
        )}
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4" />}
          {section.title}
        </span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      {isOpen && (
        <div className="ml-4 mt-1 space-y-1 border-l border-charcoal-700 pl-3">
          {section.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors',
                pathname === item.href
                  ? 'bg-brand-blue/10 text-brand-blue'
                  : 'text-text-muted hover:text-text-secondary'
              )}
            >
              {item.method && <MethodBadge method={item.method} />}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function DocsSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-charcoal-800 border border-charcoal-700 text-text-muted hover:text-text-primary"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-50 lg:z-0 h-screen w-72 bg-charcoal-900 border-r border-charcoal-800 flex flex-col transition-transform duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-charcoal-800">
          <Link href="/docs" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-text-primary">
              API Documentation
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-text-muted hover:text-text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Version selector */}
        <div className="px-4 py-3 border-b border-charcoal-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-charcoal-800 text-xs font-mono text-text-primary">
                v1.0.4
              </span>
              <span className="text-xs text-success">Latest Stable</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navSections.map((section) => (
            <NavSectionComponent key={section.title} section={section} />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-charcoal-800">
          <Link
            href="/support"
            className="text-sm text-text-muted hover:text-text-primary"
          >
            Need help? Contact Support
          </Link>
        </div>
      </aside>
    </>
  );
}
