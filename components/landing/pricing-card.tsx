'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingTier {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: PricingFeature[];
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
  badge?: string;
}

interface PricingCardProps {
  tier: PricingTier;
  billingPeriod: 'monthly' | 'yearly';
}

export function PricingCard({ tier, billingPeriod }: PricingCardProps) {
  const price = billingPeriod === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice;
  const isHighlighted = tier.highlighted;

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl border p-6 lg:p-8',
        isHighlighted
          ? 'border-brand-blue bg-charcoal-800 shadow-lg shadow-brand-blue/10'
          : 'border-charcoal-700 bg-charcoal-800/50'
      )}
    >
      {/* Popular badge */}
      {tier.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-brand-blue px-3 py-1 text-xs font-semibold text-white">
            {tier.badge}
          </span>
        </div>
      )}

      {/* Tier name */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          {tier.name}
        </h3>
      </div>

      {/* Price */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-text-primary">
            ${price}
          </span>
          <span className="text-text-muted">/mo</span>
        </div>
        {billingPeriod === 'yearly' && tier.monthlyPrice > 0 && (
          <p className="mt-1 text-sm text-success">
            Save ${(tier.monthlyPrice - tier.yearlyPrice) * 12}/year
          </p>
        )}
      </div>

      {/* Description */}
      <p className="mb-6 text-sm text-text-muted leading-relaxed">
        {tier.description}
      </p>

      {/* CTA Button */}
      <Button
        asChild
        className={cn(
          'w-full mb-6',
          isHighlighted
            ? 'bg-brand-blue hover:bg-brand-blue-hover text-white'
            : 'bg-charcoal-700 hover:bg-charcoal-600 text-text-primary'
        )}
      >
        <Link href={tier.ctaHref}>{tier.cta}</Link>
      </Button>

      {/* Features */}
      <ul className="space-y-3 flex-1">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check
              className={cn(
                'h-5 w-5 shrink-0 mt-0.5',
                feature.included ? 'text-success' : 'text-charcoal-600'
              )}
            />
            <span
              className={cn(
                'text-sm',
                feature.included ? 'text-text-secondary' : 'text-text-dimmed line-through'
              )}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Billing toggle component
interface BillingToggleProps {
  value: 'monthly' | 'yearly';
  onChange: (value: 'monthly' | 'yearly') => void;
}

export function BillingToggle({ value, onChange }: BillingToggleProps) {
  return (
    <div className="inline-flex items-center rounded-full bg-charcoal-800 border border-charcoal-700 p-1">
      <button
        onClick={() => onChange('monthly')}
        className={cn(
          'px-4 py-2 text-sm font-medium rounded-full transition-colors',
          value === 'monthly'
            ? 'bg-charcoal-700 text-text-primary'
            : 'text-text-muted hover:text-text-secondary'
        )}
      >
        Monthly
      </button>
      <button
        onClick={() => onChange('yearly')}
        className={cn(
          'px-4 py-2 text-sm font-medium rounded-full transition-colors flex items-center gap-2',
          value === 'yearly'
            ? 'bg-charcoal-700 text-text-primary'
            : 'text-text-muted hover:text-text-secondary'
        )}
      >
        Yearly
        <span className="text-xs text-success font-semibold">(Save 20%)</span>
      </button>
    </div>
  );
}
