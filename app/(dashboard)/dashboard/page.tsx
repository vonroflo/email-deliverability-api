'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Gamepad2,
  Key,
  FlaskConical,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import useSWR from 'swr';
import { User } from '@/lib/db/schema';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Mock data - replace with actual API calls
const mockStats = {
  testsThisMonth: 47,
  testsLimit: 500,
  inboxRate: 87,
  recentTests: [
    { id: 'test_1', subject: 'Welcome Email', status: 'completed', inbox_rate: 100, created_at: '2024-01-15T10:30:00Z' },
    { id: 'test_2', subject: 'Password Reset', status: 'completed', inbox_rate: 75, created_at: '2024-01-15T09:15:00Z' },
    { id: 'test_3', subject: 'Newsletter', status: 'processing', created_at: '2024-01-15T08:00:00Z' },
  ],
};

export default function DashboardOverview() {
  const { data: user } = useSWR<User>('/api/user', fetcher);

  const usagePercent = (mockStats.testsThisMonth / mockStats.testsLimit) * 100;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-text-muted mt-1">
          Test email deliverability visually or via API
        </p>
      </div>

      {/* Two-Path Card - Main CTA */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-brand-blue/10 via-charcoal-800 to-charcoal-800 border-2 border-brand-blue/20">
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          How would you like to test?
        </h2>
        <p className="text-text-muted mb-6">
          Both methods count toward your {mockStats.testsThisMonth}/{mockStats.testsLimit} monthly tests
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Visual Playground Path */}
          <Link
            href="/dashboard/playground"
            className="group p-5 rounded-lg bg-charcoal-900 border-2 border-brand-blue/30 hover:border-brand-blue transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/10">
                <Gamepad2 className="h-5 w-5 text-brand-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Visual Playground</h3>
                <p className="text-xs text-text-muted">Point-and-click interface</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Configure emails visually, see results instantly. Perfect for quick tests and non-developers.
            </p>
            <div className="flex items-center text-sm text-brand-blue font-medium group-hover:gap-2 transition-all">
              Open Playground
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* API Path */}
          <Link
            href="/dashboard/api-keys"
            className="group p-5 rounded-lg bg-charcoal-900 border-2 border-charcoal-700 hover:border-success/50 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Key className="h-5 w-5 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">API Integration</h3>
                <p className="text-xs text-text-muted">For developers & automation</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Integrate into your CI/CD pipeline, automate testing, and monitor deliverability programmatically.
            </p>
            <div className="flex items-center text-sm text-success font-medium group-hover:gap-2 transition-all">
              Get API Key
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid sm:grid-cols-3 gap-4">
        {/* Usage */}
        <div className="p-5 rounded-lg bg-charcoal-800 border border-charcoal-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-muted">Monthly Usage</span>
            <span className="text-xs text-text-dimmed">Starter Plan</span>
          </div>
          <p className="text-2xl font-bold text-text-primary mb-2">
            {mockStats.testsThisMonth}
            <span className="text-sm font-normal text-text-muted"> / {mockStats.testsLimit}</span>
          </p>
          <div className="h-2 bg-charcoal-700 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                usagePercent >= 80 ? 'bg-warning' : 'bg-brand-blue'
              )}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>

        {/* Inbox Rate */}
        <div className="p-5 rounded-lg bg-charcoal-800 border border-charcoal-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-muted">Avg Inbox Rate</span>
            <span className="text-xs text-success">+5% this week</span>
          </div>
          <p className="text-2xl font-bold text-text-primary">
            {mockStats.inboxRate}%
          </p>
          <p className="text-xs text-text-dimmed mt-1">
            Across all providers
          </p>
        </div>

        {/* Quick Actions */}
        <div className="p-5 rounded-lg bg-charcoal-800 border border-charcoal-700">
          <span className="text-sm text-text-muted">Quick Actions</span>
          <div className="mt-3 space-y-2">
            <Link
              href="/dashboard/playground"
              className="flex items-center gap-2 text-sm text-brand-blue hover:underline"
            >
              <FlaskConical className="h-4 w-4" />
              Run a new test
            </Link>
            <Link
              href="/docs/quickstart"
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"
            >
              <TrendingUp className="h-4 w-4" />
              View API docs
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Tests */}
      <div className="rounded-lg bg-charcoal-800 border border-charcoal-700 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-charcoal-700">
          <h2 className="text-lg font-semibold text-text-primary">Recent Tests</h2>
          <Link
            href="/dashboard/tests"
            className="text-sm text-brand-blue hover:underline"
          >
            View all →
          </Link>
        </div>

        {mockStats.recentTests.length === 0 ? (
          <div className="p-8 text-center text-text-muted">
            <p className="mb-4">No tests yet. Run your first test to get started!</p>
            <Link
              href="/dashboard/playground"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-blue text-white text-sm font-medium hover:bg-brand-blue-hover transition-colors"
            >
              <Gamepad2 className="h-4 w-4" />
              Open Playground
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-charcoal-700">
            {mockStats.recentTests.map((test) => (
              <Link
                key={test.id}
                href={`/dashboard/tests/${test.id}`}
                className="flex items-center justify-between p-4 hover:bg-charcoal-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg',
                      test.status === 'completed' && test.inbox_rate && test.inbox_rate >= 75
                        ? 'bg-success/10'
                        : test.status === 'completed'
                        ? 'bg-warning/10'
                        : 'bg-brand-blue/10'
                    )}
                  >
                    {test.status === 'processing' ? (
                      <Clock className="h-4 w-4 text-brand-blue animate-pulse" />
                    ) : test.inbox_rate && test.inbox_rate >= 75 ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{test.subject}</p>
                    <p className="text-xs text-text-dimmed">
                      {new Date(test.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {test.status === 'completed' && test.inbox_rate !== undefined && (
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-xs font-medium',
                        test.inbox_rate >= 75 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                      )}
                    >
                      {test.inbox_rate}% inbox
                    </span>
                  )}
                  {test.status === 'processing' && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-brand-blue/10 text-brand-blue">
                      Processing...
                    </span>
                  )}
                  <ArrowRight className="h-4 w-4 text-text-dimmed" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Getting Started Tips */}
      <div className="p-5 rounded-lg bg-charcoal-800/50 border border-charcoal-700">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Getting Started</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold shrink-0">
              1
            </span>
            <p className="text-text-muted">
              <Link href="/dashboard/playground" className="text-brand-blue hover:underline">
                Try the Playground
              </Link>{' '}
              to test visually
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold shrink-0">
              2
            </span>
            <p className="text-text-muted">
              <Link href="/dashboard/api-keys" className="text-brand-blue hover:underline">
                Get an API key
              </Link>{' '}
              for automation
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold shrink-0">
              3
            </span>
            <p className="text-text-muted">
              <Link href="/docs/quickstart" className="text-brand-blue hover:underline">
                Read the docs
              </Link>{' '}
              for CI/CD setup
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
