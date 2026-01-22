'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  showCopy?: boolean;
  className?: string;
}

export function CodeBlock({ code, language = 'bash', showCopy = true, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('relative rounded-lg bg-charcoal-900 border border-charcoal-700 overflow-hidden', className)}>
      {/* Header with language and copy button */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-charcoal-700 bg-charcoal-800/50">
        <span className="text-xs font-medium text-text-dimmed uppercase">{language}</span>
        {showCopy && (
          <button
            onClick={copyToClipboard}
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
        )}
      </div>

      {/* Code content */}
      <pre className="p-4 text-sm font-mono text-text-secondary overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}
