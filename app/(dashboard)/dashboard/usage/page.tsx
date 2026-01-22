'use client';

import { Button } from '@/components/ui/button';
import {
  UsageProgressCard,
  ApiVolumeCard,
  PaymentMethodCard,
  EnterpriseUpsellCard,
  BillingHistoryTable,
  type Invoice,
} from '@/components/dashboard';

// Mock data - in production, this would come from your API
const mockChartData = [
  { date: 'Jun 20', value: 450 },
  { date: 'Jun 25', value: 380 },
  { date: 'Jun 30', value: 520 },
  { date: 'Jul 05', value: 410 },
  { date: 'Jul 10', value: 680 },
  { date: 'Jul 15', value: 590 },
  { date: 'Jul 18', value: 520 },
];

const mockInvoices: Invoice[] = [
  {
    id: '1',
    date: '2024-07-01',
    invoiceId: 'INV-2024-007',
    amount: 49.0,
    status: 'paid',
  },
  {
    id: '2',
    date: '2024-06-01',
    invoiceId: 'INV-2024-006',
    amount: 49.0,
    status: 'paid',
  },
  {
    id: '3',
    date: '2024-05-01',
    invoiceId: 'INV-2024-005',
    amount: 49.0,
    status: 'paid',
  },
  {
    id: '4',
    date: '2024-04-01',
    invoiceId: 'INV-2024-004',
    amount: 49.0,
    status: 'paid',
  },
];

export default function UsageBillingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-charcoal-800 bg-charcoal-900/50">
        <div className="px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-semibold text-text-primary">
                  Usage & Billing
                </h1>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-brand-blue/10 text-brand-blue uppercase">
                  Pro Plan
                </span>
              </div>
              <p className="text-sm text-text-muted">
                Manage your subscription, monitor API consumption, and view transaction history.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-charcoal-600 text-text-primary hover:bg-charcoal-800"
              >
                Cancel Plan
              </Button>
              <Button className="bg-brand-blue hover:bg-brand-blue-hover text-white">
                Upgrade Plan
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 lg:px-8 py-6 space-y-6">
        {/* Usage Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          <UsageProgressCard
            used={47}
            total={500}
            label="Test Executions"
            resetDate="12 days (Aug 30)"
          />
          <ApiVolumeCard totalRequests={12482} data={mockChartData} />
        </div>

        {/* Payment & Upsell Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          <PaymentMethodCard
            cardBrand="Visa"
            lastFour="4242"
            billingEmail="billing@company.com"
            onEdit={() => alert('Edit payment method')}
          />
          <EnterpriseUpsellCard />
        </div>

        {/* Billing History */}
        <BillingHistoryTable invoices={mockInvoices} />
      </div>
    </div>
  );
}
