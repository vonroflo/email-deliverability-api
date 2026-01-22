'use client';

import { useState } from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApiKeyCard, QuickStartGuide, BestPracticeCard, type ApiKey } from '@/components/dashboard';

// Mock data - in production, this would come from your API
const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    key: 'deliverability_live_EXAMPLE_KEY_PLACEHOLDER_DO_NOT_USE_IN_PRODUCTION',
    type: 'live',
    createdAt: '2023-10-12T00:00:00Z',
    lastUsedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    permissions: 'Full Access',
  },
  {
    id: '2',
    key: 'deliverability_test_EXAMPLE_KEY_PLACEHOLDER_DO_NOT_USE_IN_PRODUCTION',
    type: 'test',
    createdAt: '2024-06-20T00:00:00Z',
    lastUsedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    permissions: 'Full Access',
  },
];

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);

  const liveKeys = apiKeys.filter((key) => key.type === 'live');
  const testKeys = apiKeys.filter((key) => key.type === 'test');

  const handleRollKey = (id: string) => {
    // In production, this would call your API to roll the key
    console.log('Rolling key:', id);
    alert('Key rotation initiated. In production, this would generate a new key.');
  };

  const handleRevokeKey = (id: string) => {
    // In production, this would call your API to revoke the key
    if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      setApiKeys((keys) => keys.filter((key) => key.id !== id));
    }
  };

  const handleCreateKey = () => {
    // In production, this would open a modal or call your API
    alert('Create new API key. In production, this would open a creation modal.');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-charcoal-800 bg-charcoal-900/50">
        <div className="px-6 lg:px-8 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <span>Settings</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-text-primary">API Keys</span>
          </nav>

          {/* Title and action */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">
                API Key Management
              </h1>
              <p className="text-sm text-text-muted mt-1">
                Your API keys are how you authenticate your requests to MailDeliver.
                Keep them secure and never share them publicly.
              </p>
            </div>
            <Button
              onClick={handleCreateKey}
              className="bg-brand-blue hover:bg-brand-blue-hover text-white shrink-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Key
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[1fr,320px] gap-6">
          {/* Main content */}
          <div className="space-y-8">
            {/* Live API Keys */}
            <section>
              <h2 className="text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-success" />
                Live API Keys
              </h2>
              <div className="space-y-4">
                {liveKeys.length > 0 ? (
                  liveKeys.map((key) => (
                    <ApiKeyCard
                      key={key.id}
                      apiKey={key}
                      onRollKey={handleRollKey}
                      onRevokeKey={handleRevokeKey}
                    />
                  ))
                ) : (
                  <div className="rounded-lg bg-charcoal-800 border border-charcoal-700 p-8 text-center">
                    <p className="text-text-muted">No live API keys yet.</p>
                    <Button
                      onClick={handleCreateKey}
                      variant="outline"
                      className="mt-4 border-charcoal-600"
                    >
                      Create your first live key
                    </Button>
                  </div>
                )}
              </div>
            </section>

            {/* Test API Keys */}
            <section>
              <h2 className="text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-warning" />
                Test API Keys
              </h2>
              <div className="space-y-4">
                {testKeys.length > 0 ? (
                  testKeys.map((key) => (
                    <ApiKeyCard
                      key={key.id}
                      apiKey={key}
                      onRollKey={handleRollKey}
                      onRevokeKey={handleRevokeKey}
                    />
                  ))
                ) : (
                  <div className="rounded-lg bg-charcoal-800 border border-charcoal-700 p-8 text-center">
                    <p className="text-text-muted">No test API keys yet.</p>
                    <Button
                      onClick={handleCreateKey}
                      variant="outline"
                      className="mt-4 border-charcoal-600"
                    >
                      Create your first test key
                    </Button>
                  </div>
                )}
              </div>
            </section>

            {/* Best Practice Card */}
            <BestPracticeCard />
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <QuickStartGuide />
          </aside>
        </div>
      </div>
    </div>
  );
}
