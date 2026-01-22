'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InboxPlacementCard,
  SpamScoreMeter,
  CodeBlock,
  TestHistoryMini,
} from '@/components/playground';
import {
  Code,
  BookOpen,
  Key,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Loader2,
  Mail,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

// Mock usage data - replace with actual API
const mockUsage = { used: 47, limit: 500, plan: 'starter' };

// Test result type
interface TestResult {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  inbox_placement?: {
    gmail: 'inbox' | 'spam' | 'not_delivered';
    outlook: 'inbox' | 'spam' | 'not_delivered';
    yahoo: 'inbox' | 'spam' | 'not_delivered';
    apple_mail: 'inbox' | 'spam' | 'not_delivered';
  };
  spam_score?: number;
  authentication?: {
    spf: 'pass' | 'fail';
    dkim: 'pass' | 'fail';
    dmarc: 'pass' | 'fail';
  };
  recommendations?: string[];
  completed_at?: string;
}

export default function PlaygroundPage() {
  const [usage] = useState(mockUsage);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [showProTip, setShowProTip] = useState(false);
  const [codeOpen, setCodeOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'html' | 'text'>('html');
  const [codeTab, setCodeTab] = useState<'curl' | 'node' | 'python' | 'go'>('curl');

  const [formData, setFormData] = useState({
    from: 'noreply@yourdomain.com',
    subject: 'Test Email from Playground',
    html: '<h1>Hello!</h1>\n<p>This is a test email sent from the playground.</p>',
    text: 'Hello!\n\nThis is a test email sent from the playground.',
  });

  // Generate live API code examples based on form data
  const generateCurlExample = () => {
    const jsonBody = JSON.stringify(
      {
        from: formData.from,
        subject: formData.subject,
        html: formData.html,
        text: formData.text,
      },
      null,
      2
    );
    return `curl -X POST https://api.deliverabilityapi.com/v1/tests \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${jsonBody}'`;
  };

  const generateNodeExample = () => {
    return `const response = await fetch('https://api.deliverabilityapi.com/v1/tests', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: '${formData.from}',
    subject: '${formData.subject}',
    html: ${JSON.stringify(formData.html)},
    text: ${JSON.stringify(formData.text)}
  })
});

const result = await response.json();
console.log(result);`;
  };

  const generatePythonExample = () => {
    return `import requests

response = requests.post(
    'https://api.deliverabilityapi.com/v1/tests',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'from': '${formData.from}',
        'subject': '${formData.subject}',
        'html': ${JSON.stringify(formData.html)},
        'text': ${JSON.stringify(formData.text)}
    }
)

result = response.json()
print(result)`;
  };

  const generateGoExample = () => {
    return `package main

import (
    "bytes"
    "encoding/json"
    "net/http"
)

func main() {
    data := map[string]string{
        "from":    "${formData.from}",
        "subject": "${formData.subject}",
        "html":    ${JSON.stringify(formData.html)},
        "text":    ${JSON.stringify(formData.text)},
    }

    jsonData, _ := json.Marshal(data)

    req, _ := http.NewRequest("POST",
        "https://api.deliverabilityapi.com/v1/tests",
        bytes.NewBuffer(jsonData))

    req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()
}`;
  };

  const codeExamples = {
    curl: generateCurlExample(),
    node: generateNodeExample(),
    python: generatePythonExample(),
    go: generateGoExample(),
  };

  const runTest = async () => {
    if (usage.used >= usage.limit) {
      return;
    }

    setLoading(true);
    setResult(null);

    // Simulate API call - replace with actual API
    setTimeout(() => {
      setResult({
        id: 'test_' + Math.random().toString(36).substr(2, 9),
        status: 'completed',
        inbox_placement: {
          gmail: 'inbox',
          outlook: 'inbox',
          yahoo: 'spam',
          apple_mail: 'inbox',
        },
        spam_score: 2.8,
        authentication: {
          spf: 'pass',
          dkim: 'pass',
          dmarc: 'pass',
        },
        recommendations: [
          'Consider warming up your IP for Yahoo',
          'Reduce image-to-text ratio for better deliverability',
        ],
        completed_at: new Date().toISOString(),
      });
      setLoading(false);
      setShowProTip(true);
    }, 3000);
  };

  const usagePercentage = Math.min((usage.used / usage.limit) * 100, 100);
  const isNearLimit = usagePercentage >= 80;
  const isAtLimit = usage.used >= usage.limit;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
          <span className="text-3xl">🎮</span>
          Email Deliverability Playground
        </h1>
        <p className="text-text-muted mt-2">
          Test emails visually — API code shown below for automation
        </p>
      </div>

      {/* Usage Meter */}
      <div
        className={cn(
          'p-4 rounded-lg border transition-all',
          isAtLimit
            ? 'bg-error/5 border-error/20'
            : isNearLimit
            ? 'bg-warning/5 border-warning/20'
            : 'bg-brand-blue/5 border-brand-blue/20'
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-text-primary">Monthly Usage</h3>
              <span className="px-2 py-0.5 text-xs font-medium rounded bg-charcoal-700 text-text-muted capitalize">
                {usage.plan}
              </span>
            </div>
            <p className="text-xl font-bold text-text-primary mt-1">
              {usage.used.toLocaleString()}{' '}
              <span className="text-sm font-normal text-text-muted">
                / {usage.limit.toLocaleString()} tests
              </span>
            </p>
          </div>
          {isNearLimit && !isAtLimit && (
            <Link
              href="/dashboard/usage"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warning/10 text-warning text-sm font-medium hover:bg-warning/20 transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              Upgrade
            </Link>
          )}
          {isAtLimit && (
            <Link
              href="/dashboard/usage"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-error/10 text-error text-sm font-medium hover:bg-error/20 transition-colors"
            >
              <AlertCircle className="h-4 w-4" />
              Limit Reached
            </Link>
          )}
        </div>
        <div className="h-2 bg-charcoal-700 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              isAtLimit ? 'bg-error' : isNearLimit ? 'bg-warning' : 'bg-brand-blue'
            )}
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
      </div>

      {/* Pro Tip Banner */}
      {showProTip && (
        <div className="p-4 rounded-lg bg-brand-blue/5 border border-brand-blue/20">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-text-primary">
                Pro Tip for Developers
              </h3>
              <p className="text-sm text-text-muted mt-1">
                See the API code below? You can automate this testing in your CI/CD pipeline!
              </p>
              <div className="flex gap-2 mt-3">
                <Link
                  href="/dashboard/api-keys"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-blue text-white text-sm font-medium hover:bg-brand-blue-hover transition-colors"
                >
                  <Key className="h-4 w-4" />
                  Get API Key
                </Link>
                <Link
                  href="/docs/quickstart"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-charcoal-700 text-text-secondary text-sm font-medium hover:bg-charcoal-600 transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  View Docs
                </Link>
                <button
                  onClick={() => setShowProTip(false)}
                  className="px-3 py-1.5 text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Testing Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Email Configuration + API Code */}
        <div className="space-y-4">
          {/* Email Configuration Form */}
          <div className="p-6 rounded-lg bg-charcoal-800 border border-charcoal-700">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Configure Email
            </h2>

            <div className="space-y-4">
              {/* From Address */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  From Address
                </label>
                <select
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  className="w-full h-9 px-3 rounded-md bg-charcoal-900 border border-charcoal-700 text-text-primary text-sm focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none"
                >
                  <option value="noreply@yourdomain.com">noreply@yourdomain.com</option>
                  <option value="support@yourdomain.com">support@yourdomain.com</option>
                  <option value="hello@yourdomain.com">hello@yourdomain.com</option>
                </select>
                <p className="text-xs text-text-dimmed mt-1">
                  Verify domains in Settings to add more
                </p>
              </div>

              {/* Test Destinations */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Test Destinations
                </label>
                <div className="p-3 rounded-lg bg-charcoal-900 border border-charcoal-700">
                  <p className="text-xs text-text-muted mb-2">Testing across:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Gmail', color: 'bg-red-500' },
                      { name: 'Outlook', color: 'bg-blue-500' },
                      { name: 'Yahoo', color: 'bg-purple-500' },
                      { name: 'Apple Mail', color: 'bg-gray-500' },
                    ].map((provider) => (
                      <div key={provider.name} className="flex items-center gap-2 text-sm text-text-secondary">
                        <div className={cn('w-2 h-2 rounded-full', provider.color)} />
                        {provider.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Subject Line
                </label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Welcome to our platform"
                  className="bg-charcoal-900 border-charcoal-700 text-text-primary"
                />
              </div>

              {/* Email Body Tabs */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Email Content
                </label>
                <div className="rounded-lg bg-charcoal-900 border border-charcoal-700 overflow-hidden">
                  <div className="flex border-b border-charcoal-700">
                    {(['html', 'text'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          'flex-1 px-4 py-2 text-sm font-medium transition-colors',
                          activeTab === tab
                            ? 'bg-charcoal-800 text-text-primary'
                            : 'text-text-muted hover:text-text-secondary'
                        )}
                      >
                        {tab === 'html' ? 'HTML' : 'Plain Text'}
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={6}
                    value={activeTab === 'html' ? formData.html : formData.text}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [activeTab]: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-transparent text-text-secondary font-mono text-sm resize-none outline-none"
                    placeholder={activeTab === 'html' ? '<h1>Hello!</h1>' : 'Plain text content'}
                  />
                </div>
              </div>

              {/* Run Test Button */}
              <Button
                onClick={runTest}
                disabled={loading || isAtLimit}
                className="w-full h-11 bg-brand-blue hover:bg-brand-blue-hover text-white font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Testing Deliverability...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Run Test
                  </>
                )}
              </Button>

              {isAtLimit && (
                <div className="p-3 rounded-lg bg-error/10 border border-error/20">
                  <p className="text-sm text-error">
                    Monthly limit reached.{' '}
                    <Link href="/dashboard/usage" className="underline">
                      Upgrade plan →
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Live API Code Section */}
          <div className="rounded-lg bg-charcoal-800 border-2 border-brand-blue/30 overflow-hidden">
            <button
              onClick={() => setCodeOpen(!codeOpen)}
              className="w-full flex items-center justify-between p-4 hover:bg-charcoal-700/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-brand-blue" />
                <span className="font-semibold text-text-primary">API Code for This Test</span>
              </div>
              {codeOpen ? (
                <ChevronUp className="h-5 w-5 text-text-muted" />
              ) : (
                <ChevronDown className="h-5 w-5 text-text-muted" />
              )}
            </button>

            {codeOpen && (
              <div className="px-4 pb-4 space-y-4">
                <p className="text-sm text-text-muted">
                  This code does exactly what the form above does. Copy it to automate your testing.
                </p>

                {/* Language Tabs */}
                <div className="flex gap-1 p-1 rounded-lg bg-charcoal-900">
                  {(['curl', 'node', 'python', 'go'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setCodeTab(tab)}
                      className={cn(
                        'flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors',
                        codeTab === tab
                          ? 'bg-charcoal-700 text-text-primary'
                          : 'text-text-muted hover:text-text-secondary'
                      )}
                    >
                      {tab === 'curl' ? 'cURL' : tab === 'node' ? 'Node.js' : tab === 'python' ? 'Python' : 'Go'}
                    </button>
                  ))}
                </div>

                <CodeBlock code={codeExamples[codeTab]} language={codeTab === 'node' ? 'javascript' : codeTab} showCopy />

                <div className="flex gap-2">
                  <Link
                    href="/dashboard/api-keys"
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-charcoal-700 text-text-secondary text-sm font-medium hover:bg-charcoal-600 transition-colors"
                  >
                    <Key className="h-4 w-4" />
                    Get API Key
                  </Link>
                  <Link
                    href="/docs/quickstart"
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-charcoal-700 text-text-secondary text-sm font-medium hover:bg-charcoal-600 transition-colors"
                  >
                    <BookOpen className="h-4 w-4" />
                    Full Docs
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Test Results */}
        <div className="p-6 rounded-lg bg-charcoal-800 border border-charcoal-700">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Test Results</h2>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-charcoal-700" />
                <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-brand-blue border-t-transparent animate-spin" />
              </div>
              <p className="mt-4 font-medium text-text-primary">Testing deliverability...</p>
              <p className="text-sm text-text-muted mt-2">Usually takes 2-5 minutes</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !result && (
            <div className="flex flex-col items-center justify-center py-16 text-text-muted">
              <div className="text-6xl mb-4">📧</div>
              <p className="text-lg font-medium text-text-primary">Ready to test</p>
              <p className="text-sm mt-2 text-center">
                Configure your email and click &quot;Run Test&quot;
              </p>
            </div>
          )}

          {/* Results */}
          {result && result.status === 'completed' && (
            <div className="space-y-6">
              {/* Success Banner */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
                <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                <div>
                  <p className="text-sm font-medium text-success">Test Completed</p>
                  <p className="text-xs text-text-muted">
                    {result.completed_at && new Date(result.completed_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Inbox Placement */}
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-3">Inbox Placement</h3>
                <div className="grid grid-cols-2 gap-3">
                  {result.inbox_placement && (
                    <>
                      <InboxPlacementCard provider="gmail" status={result.inbox_placement.gmail} />
                      <InboxPlacementCard provider="outlook" status={result.inbox_placement.outlook} />
                      <InboxPlacementCard provider="yahoo" status={result.inbox_placement.yahoo} />
                      <InboxPlacementCard provider="apple_mail" status={result.inbox_placement.apple_mail} />
                    </>
                  )}
                </div>
              </div>

              {/* Spam Score */}
              {result.spam_score !== undefined && (
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-3">Spam Score</h3>
                  <SpamScoreMeter score={result.spam_score} />
                </div>
              )}

              {/* Authentication */}
              {result.authentication && (
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-3">Email Authentication</h3>
                  <div className="flex flex-wrap gap-2">
                    {(['spf', 'dkim', 'dmarc'] as const).map((auth) => (
                      <span
                        key={auth}
                        className={cn(
                          'px-3 py-1 rounded-full text-sm font-medium',
                          result.authentication![auth] === 'pass'
                            ? 'bg-success/10 text-success'
                            : 'bg-error/10 text-error'
                        )}
                      >
                        {auth.toUpperCase()}: {result.authentication![auth]}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm p-3 rounded-lg bg-brand-blue/5 border border-brand-blue/10"
                      >
                        <Lightbulb className="h-4 w-4 text-brand-blue shrink-0 mt-0.5" />
                        <span className="text-text-secondary">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* View Full Details */}
              <Link
                href={`/dashboard/tests/${result.id}`}
                className="block w-full text-center px-4 py-2 rounded-lg bg-charcoal-700 text-text-secondary text-sm font-medium hover:bg-charcoal-600 transition-colors"
              >
                View Full Test Details →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Tests */}
      <div className="p-6 rounded-lg bg-charcoal-800 border border-charcoal-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Recent Tests</h2>
          <Link
            href="/dashboard/tests"
            className="text-sm text-brand-blue hover:underline"
          >
            View All →
          </Link>
        </div>
        <TestHistoryMini limit={5} />
      </div>
    </div>
  );
}
