'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
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
  Upload,
  Plus,
  X,
  Layers,
} from 'lucide-react';

// Test mode type
type TestMode = 'single' | 'bulk';

// Test result type
interface TestResult {
  id: string;
  from: string;
  subject: string;
  status: 'processing' | 'completed' | 'failed';
  inbox_placement?: {
    gmail: 'inbox' | 'spam' | 'not_delivered' | 'pending';
    outlook: 'inbox' | 'spam' | 'not_delivered' | 'pending';
    yahoo: 'inbox' | 'spam' | 'not_delivered' | 'pending';
  };
  spam_score?: string | null;
  authentication?: {
    spf: 'pass' | 'fail' | 'none';
    dkim: 'pass' | 'fail' | 'none';
    dmarc: 'pass' | 'fail' | 'none';
  };
  recommendations?: string[];
  completed_at?: string | null;
}

// Bulk test input
interface BulkTestInput {
  from: string;
  subject: string;
  html?: string;
  text?: string;
}

export default function PlaygroundPage() {
  const [testMode, setTestMode] = useState<TestMode>('single');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [showProTip, setShowProTip] = useState(false);
  const [codeOpen, setCodeOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'html' | 'text'>('html');
  const [codeTab, setCodeTab] = useState<'curl' | 'node' | 'python' | 'go'>('curl');
  const [pollingIds, setPollingIds] = useState<Set<string>>(new Set());

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Single test form data
  const [formData, setFormData] = useState({
    from: '',
    subject: 'Test Email from Playground',
    html: '<h1>Hello!</h1>\n<p>This is a test email sent from the playground.</p>',
    text: 'Hello!\n\nThis is a test email sent from the playground.',
  });

  // Bulk test data
  const [bulkFromAddresses, setBulkFromAddresses] = useState<string[]>(['']);
  const [bulkSubjects, setBulkSubjects] = useState<string[]>(['Test Email']);
  const [bulkContent, setBulkContent] = useState({
    html: '<h1>Hello!</h1>\n<p>This is a test email.</p>',
    text: 'Hello!\n\nThis is a test email.',
  });

  // Poll for test results
  const pollTestResult = useCallback(async (testId: string) => {
    if (pollingIds.has(testId)) return;

    setPollingIds(prev => new Set(prev).add(testId));

    const maxAttempts = 60; // 5 minutes at 5 second intervals
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/dashboard/tests/${testId}`);
        if (!response.ok) return;

        const data = await response.json();

        setResults(prev => prev.map(r =>
          r.id === testId ? {
            ...r,
            status: data.status,
            inbox_placement: data.inbox_placement,
            spam_score: data.spam_score,
            authentication: data.authentication,
            recommendations: data.recommendations,
            completed_at: data.completed_at,
          } : r
        ));

        if (data.status === 'completed' || data.status === 'failed') {
          setPollingIds(prev => {
            const next = new Set(prev);
            next.delete(testId);
            return next;
          });
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    poll();
  }, [pollingIds]);

  // Generate live API code examples based on form data
  const generateCurlExample = () => {
    const testData = testMode === 'single' ? formData : {
      from: bulkFromAddresses[0] || 'noreply@yourdomain.com',
      subject: bulkSubjects[0] || 'Test Email',
      html: bulkContent.html,
      text: bulkContent.text,
    };

    const jsonBody = JSON.stringify(
      {
        from: testData.from,
        subject: testData.subject,
        html: testData.html,
        text: testData.text,
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
    const testData = testMode === 'single' ? formData : {
      from: bulkFromAddresses[0] || 'noreply@yourdomain.com',
      subject: bulkSubjects[0] || 'Test Email',
      html: bulkContent.html,
      text: bulkContent.text,
    };

    return `const response = await fetch('https://api.deliverabilityapi.com/v1/tests', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: '${testData.from}',
    subject: '${testData.subject}',
    html: ${JSON.stringify(testData.html)},
    text: ${JSON.stringify(testData.text)}
  })
});

const result = await response.json();
console.log(result);`;
  };

  const generatePythonExample = () => {
    const testData = testMode === 'single' ? formData : {
      from: bulkFromAddresses[0] || 'noreply@yourdomain.com',
      subject: bulkSubjects[0] || 'Test Email',
      html: bulkContent.html,
      text: bulkContent.text,
    };

    return `import requests

response = requests.post(
    'https://api.deliverabilityapi.com/v1/tests',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'from': '${testData.from}',
        'subject': '${testData.subject}',
        'html': ${JSON.stringify(testData.html)},
        'text': ${JSON.stringify(testData.text)}
    }
)

result = response.json()
print(result)`;
  };

  const generateGoExample = () => {
    const testData = testMode === 'single' ? formData : {
      from: bulkFromAddresses[0] || 'noreply@yourdomain.com',
      subject: bulkSubjects[0] || 'Test Email',
      html: bulkContent.html,
      text: bulkContent.text,
    };

    return `package main

import (
    "bytes"
    "encoding/json"
    "net/http"
)

func main() {
    data := map[string]string{
        "from":    "${testData.from}",
        "subject": "${testData.subject}",
        "html":    ${JSON.stringify(testData.html)},
        "text":    ${JSON.stringify(testData.text)},
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

  // Run single test
  const runSingleTest = async () => {
    if (!formData.from || !formData.subject) {
      alert('Please fill in From Address and Subject');
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const response = await fetch('/api/dashboard/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: formData.from,
          subject: formData.subject,
          html: formData.html,
          text: formData.text,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create test');
      }

      const data = await response.json();

      if (data.tests && data.tests.length > 0) {
        const newResults: TestResult[] = data.tests.map((t: any) => ({
          id: t.id,
          from: t.from,
          subject: t.subject,
          status: t.status,
        }));

        setResults(newResults);
        setShowProTip(true);

        // Start polling for results
        newResults.forEach(r => pollTestResult(r.id));
      }
    } catch (error) {
      console.error('Test error:', error);
      alert(error instanceof Error ? error.message : 'Failed to run test');
    } finally {
      setLoading(false);
    }
  };

  // Generate bulk test combinations
  const generateBulkTests = (): BulkTestInput[] => {
    const tests: BulkTestInput[] = [];
    const fromAddresses = bulkFromAddresses.filter(a => a.trim());
    const subjects = bulkSubjects.filter(s => s.trim());

    if (fromAddresses.length === 0 || subjects.length === 0) {
      return [];
    }

    // Generate combinations
    for (const from of fromAddresses) {
      for (const subject of subjects) {
        tests.push({
          from: from.trim(),
          subject: subject.trim(),
          html: bulkContent.html,
          text: bulkContent.text,
        });
      }
    }

    return tests;
  };

  // Run bulk tests
  const runBulkTests = async () => {
    const tests = generateBulkTests();

    if (tests.length === 0) {
      alert('Please add at least one From Address and Subject');
      return;
    }

    if (tests.length > 50) {
      alert('Maximum 50 tests per batch');
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const response = await fetch('/api/dashboard/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tests }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create tests');
      }

      const data = await response.json();

      if (data.tests && data.tests.length > 0) {
        const newResults: TestResult[] = data.tests.map((t: any) => ({
          id: t.id,
          from: t.from,
          subject: t.subject,
          status: t.status,
        }));

        setResults(newResults);
        setShowProTip(true);

        // Start polling for results
        newResults.forEach(r => pollTestResult(r.id));
      }
    } catch (error) {
      console.error('Bulk test error:', error);
      alert(error instanceof Error ? error.message : 'Failed to run bulk tests');
    } finally {
      setLoading(false);
    }
  };

  // Handle CSV upload
  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split(/\r?\n/).filter(line => line.trim());

      // Parse CSV - expecting email addresses (one per line or comma-separated)
      const emails: string[] = [];
      for (const line of lines) {
        // Skip header if it looks like one
        if (line.toLowerCase().includes('email') || line.toLowerCase().includes('from')) {
          continue;
        }
        // Handle comma-separated values
        const parts = line.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
        emails.push(...parts.filter(p => p.includes('@')));
      }

      if (emails.length > 0) {
        setBulkFromAddresses(emails.slice(0, 50)); // Limit to 50
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Add bulk from address
  const addFromAddress = () => {
    if (bulkFromAddresses.length < 50) {
      setBulkFromAddresses([...bulkFromAddresses, '']);
    }
  };

  // Remove bulk from address
  const removeFromAddress = (index: number) => {
    setBulkFromAddresses(bulkFromAddresses.filter((_, i) => i !== index));
  };

  // Add bulk subject
  const addSubject = () => {
    if (bulkSubjects.length < 10) {
      setBulkSubjects([...bulkSubjects, '']);
    }
  };

  // Remove bulk subject
  const removeSubject = (index: number) => {
    setBulkSubjects(bulkSubjects.filter((_, i) => i !== index));
  };

  const bulkTestCount = generateBulkTests().length;
  const completedCount = results.filter(r => r.status === 'completed').length;
  const processingCount = results.filter(r => r.status === 'processing').length;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
          Email Deliverability Playground
        </h1>
        <p className="text-text-muted mt-2">
          Test email deliverability - single or bulk tests supported
        </p>
      </div>

      {/* Test Mode Toggle */}
      <div className="flex gap-2 p-1 rounded-lg bg-charcoal-800 border border-charcoal-700 w-fit">
        <button
          onClick={() => setTestMode('single')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
            testMode === 'single'
              ? 'bg-brand-blue text-white'
              : 'text-text-muted hover:text-text-secondary'
          )}
        >
          <Mail className="h-4 w-4" />
          Single Test
        </button>
        <button
          onClick={() => setTestMode('bulk')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
            testMode === 'bulk'
              ? 'bg-brand-blue text-white'
              : 'text-text-muted hover:text-text-secondary'
          )}
        >
          <Layers className="h-4 w-4" />
          Bulk Test
        </button>
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
              {testMode === 'single' ? 'Configure Email' : 'Configure Bulk Tests'}
            </h2>

            {testMode === 'single' ? (
              /* Single Test Form */
              <div className="space-y-4">
                {/* From Address */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    From Address
                  </label>
                  <Input
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    placeholder="noreply@yourdomain.com"
                    className="bg-charcoal-900 border-charcoal-700 text-text-primary"
                  />
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
                  onClick={runSingleTest}
                  disabled={loading}
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
              </div>
            ) : (
              /* Bulk Test Form */
              <div className="space-y-4">
                {/* From Addresses */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-text-secondary">
                      From Addresses ({bulkFromAddresses.filter(a => a.trim()).length})
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleCsvUpload}
                        accept=".csv,.txt"
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-brand-blue hover:text-brand-blue-hover transition-colors"
                      >
                        <Upload className="h-3 w-3" />
                        Import CSV
                      </button>
                      <button
                        onClick={addFromAddress}
                        disabled={bulkFromAddresses.length >= 50}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-brand-blue hover:text-brand-blue-hover transition-colors disabled:opacity-50"
                      >
                        <Plus className="h-3 w-3" />
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {bulkFromAddresses.map((address, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={address}
                          onChange={(e) => {
                            const newAddresses = [...bulkFromAddresses];
                            newAddresses[index] = e.target.value;
                            setBulkFromAddresses(newAddresses);
                          }}
                          placeholder="email@domain.com"
                          className="bg-charcoal-900 border-charcoal-700 text-text-primary text-sm"
                        />
                        {bulkFromAddresses.length > 1 && (
                          <button
                            onClick={() => removeFromAddress(index)}
                            className="p-2 text-text-muted hover:text-error transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subject Variations */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-text-secondary">
                      Subject Variations ({bulkSubjects.filter(s => s.trim()).length})
                    </label>
                    <button
                      onClick={addSubject}
                      disabled={bulkSubjects.length >= 10}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-brand-blue hover:text-brand-blue-hover transition-colors disabled:opacity-50"
                    >
                      <Plus className="h-3 w-3" />
                      Add Variation
                    </button>
                  </div>
                  <div className="space-y-2">
                    {bulkSubjects.map((subject, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={subject}
                          onChange={(e) => {
                            const newSubjects = [...bulkSubjects];
                            newSubjects[index] = e.target.value;
                            setBulkSubjects(newSubjects);
                          }}
                          placeholder="Subject line variation"
                          className="bg-charcoal-900 border-charcoal-700 text-text-primary text-sm"
                        />
                        {bulkSubjects.length > 1 && (
                          <button
                            onClick={() => removeSubject(index)}
                            className="p-2 text-text-muted hover:text-error transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email Content */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Email Content (shared across all tests)
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
                      rows={4}
                      value={activeTab === 'html' ? bulkContent.html : bulkContent.text}
                      onChange={(e) =>
                        setBulkContent({
                          ...bulkContent,
                          [activeTab]: e.target.value,
                        })
                      }
                      className="w-full p-3 bg-transparent text-text-secondary font-mono text-sm resize-none outline-none"
                      placeholder={activeTab === 'html' ? '<h1>Hello!</h1>' : 'Plain text content'}
                    />
                  </div>
                </div>

                {/* Test Count Preview */}
                <div className="p-3 rounded-lg bg-charcoal-900 border border-charcoal-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Tests to run:</span>
                    <span className="font-semibold text-text-primary">
                      {bulkTestCount} {bulkTestCount === 1 ? 'test' : 'tests'}
                    </span>
                  </div>
                  <p className="text-xs text-text-dimmed mt-1">
                    {bulkFromAddresses.filter(a => a.trim()).length} addresses × {bulkSubjects.filter(s => s.trim()).length} subjects
                  </p>
                </div>

                {/* Run Bulk Tests Button */}
                <Button
                  onClick={runBulkTests}
                  disabled={loading || bulkTestCount === 0}
                  className="w-full h-11 bg-brand-blue hover:bg-brand-blue-hover text-white font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Running {bulkTestCount} Tests...
                    </>
                  ) : (
                    <>
                      <Layers className="h-4 w-4 mr-2" />
                      Run {bulkTestCount} Tests
                    </>
                  )}
                </Button>
              </div>
            )}
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
          {loading && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-charcoal-700" />
                <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-brand-blue border-t-transparent animate-spin" />
              </div>
              <p className="mt-4 font-medium text-text-primary">Creating tests...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-text-muted">
              <div className="text-6xl mb-4">📧</div>
              <p className="text-lg font-medium text-text-primary">Ready to test</p>
              <p className="text-sm mt-2 text-center">
                Configure your email and click &quot;Run Test&quot;
              </p>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              {/* Progress Summary */}
              {results.length > 1 && (
                <div className="p-3 rounded-lg bg-charcoal-900 border border-charcoal-700">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-text-muted">Progress</span>
                    <span className="font-medium text-text-primary">
                      {completedCount} / {results.length} completed
                    </span>
                  </div>
                  <div className="h-2 bg-charcoal-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-blue rounded-full transition-all duration-500"
                      style={{ width: `${(completedCount / results.length) * 100}%` }}
                    />
                  </div>
                  {processingCount > 0 && (
                    <p className="text-xs text-text-dimmed mt-2 flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      {processingCount} tests in progress...
                    </p>
                  )}
                </div>
              )}

              {/* Individual Results */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 rounded-lg bg-charcoal-900 border border-charcoal-700"
                  >
                    {/* Test Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {result.subject}
                        </p>
                        <p className="text-xs text-text-muted truncate">{result.from}</p>
                      </div>
                      <span
                        className={cn(
                          'px-2 py-0.5 text-xs font-medium rounded',
                          result.status === 'completed'
                            ? 'bg-success/10 text-success'
                            : result.status === 'failed'
                            ? 'bg-error/10 text-error'
                            : 'bg-brand-blue/10 text-brand-blue'
                        )}
                      >
                        {result.status}
                      </span>
                    </div>

                    {/* Processing State */}
                    {result.status === 'processing' && (
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Testing deliverability...</span>
                      </div>
                    )}

                    {/* Completed Results */}
                    {result.status === 'completed' && (
                      <div className="space-y-3">
                        {/* Inbox Placement Mini */}
                        {result.inbox_placement && (
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(result.inbox_placement).map(([provider, status]) => (
                              <span
                                key={provider}
                                className={cn(
                                  'px-2 py-0.5 text-xs rounded',
                                  status === 'inbox'
                                    ? 'bg-success/10 text-success'
                                    : status === 'spam'
                                    ? 'bg-error/10 text-error'
                                    : 'bg-charcoal-700 text-text-muted'
                                )}
                              >
                                {provider}: {status}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Spam Score & Auth */}
                        <div className="flex items-center gap-4 text-xs text-text-muted">
                          {result.spam_score && (
                            <span>Spam Score: {result.spam_score}</span>
                          )}
                          {result.authentication && (
                            <span>
                              SPF: {result.authentication.spf} |
                              DKIM: {result.authentication.dkim} |
                              DMARC: {result.authentication.dmarc}
                            </span>
                          )}
                        </div>

                        {/* View Details Link */}
                        <Link
                          href={`/dashboard/tests/${result.id}`}
                          className="text-xs text-brand-blue hover:underline"
                        >
                          View full details →
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
