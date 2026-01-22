'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Inbox, AlertTriangle, Clock, ChevronRight } from 'lucide-react';

interface Test {
  id: string;
  subject: string;
  status: 'completed' | 'processing' | 'failed';
  inbox_rate?: number;
  created_at: string;
}

interface TestHistoryMiniProps {
  tests?: Test[];
  limit?: number;
}

// Mock data for demonstration - replace with actual API call
const mockTests: Test[] = [
  {
    id: 'test_abc123',
    subject: 'Welcome Email Test',
    status: 'completed',
    inbox_rate: 75,
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 'test_def456',
    subject: 'Password Reset Template',
    status: 'completed',
    inbox_rate: 100,
    created_at: '2024-01-15T09:15:00Z',
  },
  {
    id: 'test_ghi789',
    subject: 'Newsletter Campaign',
    status: 'processing',
    created_at: '2024-01-15T08:00:00Z',
  },
];

export function TestHistoryMini({ tests = mockTests, limit = 5 }: TestHistoryMiniProps) {
  const [mounted, setMounted] = useState(false);
  const displayTests = tests.slice(0, limit);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (displayTests.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        <p className="text-sm">No tests yet. Run your first test above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {displayTests.map((test) => (
        <Link
          key={test.id}
          href={`/dashboard/tests/${test.id}`}
          className="flex items-center justify-between p-3 rounded-lg bg-charcoal-800/50 hover:bg-charcoal-800 border border-charcoal-700 transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Status indicator */}
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg shrink-0',
                test.status === 'completed' && test.inbox_rate && test.inbox_rate >= 75
                  ? 'bg-success/10'
                  : test.status === 'completed'
                  ? 'bg-warning/10'
                  : test.status === 'processing'
                  ? 'bg-brand-blue/10'
                  : 'bg-error/10'
              )}
            >
              {test.status === 'processing' ? (
                <Clock className="h-4 w-4 text-brand-blue animate-pulse" />
              ) : test.inbox_rate && test.inbox_rate >= 75 ? (
                <Inbox className="h-4 w-4 text-success" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-warning" />
              )}
            </div>

            {/* Test info */}
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{test.subject}</p>
              <p className="text-xs text-text-dimmed">
                {mounted ? new Date(test.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }) : '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Status badge */}
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

            <ChevronRight className="h-4 w-4 text-text-dimmed group-hover:text-text-muted transition-colors" />
          </div>
        </Link>
      ))}
    </div>
  );
}
