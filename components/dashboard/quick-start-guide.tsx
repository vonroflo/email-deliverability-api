'use client';

import { useState } from 'react';
import { Check, Copy, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const codeExample = `const MailDeliver = require('maildeliver');

// Initialize client
const client = new MailDeliver({
  apiKey: process.env.MAILDELIVER_API_KEY,
});

// Send your first test
const result = await client.tests.create({
  from: 'hello@yourdomain.com',
  subject: 'Hello World',
});

console.log(result.id);`;

export function QuickStartGuide() {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Quick start code */}
      <div className="rounded-lg bg-charcoal-800 border border-charcoal-700 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-charcoal-700 bg-charcoal-900/50">
          <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
            Quick Start Guide
          </span>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-success" />
                <span className="text-success">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto">
          <code>
            <span className="text-[#C792EA]">const</span>{' '}
            <span className="text-[#82AAFF]">MailDeliver</span>{' '}
            <span className="text-[#89DDFF]">=</span>{' '}
            <span className="text-[#82AAFF]">require</span>
            <span className="text-[#89DDFF]">(</span>
            <span className="text-[#C3E88D]">'maildeliver'</span>
            <span className="text-[#89DDFF]">);</span>
            {'\n\n'}
            <span className="text-[#546E7A]">// Initialize client</span>
            {'\n'}
            <span className="text-[#C792EA]">const</span>{' '}
            <span className="text-text-secondary">client</span>{' '}
            <span className="text-[#89DDFF]">=</span>{' '}
            <span className="text-[#C792EA]">new</span>{' '}
            <span className="text-[#82AAFF]">MailDeliver</span>
            <span className="text-[#89DDFF]">(</span>
            <span className="text-[#89DDFF]">{'{'}</span>
            {'\n'}
            {'  '}
            <span className="text-text-secondary">apiKey</span>
            <span className="text-[#89DDFF]">:</span>{' '}
            <span className="text-text-secondary">process</span>
            <span className="text-[#89DDFF]">.</span>
            <span className="text-text-secondary">env</span>
            <span className="text-[#89DDFF]">.</span>
            <span className="text-[#F07178]">MAILDELIVER_API_KEY</span>
            <span className="text-[#89DDFF]">,</span>
            {'\n'}
            <span className="text-[#89DDFF]">{'}'}</span>
            <span className="text-[#89DDFF]">);</span>
            {'\n\n'}
            <span className="text-[#546E7A]">// Send your first test</span>
            {'\n'}
            <span className="text-[#C792EA]">const</span>{' '}
            <span className="text-text-secondary">result</span>{' '}
            <span className="text-[#89DDFF]">=</span>{' '}
            <span className="text-[#C792EA]">await</span>{' '}
            <span className="text-text-secondary">client</span>
            <span className="text-[#89DDFF]">.</span>
            <span className="text-text-secondary">tests</span>
            <span className="text-[#89DDFF]">.</span>
            <span className="text-[#82AAFF]">create</span>
            <span className="text-[#89DDFF]">(</span>
            <span className="text-[#89DDFF]">{'{'}</span>
            {'\n'}
            {'  '}
            <span className="text-text-secondary">from</span>
            <span className="text-[#89DDFF]">:</span>{' '}
            <span className="text-[#C3E88D]">'hello@yourdomain.com'</span>
            <span className="text-[#89DDFF]">,</span>
            {'\n'}
            {'  '}
            <span className="text-text-secondary">subject</span>
            <span className="text-[#89DDFF]">:</span>{' '}
            <span className="text-[#C3E88D]">'Hello World'</span>
            <span className="text-[#89DDFF]">,</span>
            {'\n'}
            <span className="text-[#89DDFF]">{'}'}</span>
            <span className="text-[#89DDFF]">);</span>
            {'\n\n'}
            <span className="text-text-secondary">console</span>
            <span className="text-[#89DDFF]">.</span>
            <span className="text-[#82AAFF]">log</span>
            <span className="text-[#89DDFF]">(</span>
            <span className="text-text-secondary">result</span>
            <span className="text-[#89DDFF]">.</span>
            <span className="text-text-secondary">id</span>
            <span className="text-[#89DDFF]">);</span>
          </code>
        </pre>
      </div>

      {/* Help card */}
      <div className="rounded-lg bg-charcoal-800 border border-charcoal-700 p-4">
        <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
          Need Help?
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          Our developer relations team is available for technical onboarding calls.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-full border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Book a session
        </Button>
      </div>
    </div>
  );
}

// Best practice info card
export function BestPracticeCard() {
  return (
    <div className="rounded-lg bg-brand-blue/5 border border-brand-blue/20 p-4 flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-blue/10">
        <svg
          className="h-4 w-4 text-brand-blue"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div>
        <h3 className="text-sm font-medium text-text-primary mb-1">
          Best Practice: Key Rotation
        </h3>
        <p className="text-sm text-text-muted">
          Rotate your production API keys every 90 days to maintain high security
          standards for your servers.
        </p>
      </div>
    </div>
  );
}
