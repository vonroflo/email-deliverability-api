'use client';

import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  type?: 'default' | 'gauge' | 'percentage';
  gaugeValue?: number;
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

function GaugeCircle({ value, color }: { value: number; color: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 10) * circumference;

  const colorClasses: Record<string, string> = {
    blue: 'stroke-brand-blue',
    green: 'stroke-success',
    yellow: 'stroke-warning',
    red: 'stroke-error',
  };

  return (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
        {/* Background circle */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-charcoal-700"
        />
        {/* Progress circle */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className={colorClasses[color] || colorClasses.blue}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-text-primary">{value.toFixed(1)}</span>
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  subValue,
  type = 'default',
  gaugeValue,
  color = 'blue',
}: StatCardProps) {
  return (
    <div className="rounded-lg bg-charcoal-800 border border-charcoal-700 p-5">
      <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">
        {label}
      </p>

      {type === 'gauge' && gaugeValue !== undefined ? (
        <div className="flex items-center gap-4">
          <GaugeCircle value={gaugeValue} color={color} />
          <div>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
            {subValue && (
              <p className="text-xs text-text-muted">{subValue}</p>
            )}
          </div>
        </div>
      ) : type === 'percentage' ? (
        <div>
          <p className="text-3xl font-bold text-text-primary">{value}</p>
          {subValue && (
            <p className="text-xs text-text-muted mt-1">{subValue}</p>
          )}
        </div>
      ) : (
        <div>
          <p className="text-3xl font-bold text-text-primary">{value}</p>
          {subValue && (
            <p className="text-xs text-text-muted mt-1">{subValue}</p>
          )}
        </div>
      )}
    </div>
  );
}

interface StatsGridProps {
  stats: {
    totalTests: number;
    avgSpamScore: number;
    inboxPlacementRate: number;
    authenticationRate: number;
  };
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Tests"
        value={stats.totalTests.toLocaleString()}
        subValue="All time"
      />
      <StatCard
        label="Avg Spam Score"
        value={stats.avgSpamScore.toFixed(1)}
        type="gauge"
        gaugeValue={stats.avgSpamScore}
        color={stats.avgSpamScore <= 3 ? 'green' : stats.avgSpamScore <= 6 ? 'yellow' : 'red'}
        subValue="Out of 10"
      />
      <StatCard
        label="Inbox Placement Rate"
        value={`${stats.inboxPlacementRate.toFixed(1)}%`}
        type="percentage"
        subValue="Last 30 days"
      />
      <StatCard
        label="Authentication"
        value={`${stats.authenticationRate.toFixed(0)}%`}
        type="percentage"
        subValue="SPF, DKIM, DMARC"
      />
    </div>
  );
}
