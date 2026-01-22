'use client';

import { useState } from 'react';
import { Eye, EyeOff, Copy, Check, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ApiKeyType = 'live' | 'test';

export interface ApiKey {
  id: string;
  key: string;
  type: ApiKeyType;
  createdAt: string;
  lastUsedAt?: string;
  permissions: string;
}

interface ApiKeyCardProps {
  apiKey: ApiKey;
  onRollKey?: (id: string) => void;
  onRevokeKey?: (id: string) => void;
}

function maskKey(key: string): string {
  if (key.length <= 12) return key;
  const prefix = key.slice(0, 8);
  const suffix = key.slice(-4);
  return `${prefix}${'•'.repeat(12)}${suffix}`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatRelativeTime(dateString?: string): string {
  if (!dateString) return 'Never';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return formatDate(dateString);
}

export function ApiKeyCard({ apiKey, onRollKey, onRevokeKey }: ApiKeyCardProps) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(apiKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLive = apiKey.type === 'live';

  return (
    <div className="rounded-lg bg-charcoal-800 border border-charcoal-700 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider',
              isLive
                ? 'bg-success/10 text-success'
                : 'bg-warning/10 text-warning'
            )}
          >
            {isLive ? 'Production' : 'Sandbox'}
          </span>
          <span className="text-xs text-text-dimmed">
            Created {formatDate(apiKey.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRollKey?.(apiKey.id)}
            className="text-text-muted hover:text-text-primary h-8 px-3"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Roll Key
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRevokeKey?.(apiKey.id)}
            className="text-error hover:text-error hover:bg-error/10 h-8 px-3"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Revoke
          </Button>
        </div>
      </div>

      {/* Key display */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-charcoal-900 border border-charcoal-700">
        <code className="flex-1 font-mono text-sm text-text-secondary">
          {showKey ? apiKey.key : maskKey(apiKey.key)}
        </code>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowKey(!showKey)}
            className="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-charcoal-700 transition-colors"
            aria-label={showKey ? 'Hide key' : 'Show key'}
          >
            {showKey ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={copyToClipboard}
            className="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-charcoal-700 transition-colors"
            aria-label="Copy key"
          >
            {copied ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-3 flex items-center gap-4 text-xs text-text-dimmed">
        <span>Last used: {formatRelativeTime(apiKey.lastUsedAt)}</span>
        <span>•</span>
        <span>Permissions: {apiKey.permissions}</span>
      </div>
    </div>
  );
}

// Status badge component for reuse
interface StatusBadgeProps {
  status: 'completed' | 'processing' | 'failed' | 'pending';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = {
    completed: 'bg-success/10 text-success',
    processing: 'bg-brand-blue/10 text-brand-blue',
    failed: 'bg-error/10 text-error',
    pending: 'bg-text-dimmed/10 text-text-dimmed',
  };

  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded text-xs font-medium capitalize',
        styles[status],
        className
      )}
    >
      {status}
    </span>
  );
}
