import { CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Status - Email Deliverability API',
  description: 'Current system status and uptime information.',
};

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-charcoal-900">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold text-text-primary mb-4">System Status</h1>
        <p className="text-xl text-text-muted mb-12">
          Current operational status of all services.
        </p>

        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-charcoal-800 border border-charcoal-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-success" />
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">API</h2>
                  <p className="text-sm text-text-muted">api.deliverability.dev</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                Operational
              </span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-charcoal-800 border border-charcoal-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-success" />
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Dashboard</h2>
                  <p className="text-sm text-text-muted">deliverability.dev</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                Operational
              </span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-charcoal-800 border border-charcoal-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-success" />
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Email Testing</h2>
                  <p className="text-sm text-text-muted">Inbox placement checks</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                Operational
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-text-dimmed mt-8 text-center">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
