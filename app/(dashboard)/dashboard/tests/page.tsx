'use client';

import { useState } from 'react';
import {
  Plus,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  TestHistoryTable,
  StatsGrid,
  type TestResult,
} from '@/components/dashboard';
import { cn } from '@/lib/utils';

// Mock data - in production, this would come from your API
const mockTests: TestResult[] = [
  {
    id: 'ATS-4822',
    subject: 'Winter Seasonal Promo',
    status: 'completed',
    spamScore: 0.6,
    inboxPlacements: [
      { provider: 'gmail', status: 'inbox' },
      { provider: 'outlook', status: 'inbox' },
      { provider: 'yahoo', status: 'inbox' },
    ],
    date: '2023-10-28T10:30:00Z',
    dnsAuth: { spf: 'pass', dkim: 'pass', dmarc: 'pass' },
    rawResponse: {
      test_id: 'TS-4822',
      metadata: { version: '2.0' },
      results: {
        spam_analysis: { score: 0.6, threshold: 5.0 },
        deliverability: { inbox: 98.5, spam: 1.2, blocked: 0.3 },
      },
      providers: [
        { name: 'Gmail', status: 'inbox', latency_ms: 234 },
        { name: 'Outlook', status: 'inbox', latency_ms: 189 },
        { name: 'Yahoo', status: 'inbox', latency_ms: 312 },
      ],
    },
  },
  {
    id: 'ATS-4820',
    subject: 'Password Reset Template',
    status: 'processing',
    spamScore: 1.2,
    inboxPlacements: [
      { provider: 'gmail', status: 'pending' },
      { provider: 'outlook', status: 'pending' },
      { provider: 'yahoo', status: 'pending' },
    ],
    date: '2023-10-26T14:20:00Z',
    dnsAuth: { spf: 'pass', dkim: 'pass', dmarc: 'pass' },
    rawResponse: { status: 'processing', progress: 45 },
  },
  {
    id: 'ATS-4819',
    subject: 'Monthly Newsletter - Oct',
    status: 'completed',
    spamScore: 7.2,
    inboxPlacements: [
      { provider: 'gmail', status: 'spam' },
      { provider: 'outlook', status: 'inbox' },
      { provider: 'yahoo', status: 'spam' },
    ],
    date: '2023-10-25T09:15:00Z',
    dnsAuth: { spf: 'pass', dkim: 'fail', dmarc: 'fail' },
    rawResponse: {
      test_id: 'TS-4819',
      results: {
        spam_analysis: { score: 7.2, issues: ['Missing DKIM', 'High image ratio'] },
      },
    },
  },
  {
    id: 'ATS-4817',
    subject: 'Welcome Email Sequence #1',
    status: 'completed',
    spamScore: 2.1,
    inboxPlacements: [
      { provider: 'gmail', status: 'inbox' },
      { provider: 'outlook', status: 'inbox' },
      { provider: 'yahoo', status: 'inbox' },
    ],
    date: '2023-10-24T16:45:00Z',
    dnsAuth: { spf: 'pass', dkim: 'pass', dmarc: 'pass' },
    rawResponse: { test_id: 'TS-4817', status: 'completed' },
  },
  {
    id: 'ATS-4815',
    subject: 'Order Confirmation',
    status: 'failed',
    spamScore: 9.1,
    inboxPlacements: [
      { provider: 'gmail', status: 'blocked' },
      { provider: 'outlook', status: 'blocked' },
      { provider: 'yahoo', status: 'blocked' },
    ],
    date: '2023-10-23T11:30:00Z',
    dnsAuth: { spf: 'fail', dkim: 'fail', dmarc: 'fail' },
    rawResponse: { error: 'DNS authentication failed', code: 'AUTH_FAILURE' },
  },
];

const mockStats = {
  totalTests: 1482,
  avgSpamScore: 2.4,
  inboxPlacementRate: 98.2,
  authenticationRate: 100,
};

type TabType = 'realtime' | 'archived';
type StatusFilter = 'all' | 'completed' | 'processing' | 'failed';

export default function TestHistoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>('realtime');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 25;
  const totalTests = 248;

  const filteredTests =
    statusFilter === 'all'
      ? mockTests
      : mockTests.filter((test) => test.status === statusFilter);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-charcoal-800 bg-charcoal-900/50">
        <div className="px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">
                Test History
              </h1>
              <p className="text-sm text-text-muted mt-1">
                Manage and analyze your recent email deliverability performance
                across major providers.
              </p>
            </div>
            <Button className="bg-brand-blue hover:bg-brand-blue-hover text-white shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Run New Test
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-6">
            <button
              onClick={() => setActiveTab('realtime')}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                activeTab === 'realtime'
                  ? 'bg-charcoal-700 text-text-primary'
                  : 'text-text-muted hover:text-text-secondary'
              )}
            >
              Real-time
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                activeTab === 'archived'
                  ? 'bg-charcoal-700 text-text-primary'
                  : 'text-text-muted hover:text-text-secondary'
              )}
            >
              Archived
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 lg:px-8 py-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Status filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="appearance-none px-4 py-2 pr-8 rounded-lg bg-charcoal-800 border border-charcoal-700 text-sm text-text-primary focus:outline-none focus:border-brand-blue cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
            </div>

            {/* Date filter */}
            <div className="relative">
              <select className="appearance-none px-4 py-2 pr-8 rounded-lg bg-charcoal-800 border border-charcoal-700 text-sm text-text-primary focus:outline-none focus:border-brand-blue cursor-pointer">
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
                <option>Last 90 Days</option>
                <option>All Time</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-charcoal-800 transition-colors">
              <Download className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-charcoal-800 transition-colors">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <TestHistoryTable tests={filteredTests} />

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            Showing 1-10 of {totalTests} tests
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-charcoal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                  currentPage === page
                    ? 'bg-brand-blue text-white'
                    : 'text-text-muted hover:text-text-primary hover:bg-charcoal-800'
                )}
              >
                {page}
              </button>
            ))}
            <span className="px-2 text-text-muted">...</span>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className={cn(
                'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                currentPage === totalPages
                  ? 'bg-brand-blue text-white'
                  : 'text-text-muted hover:text-text-primary hover:bg-charcoal-800'
              )}
            >
              {totalPages}
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-charcoal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <StatsGrid stats={mockStats} />
      </div>
    </div>
  );
}
