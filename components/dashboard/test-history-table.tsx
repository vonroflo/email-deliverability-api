'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Check, X, AlertTriangle, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge } from './api-key-card';

export interface InboxPlacement {
  provider: 'gmail' | 'outlook' | 'yahoo' | 'icloud' | 'proton';
  status: 'inbox' | 'spam' | 'blocked' | 'pending';
}

export interface DnsAuth {
  spf: 'pass' | 'fail' | 'none';
  dkim: 'pass' | 'fail' | 'none';
  dmarc: 'pass' | 'fail' | 'none';
}

export interface TestResult {
  id: string;
  subject: string;
  status: 'completed' | 'processing' | 'failed' | 'pending';
  spamScore: number;
  inboxPlacements: InboxPlacement[];
  date: string;
  dnsAuth?: DnsAuth;
  rawResponse?: object;
}

interface TestHistoryTableProps {
  tests: TestResult[];
}

// Provider icons
function ProviderIcon({ provider, status }: InboxPlacement) {
  const icons: Record<string, string> = {
    gmail: 'G',
    outlook: 'O',
    yahoo: 'Y',
    icloud: 'i',
    proton: 'P',
  };

  const statusColors: Record<string, string> = {
    inbox: 'bg-success text-white',
    spam: 'bg-error text-white',
    blocked: 'bg-charcoal-600 text-text-muted',
    pending: 'bg-warning text-charcoal-900',
  };

  return (
    <div
      className={cn(
        'flex h-6 w-6 items-center justify-center rounded text-xs font-bold',
        statusColors[status]
      )}
      title={`${provider}: ${status}`}
    >
      {icons[provider]}
    </div>
  );
}

// Spam score indicator
function SpamScoreBar({ score }: { score: number }) {
  const percentage = (score / 10) * 100;
  const color =
    score <= 3 ? 'bg-success' : score <= 6 ? 'bg-warning' : 'bg-error';

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-charcoal-700 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full', color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-text-muted">{score.toFixed(1)}/10</span>
    </div>
  );
}

// DNS Auth badge
function DnsAuthBadge({
  label,
  status,
}: {
  label: string;
  status: 'pass' | 'fail' | 'none';
}) {
  const styles = {
    pass: 'bg-success/10 text-success border-success/20',
    fail: 'bg-error/10 text-error border-error/20',
    none: 'bg-charcoal-700 text-text-muted border-charcoal-600',
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-text-secondary">{label}</span>
      <span
        className={cn(
          'px-2 py-0.5 rounded text-xs font-medium border capitalize',
          styles[status]
        )}
      >
        {status}
      </span>
    </div>
  );
}

// Expandable row
function TestRow({ test }: { test: TestResult }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyResponse = async () => {
    if (test.rawResponse) {
      await navigator.clipboard.writeText(JSON.stringify(test.rawResponse, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <tr
        className="border-b border-charcoal-800 hover:bg-charcoal-800/50 cursor-pointer transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-4 py-3">
          <button className="text-text-muted hover:text-text-primary">
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm font-mono text-text-muted">{test.id}</span>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm text-text-primary">{test.subject}</span>
        </td>
        <td className="px-4 py-3">
          <StatusBadge status={test.status} />
        </td>
        <td className="px-4 py-3">
          <SpamScoreBar score={test.spamScore} />
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            {test.inboxPlacements.map((placement, i) => (
              <ProviderIcon key={i} {...placement} />
            ))}
          </div>
        </td>
        <td className="px-4 py-3">
          <span className="text-sm text-text-muted">
            {new Date(test.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </td>
      </tr>

      {/* Expanded content */}
      {expanded && (
        <tr className="bg-charcoal-800/30">
          <td colSpan={7} className="px-4 py-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* DNS Authentication */}
              <div>
                <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">
                  DNS Authentication
                </h4>
                <div className="rounded-lg bg-charcoal-800 border border-charcoal-700 p-4 divide-y divide-charcoal-700">
                  <DnsAuthBadge label="SPF Record" status={test.dnsAuth?.spf || 'none'} />
                  <DnsAuthBadge label="DKIM Signature" status={test.dnsAuth?.dkim || 'none'} />
                  <DnsAuthBadge label="DMARC Policy" status={test.dnsAuth?.dmarc || 'none'} />
                </div>
              </div>

              {/* JSON Response */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider">
                    JSON Response Preview
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyResponse();
                    }}
                    className="text-xs text-brand-blue hover:underline flex items-center gap-1"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy Response
                      </>
                    )}
                  </button>
                </div>
                <div className="rounded-lg bg-charcoal-900 border border-charcoal-700 p-4 overflow-x-auto max-h-48">
                  <pre className="text-xs font-mono text-text-secondary">
                    {JSON.stringify(test.rawResponse || {}, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function TestHistoryTable({ tests }: TestHistoryTableProps) {
  return (
    <div className="rounded-lg border border-charcoal-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-charcoal-800">
            <tr className="border-b border-charcoal-700">
              <th className="w-10 px-4 py-3"></th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Test ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Subject
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Spam Score
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Inbox Placement
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-charcoal-800/50">
            {tests.map((test) => (
              <TestRow key={test.id} test={test} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
