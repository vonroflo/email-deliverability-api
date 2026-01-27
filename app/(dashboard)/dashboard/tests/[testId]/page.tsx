'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Mail,
  Shield,
  Inbox,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TestDetail {
  id: string;
  from: string;
  subject: string;
  html?: string;
  text?: string;
  status: 'processing' | 'completed' | 'failed';
  test_marker?: string;
  inbox_placement?: {
    gmail?: 'inbox' | 'spam' | 'not_delivered' | 'pending';
    outlook?: 'inbox' | 'spam' | 'not_delivered' | 'pending';
    yahoo?: 'inbox' | 'spam' | 'not_delivered' | 'pending';
  };
  spam_score?: string | null;
  authentication?: {
    spf?: 'pass' | 'fail' | 'none';
    dkim?: 'pass' | 'fail' | 'none';
    dmarc?: 'pass' | 'fail' | 'none';
  };
  recommendations?: string[];
  created_at: string;
  completed_at?: string | null;
}

function StatusBadge({ status }: { status: TestDetail['status'] }) {
  const config = {
    completed: { icon: CheckCircle2, label: 'Completed', className: 'bg-success/10 text-success' },
    processing: { icon: Clock, label: 'Processing', className: 'bg-brand-blue/10 text-brand-blue' },
    failed: { icon: XCircle, label: 'Failed', className: 'bg-error/10 text-error' },
  };

  const { icon: Icon, label, className } = config[status];

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium', className)}>
      <Icon className={cn('h-4 w-4', status === 'processing' && 'animate-pulse')} />
      {label}
    </span>
  );
}

function AuthBadge({ status, label }: { status?: 'pass' | 'fail' | 'none'; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-text-muted w-14">{label}</span>
      <span
        className={cn(
          'px-2 py-0.5 rounded text-xs font-medium',
          status === 'pass' ? 'bg-success/10 text-success' :
          status === 'fail' ? 'bg-error/10 text-error' :
          'bg-charcoal-700 text-text-muted'
        )}
      >
        {status || 'N/A'}
      </span>
    </div>
  );
}

function PlacementCard({ provider, status }: { provider: string; status?: string }) {
  const getStatusColor = (s?: string) => {
    if (s === 'inbox') return 'border-success bg-success/5';
    if (s === 'spam') return 'border-error bg-error/5';
    if (s === 'not_delivered') return 'border-error bg-error/5';
    return 'border-charcoal-700 bg-charcoal-800';
  };

  const getStatusIcon = (s?: string) => {
    if (s === 'inbox') return <Inbox className="h-5 w-5 text-success" />;
    if (s === 'spam') return <AlertTriangle className="h-5 w-5 text-error" />;
    if (s === 'not_delivered') return <XCircle className="h-5 w-5 text-error" />;
    return <Clock className="h-5 w-5 text-text-muted animate-pulse" />;
  };

  return (
    <div className={cn('p-4 rounded-lg border-2', getStatusColor(status))}>
      <div className="flex items-center gap-3">
        {getStatusIcon(status)}
        <div>
          <p className="font-medium text-text-primary capitalize">{provider}</p>
          <p className="text-sm text-text-muted capitalize">{status || 'pending'}</p>
        </div>
      </div>
    </div>
  );
}

export default function TestDetailPage({ params }: { params: Promise<{ testId: string }> }) {
  const resolvedParams = use(params);
  const [test, setTest] = useState<TestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTest = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);

    try {
      const response = await fetch(`/api/dashboard/tests/${resolvedParams.testId}`);

      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in to view this test');
          return;
        }
        if (response.status === 404) {
          setError('Test not found');
          return;
        }
        throw new Error('Failed to fetch test');
      }

      const data = await response.json();
      setTest(data);
    } catch (err) {
      console.error('Failed to fetch test:', err);
      setError('Failed to load test details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTest();
  }, [resolvedParams.testId]);

  // Poll for updates if test is processing
  useEffect(() => {
    if (!test || test.status !== 'processing') return;

    const interval = setInterval(() => {
      fetchTest();
    }, 5000);

    return () => clearInterval(interval);
  }, [test?.status, resolvedParams.testId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <AlertTriangle className="h-12 w-12 text-error mb-4" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">{error}</h2>
          <p className="text-text-muted mb-6">
            The test you're looking for may have been deleted or you don't have access.
          </p>
          <Link href="/dashboard/tests">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Test History
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!test) return null;

  const inboxRate = test.inbox_placement
    ? (Object.values(test.inbox_placement).filter(v => v === 'inbox').length /
       Object.values(test.inbox_placement).filter(v => v && v !== 'pending').length) * 100
    : null;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/tests"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-charcoal-800 border border-charcoal-700 hover:bg-charcoal-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-text-secondary" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{test.subject}</h1>
            <p className="text-sm text-text-muted mt-1">
              From: {test.from} • Created {new Date(test.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchTest(true)}
            disabled={refreshing}
          >
            <RefreshCw className={cn('h-4 w-4 mr-2', refreshing && 'animate-spin')} />
            Refresh
          </Button>
          <StatusBadge status={test.status} />
        </div>
      </div>

      {/* Processing State */}
      {test.status === 'processing' && (
        <div className="p-4 rounded-lg bg-brand-blue/10 border border-brand-blue/20">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-brand-blue" />
            <div>
              <p className="font-medium text-text-primary">Test in progress</p>
              <p className="text-sm text-text-muted">Results will appear automatically when ready.</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Inbox Placement */}
        <div className="lg:col-span-2 p-6 rounded-lg bg-charcoal-800 border border-charcoal-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <Inbox className="h-5 w-5 text-brand-blue" />
              Inbox Placement
            </h2>
            {inboxRate !== null && !isNaN(inboxRate) && (
              <span className={cn(
                'px-3 py-1 rounded-full text-sm font-medium',
                inboxRate >= 75 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
              )}>
                {Math.round(inboxRate)}% Inbox Rate
              </span>
            )}
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <PlacementCard provider="Gmail" status={test.inbox_placement?.gmail} />
            <PlacementCard provider="Outlook" status={test.inbox_placement?.outlook} />
            <PlacementCard provider="Yahoo" status={test.inbox_placement?.yahoo} />
          </div>
        </div>

        {/* Authentication */}
        <div className="p-6 rounded-lg bg-charcoal-800 border border-charcoal-700">
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-brand-blue" />
            Authentication
          </h2>
          <div className="space-y-3">
            <AuthBadge label="SPF" status={test.authentication?.spf} />
            <AuthBadge label="DKIM" status={test.authentication?.dkim} />
            <AuthBadge label="DMARC" status={test.authentication?.dmarc} />
          </div>
          {test.spam_score && (
            <div className="mt-4 pt-4 border-t border-charcoal-700">
              <p className="text-sm text-text-muted">Spam Score</p>
              <p className="text-2xl font-bold text-text-primary">{test.spam_score}</p>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      {test.recommendations && test.recommendations.length > 0 && (
        <div className="p-6 rounded-lg bg-charcoal-800 border border-charcoal-700">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Recommendations</h2>
          <ul className="space-y-2">
            {test.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="text-brand-blue mt-1">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Email Content */}
      {(test.html || test.text) && (
        <div className="p-6 rounded-lg bg-charcoal-800 border border-charcoal-700">
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2 mb-4">
            <Mail className="h-5 w-5 text-brand-blue" />
            Email Content
          </h2>
          <div className="space-y-4">
            {test.html && (
              <div>
                <p className="text-sm font-medium text-text-muted mb-2">HTML Content</p>
                <div className="p-4 rounded-lg bg-charcoal-900 border border-charcoal-700 overflow-auto max-h-64">
                  <pre className="text-xs text-text-secondary whitespace-pre-wrap">{test.html}</pre>
                </div>
              </div>
            )}
            {test.text && (
              <div>
                <p className="text-sm font-medium text-text-muted mb-2">Plain Text Content</p>
                <div className="p-4 rounded-lg bg-charcoal-900 border border-charcoal-700 overflow-auto max-h-64">
                  <pre className="text-xs text-text-secondary whitespace-pre-wrap">{test.text}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
