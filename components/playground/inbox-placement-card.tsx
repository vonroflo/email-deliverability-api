'use client';

import { cn } from '@/lib/utils';
import { Inbox, AlertTriangle, XCircle, Loader2 } from 'lucide-react';

interface InboxPlacementCardProps {
  provider: string;
  status: 'inbox' | 'spam' | 'not_delivered' | 'pending';
}

const providerConfig: Record<string, { icon: string; name: string }> = {
  gmail: { icon: '📧', name: 'Gmail' },
  outlook: { icon: '📬', name: 'Outlook' },
  yahoo: { icon: '📮', name: 'Yahoo' },
  apple_mail: { icon: '🍎', name: 'Apple Mail' },
};

export function InboxPlacementCard({ provider, status }: InboxPlacementCardProps) {
  const config = providerConfig[provider.toLowerCase()] || { icon: '📧', name: provider };

  const statusStyles = {
    inbox: {
      label: 'Inbox',
      icon: Inbox,
      bg: 'bg-success/10',
      border: 'border-success/30',
      text: 'text-success',
    },
    spam: {
      label: 'Spam',
      icon: AlertTriangle,
      bg: 'bg-error/10',
      border: 'border-error/30',
      text: 'text-error',
    },
    not_delivered: {
      label: 'Not Delivered',
      icon: XCircle,
      bg: 'bg-charcoal-800',
      border: 'border-charcoal-700',
      text: 'text-text-muted',
    },
    pending: {
      label: 'Checking...',
      icon: Loader2,
      bg: 'bg-charcoal-800',
      border: 'border-charcoal-700',
      text: 'text-text-muted',
    },
  };

  const style = statusStyles[status];
  const StatusIcon = style.icon;

  return (
    <div className={cn('p-4 rounded-lg border transition-all', style.bg, style.border)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{config.icon}</span>
          <span className="text-sm font-medium text-text-primary">{config.name}</span>
        </div>
        <StatusIcon className={cn('h-4 w-4', style.text, status === 'pending' && 'animate-spin')} />
      </div>
      <div className={cn('text-sm font-semibold', style.text)}>{style.label}</div>
    </div>
  );
}
