'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Key,
  FlaskConical,
  FileText,
  CreditCard,
  Settings,
  Menu,
  X,
  Mail,
  ChevronDown,
  Gamepad2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import useSWR from 'swr';
import { User } from '@/lib/db/schema';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/dashboard/playground', icon: Gamepad2, label: 'Playground' },
  { href: '/dashboard/api-keys', icon: Key, label: 'API Keys' },
  { href: '/dashboard/tests', icon: FlaskConical, label: 'Test History' },
  { href: '/dashboard/usage', icon: CreditCard, label: 'Usage & Billing' },
];

const secondaryNavItems = [
  { href: '/docs', icon: FileText, label: 'Docs', external: true },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: user } = useSWR<User>('/api/user', fetcher);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

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
          'fixed lg:sticky top-0 left-0 z-50 lg:z-0 h-screen w-64 bg-charcoal-900 border-r border-charcoal-800 flex flex-col transition-transform duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-charcoal-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue">
              <Mail className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-text-primary uppercase tracking-wider">
              MailDeliver
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-text-muted hover:text-text-primary"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-charcoal-800 text-text-primary'
                    : 'text-text-muted hover:text-text-primary hover:bg-charcoal-800/50'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-charcoal-800">
            <div className="space-y-1">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  target={item.external ? '_blank' : undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-charcoal-800 text-text-primary'
                      : 'text-text-muted hover:text-text-primary hover:bg-charcoal-800/50'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-charcoal-800">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-charcoal-800/50 cursor-pointer transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-charcoal-700 text-text-primary text-xs">
                {user?.email?.slice(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {user?.name || user?.email || 'User'}
              </p>
              <p className="text-xs text-text-dimmed truncate">
                {user?.email}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-text-muted" />
          </div>
        </div>
      </aside>
    </>
  );
}
