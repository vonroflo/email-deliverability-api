'use client';

import { useState } from 'react';
import { CreditCard, Download, ExternalLink, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Usage Progress Card
interface UsageProgressProps {
  used: number;
  total: number;
  label: string;
  resetDate?: string;
}

export function UsageProgressCard({ used, total, label, resetDate }: UsageProgressProps) {
  const percentage = (used / total) * 100;
  const isWarning = percentage >= 80;
  const isCritical = percentage >= 95;

  return (
    <div className="rounded-lg bg-charcoal-800 border border-charcoal-700 p-5">
      <h3 className="text-sm font-medium text-text-muted mb-4">Monthly Usage</h3>

      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-lg font-medium text-text-muted">{label}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-text-primary">{used.toLocaleString()}</span>
          <span className="text-lg text-text-muted">/ {total.toLocaleString()}</span>
          <span
            className={cn(
              'ml-2 text-sm font-medium',
              isCritical ? 'text-error' : isWarning ? 'text-warning' : 'text-success'
            )}
          >
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-charcoal-700 rounded-full overflow-hidden mb-3">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            isCritical ? 'bg-error' : isWarning ? 'bg-warning' : 'bg-brand-blue'
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {resetDate && (
        <p className="text-xs text-text-dimmed">
          <span className="inline-block w-2 h-2 rounded-full bg-brand-blue mr-2" />
          Resets in {resetDate}
        </p>
      )}

      <button className="mt-4 text-sm text-brand-blue hover:underline">
        View extended logs
      </button>
    </div>
  );
}

// API Volume Chart Card
interface ApiVolumeProps {
  totalRequests: number;
  data: { date: string; value: number }[];
}

export function ApiVolumeCard({ totalRequests, data }: ApiVolumeProps) {
  // Simple SVG line chart
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((d.value - minValue) / range) * 80 - 10;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="rounded-lg bg-charcoal-800 border border-charcoal-700 p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-text-muted mb-1">API Request Volume</h3>
          <p className="text-xs text-text-dimmed">Traffic activity over the last 30 days</p>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-success" />
          <span className="text-2xl font-bold text-text-primary">
            {totalRequests.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-32 mt-4">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="25" x2="100" y2="25" stroke="#334155" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#334155" strokeWidth="0.5" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="#334155" strokeWidth="0.5" />

          {/* Area fill */}
          <polygon
            points={`0,100 ${points} 100,100`}
            fill="url(#gradient)"
            opacity="0.3"
          />

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="#2563EB"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-xs text-text-dimmed">
        <span>{data[0]?.date}</span>
        <span>{data[Math.floor(data.length / 2)]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}

// Payment Method Card
interface PaymentMethodProps {
  cardBrand: string;
  lastFour: string;
  billingEmail: string;
  onEdit?: () => void;
}

export function PaymentMethodCard({
  cardBrand,
  lastFour,
  billingEmail,
  onEdit,
}: PaymentMethodProps) {
  return (
    <div className="rounded-lg bg-charcoal-800 border border-charcoal-700 p-5">
      <h3 className="text-sm font-medium text-text-muted mb-4">Payment Method</h3>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-14 items-center justify-center rounded bg-charcoal-700">
          <CreditCard className="h-5 w-5 text-text-muted" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">
            {cardBrand} ending in {lastFour}
          </p>
        </div>
      </div>

      <div className="border-t border-charcoal-700 pt-4">
        <p className="text-xs font-medium text-text-dimmed uppercase tracking-wider mb-1">
          Billing Email
        </p>
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">{billingEmail}</p>
          <button
            onClick={onEdit}
            className="text-sm text-brand-blue hover:underline"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

// Enterprise Upsell Card
export function EnterpriseUpsellCard() {
  return (
    <div className="rounded-lg bg-charcoal-800 border border-charcoal-700 p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-2">
        Need more volume?
      </h3>
      <p className="text-sm text-text-muted mb-4">
        Our Enterprise plan offers unlimited API requests and 24/7 dedicated support.
      </p>
      <Button
        variant="outline"
        className="w-full border-charcoal-600 text-text-primary hover:bg-charcoal-700"
      >
        Talk to Sales
      </Button>
    </div>
  );
}

// Billing History Table
export interface Invoice {
  id: string;
  date: string;
  invoiceId: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl?: string;
}

interface BillingHistoryProps {
  invoices: Invoice[];
}

export function BillingHistoryTable({ invoices }: BillingHistoryProps) {
  return (
    <div className="rounded-lg bg-charcoal-800 border border-charcoal-700 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-charcoal-700">
        <h3 className="text-sm font-medium text-text-muted">Billing History</h3>
        <button className="text-sm text-brand-blue hover:underline flex items-center gap-1">
          <Download className="h-3.5 w-3.5" />
          Download All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-charcoal-700 bg-charcoal-800/50">
              <th className="px-5 py-3 text-left text-xs font-medium text-text-dimmed uppercase tracking-wider">
                Date
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-text-dimmed uppercase tracking-wider">
                Invoice ID
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-text-dimmed uppercase tracking-wider">
                Amount
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-text-dimmed uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-text-dimmed uppercase tracking-wider">
                Invoice
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-b border-charcoal-700 last:border-0"
              >
                <td className="px-5 py-4 text-sm text-text-secondary">
                  {new Date(invoice.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-5 py-4 text-sm font-mono text-text-muted">
                  {invoice.invoiceId}
                </td>
                <td className="px-5 py-4 text-sm font-medium text-text-primary">
                  ${invoice.amount.toFixed(2)}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded text-xs font-medium',
                      invoice.status === 'paid'
                        ? 'bg-success/10 text-success'
                        : invoice.status === 'pending'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-error/10 text-error'
                    )}
                  >
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button className="text-sm text-brand-blue hover:underline flex items-center gap-1">
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-charcoal-700 text-center">
        <button className="text-sm text-brand-blue hover:underline">
          View All Invoices
        </button>
      </div>
    </div>
  );
}
