'use client';

import { cn } from '@/lib/utils';

interface SpamScoreMeterProps {
  score: number;
  maxScore?: number;
}

export function SpamScoreMeter({ score, maxScore = 10 }: SpamScoreMeterProps) {
  const percentage = Math.min((score / maxScore) * 100, 100);

  const getStatus = () => {
    if (score <= 2) return { label: 'Excellent', color: 'bg-success', text: 'text-success' };
    if (score <= 4) return { label: 'Good', color: 'bg-success', text: 'text-success' };
    if (score <= 6) return { label: 'Fair', color: 'bg-warning', text: 'text-warning' };
    if (score <= 8) return { label: 'Poor', color: 'bg-error', text: 'text-error' };
    return { label: 'Critical', color: 'bg-error', text: 'text-error' };
  };

  const status = getStatus();

  return (
    <div className="p-4 rounded-lg bg-charcoal-800 border border-charcoal-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-text-primary">{score.toFixed(1)}</span>
          <span className="text-sm text-text-muted">/ {maxScore}</span>
        </div>
        <span className={cn('px-2 py-1 rounded text-xs font-medium', status.text, 'bg-current/10')}>
          {status.label}
        </span>
      </div>

      <div className="h-3 bg-charcoal-700 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', status.color)}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between mt-2 text-xs text-text-dimmed">
        <span>0 (Best)</span>
        <span>5 (Threshold)</span>
        <span>10 (Worst)</span>
      </div>

      <p className="mt-3 text-xs text-text-muted">
        {score <= 2 && 'Excellent spam score. Your email should reach inboxes reliably.'}
        {score > 2 && score <= 4 && 'Good spam score. Most providers will accept your email.'}
        {score > 4 && score <= 6 && 'Fair spam score. Some filters may flag your email.'}
        {score > 6 && score <= 8 && 'Poor spam score. Your email is likely to be marked as spam.'}
        {score > 8 && 'Critical spam score. Urgent improvements needed.'}
      </p>
    </div>
  );
}
