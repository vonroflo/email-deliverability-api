'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

// Simple syntax highlighting for JSON, JavaScript, and shell commands
function highlightCode(code: string, language: string): string {
  let highlighted = code
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  if (language === 'json') {
    highlighted = highlighted
      // Strings (property values)
      .replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, '<span class="token-string">"$1"</span>')
      // Property names
      .replace(/("token-string">")(\w+)(":)/g, '<span class="token-property">"$2"</span>:')
      // Numbers
      .replace(/:\s*(\d+)/g, ': <span class="token-number">$1</span>')
      // Booleans and null
      .replace(/:\s*(true|false|null)/g, ': <span class="token-keyword">$1</span>')
      // Punctuation
      .replace(/([{}\[\],])/g, '<span class="token-punctuation">$1</span>');
  } else if (language === 'javascript' || language === 'js') {
    highlighted = highlighted
      // Keywords
      .replace(/\b(const|let|var|function|return|await|async|if|else|for|while|import|export|from|default)\b/g, '<span class="token-keyword">$1</span>')
      // Strings
      .replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, '<span class="token-string">\'$1\'</span>')
      .replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, '<span class="token-string">"$1"</span>')
      .replace(/`([^`\\]*(\\.[^`\\]*)*)`/g, '<span class="token-string">`$1`</span>')
      // Comments
      .replace(/(\/\/.*$)/gm, '<span class="token-comment">$1</span>')
      // Numbers
      .replace(/\b(\d+)\b/g, '<span class="token-number">$1</span>')
      // Function calls
      .replace(/(\w+)(\()/g, '<span class="token-function">$1</span>$2');
  } else if (language === 'bash' || language === 'shell' || language === 'curl') {
    highlighted = highlighted
      // Commands
      .replace(/^(curl|wget|npm|pnpm|yarn|node|python|pip)/gm, '<span class="token-keyword">$1</span>')
      // Flags
      .replace(/(\s)(-{1,2}[\w-]+)/g, '$1<span class="token-property">$2</span>')
      // Strings
      .replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, '<span class="token-string">\'$1\'</span>')
      .replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, '<span class="token-string">"$1"</span>')
      // URLs
      .replace(/(https?:\/\/[^\s'"]+)/g, '<span class="token-string">$1</span>')
      // Variables
      .replace(/(\$\w+)/g, '<span class="token-variable">$1</span>');
  } else if (language === 'python') {
    highlighted = highlighted
      // Keywords
      .replace(/\b(import|from|def|return|if|else|elif|for|while|class|try|except|with|as|True|False|None)\b/g, '<span class="token-keyword">$1</span>')
      // Strings
      .replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, '<span class="token-string">\'$1\'</span>')
      .replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, '<span class="token-string">"$1"</span>')
      // Comments
      .replace(/(#.*$)/gm, '<span class="token-comment">$1</span>')
      // Numbers
      .replace(/\b(\d+)\b/g, '<span class="token-number">$1</span>')
      // Function calls
      .replace(/(\w+)(\()/g, '<span class="token-function">$1</span>$2');
  }

  return highlighted;
}

export function CodeBlock({
  code,
  language = 'json',
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedCode = highlightCode(code, language);
  const lines = highlightedCode.split('\n');

  return (
    <div
      className={cn(
        'relative rounded-lg bg-charcoal-800 border border-charcoal-700 overflow-hidden',
        className
      )}
    >
      {/* Header with language badge and copy button */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-charcoal-700 bg-charcoal-900/50">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
          {language}
        </span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
          aria-label="Copy code"
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

      {/* Code content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm font-mono leading-relaxed">
          <code>
            {lines.map((line, index) => (
              <div key={index} className="flex">
                {showLineNumbers && (
                  <span className="select-none pr-4 text-text-dimmed text-right w-8">
                    {index + 1}
                  </span>
                )}
                <span
                  className="flex-1 text-text-secondary"
                  dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }}
                />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

// Language tabs component for showing code in multiple languages
interface LanguageTab {
  label: string;
  language: string;
  code: string;
}

interface CodeBlockWithTabsProps {
  tabs: LanguageTab[];
  className?: string;
}

export function CodeBlockWithTabs({ tabs, className }: CodeBlockWithTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div
      className={cn(
        'rounded-lg bg-charcoal-800 border border-charcoal-700 overflow-hidden',
        className
      )}
    >
      {/* Language tabs */}
      <div className="flex items-center gap-1 px-2 pt-2 border-b border-charcoal-700 bg-charcoal-900/50">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(index)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-t transition-colors',
              activeTab === index
                ? 'bg-charcoal-800 text-text-primary border-t border-x border-charcoal-700'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active code block */}
      <CodeBlockInner
        code={tabs[activeTab].code}
        language={tabs[activeTab].language}
      />
    </div>
  );
}

// Inner code block without the outer wrapper (for use in tabs)
function CodeBlockInner({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedCode = highlightCode(code, language);
  const lines = highlightedCode.split('\n');

  return (
    <div className="relative">
      {/* Copy button */}
      <button
        onClick={copyToClipboard}
        className="absolute top-3 right-3 flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
        aria-label="Copy code"
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

      {/* Code content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm font-mono leading-relaxed">
          <code>
            {lines.map((line, index) => (
              <div
                key={index}
                className="text-text-secondary"
                dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }}
              />
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
