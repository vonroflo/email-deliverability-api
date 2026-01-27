'use client';

import { useState, useEffect } from 'react';
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
  Loader2,
} from 'lucide-react';
import useSWR from 'swr';
import { User } from '@/lib/db/schema';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface RecentTest {
  id: string;
  subject: string;
  status: 'completed' | 'processing' | 'failed';
  inbox_placement?: {
    gmail?: string;
    outlook?: string;
    yahoo?: string;
  };
  created_at: string;
}

// Calculate inbox rate from placement data
function calculateInboxRate(placement?: RecentTest['inbox_placement']): number | undefined {
  if (!placement) return undefined;
  const providers = ['gmail', 'outlook', 'yahoo'] as const;
  let inboxCount = 0;
  let totalCount = 0;

  for (const provider of providers) {
    const status = placement[provider];
    if (status && status !== 'pending') {
      totalCount++;
      if (status === 'inbox') {
        inboxCount++;
      }
    }
  }

  return totalCount > 0 ? Math.round((inboxCount / totalCount) * 100) : undefined;
}

export default function DashboardOverview() {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const [recentTests, setRecentTests] = useState<RecentTest[]>([]);
  const [testsLoading, setTestsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Fetch recent tests from API
  useEffect(() => {
    setMounted(true);

    async function fetchRecentTests() {
      try {
        const response = await fetch('/api/dashboard/tests?limit=3');
        if (response.ok) {
          const data = await response.json();
          setRecentTests(data.tests || []);
        }
      } catch (err) {
        console.error('Failed to fetch recent tests:', err);
      } finally {
        setTestsLoading(false);
      }
    }

    fetchRecentTests();
  }, []);

  // Calculate stats from recent tests
  const completedTests = recentTests.filter((t) => t.status === 'completed');
  const avgInboxRate =
    completedTests.length > 0
      ? Math.round(
          completedTests.reduce((sum, t) => sum + (calculateInboxRate(t.inbox_placement) || 0), 0) /
            completedTests.length
        )
      : 0;

  const testsThisMonth = recentTests.length;
  const testsLimit = 500;
  const usagePercent = (testsThisMonth / testsLimit) * 100;

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
          Both methods count toward your monthly tests
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
            {testsThisMonth}
            <span className="text-sm font-normal text-text-muted"> / {testsLimit}</span>
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
          </div>
          <p className="text-2xl font-bold text-text-primary">
            {completedTests.length > 0 ? `${avgInboxRate}%` : '—'}
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

        {testsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
          </div>
        ) : recentTests.length === 0 ? (
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
            {recentTests.map((test) => {
              const inboxRate = calculateInboxRate(test.inbox_placement);
              return (
                <Link
                  key={test.id}
                  href={`/dashboard/tests/${test.id}`}
                  className="flex items-center justify-between p-4 hover:bg-charcoal-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg',
                        test.status === 'completed' && inboxRate !== undefined && inboxRate >= 75
                          ? 'bg-success/10'
                          : test.status === 'completed'
                          ? 'bg-warning/10'
                          : 'bg-brand-blue/10'
                      )}
                    >
                      {test.status === 'processing' ? (
                        <Clock className="h-4 w-4 text-brand-blue animate-pulse" />
                      ) : inboxRate !== undefined && inboxRate >= 75 ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-warning" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{test.subject}</p>
                      <p className="text-xs text-text-dimmed">
                        {mounted
                          ? new Date(test.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {test.status === 'completed' && inboxRate !== undefined && (
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-xs font-medium',
                          inboxRate >= 75 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                        )}
                      >
                        {inboxRate}% inbox
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
              );
            })}
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
