'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PricingCard, BillingToggle, type PricingTier } from './pricing-card';

const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    description: 'Perfect for personal side projects and small experiments.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    cta: 'Get Started',
    ctaHref: '/sign-up',
    features: [
      { text: '100 tests per month', included: true },
      { text: '1 team seat', included: true },
      { text: 'Basic API access', included: true },
      { text: '7-day data retention', included: true },
      { text: 'Community support', included: true },
    ],
  },
  {
    name: 'Starter',
    description: 'Scaling teams who need reliable email assurance daily.',
    monthlyPrice: 29,
    yearlyPrice: 23,
    cta: 'Start 14-day Trial',
    ctaHref: '/sign-up?plan=starter',
    highlighted: true,
    badge: 'Most Popular',
    features: [
      { text: '5,000 tests per month', included: true },
      { text: '5 team seats', included: true },
      { text: 'Full API access', included: true },
      { text: '30-day data retention', included: true },
      { text: 'Priority email support', included: true },
    ],
  },
  {
    name: 'Pro',
    description: 'Enterprise-grade capabilities for high-volume production.',
    monthlyPrice: 99,
    yearlyPrice: 79,
    cta: 'Upgrade to Pro',
    ctaHref: '/sign-up?plan=pro',
    features: [
      { text: '50,000 tests per month', included: true },
      { text: 'Unlimited team seats', included: true },
      { text: 'Dedicated API ingress', included: true },
      { text: '90-day data retention', included: true },
      { text: 'SSO & SAML Auth', included: true },
      { text: '24/7 Dedicated Support', included: true },
    ],
  },
];

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section className="bg-charcoal-900 pt-24 lg:pt-32 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal-800 border border-charcoal-700 mb-6">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Choose a Plan
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            Simple, Developer-First Pricing
          </h1>
          <p className="text-lg text-text-muted">
            Start testing your emails in seconds. Choose the plan that scales with your
            production needs. No hidden fees.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-12">
          <BillingToggle value={billingPeriod} onChange={setBillingPeriod} />
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
          {pricingTiers.map((tier) => (
            <PricingCard
              key={tier.name}
              tier={tier}
              billingPeriod={billingPeriod}
            />
          ))}
        </div>

        {/* Compare link */}
        <div className="text-center mt-12">
          <p className="text-sm text-text-muted mb-2">
            Compare all features and technical limits →{' '}
            <Link href="/docs/pricing" className="text-brand-blue hover:underline">
              View full comparison
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

// Tech stack logos section
const techStacks = [
  { name: 'JavaScript', logo: 'JS' },
  { name: 'Python', logo: 'PY' },
  { name: 'Go', logo: 'GO' },
  { name: 'Ruby', logo: 'RB' },
  { name: 'PHP', logo: 'PHP' },
];

export function TechStackSection() {
  return (
    <section className="bg-charcoal-950 py-16 border-t border-charcoal-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-text-dimmed uppercase tracking-wider mb-8">
          Works with your favorite tech stack
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
          {techStacks.map((tech) => (
            <div
              key={tech.name}
              className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-charcoal-800 border border-charcoal-700 text-xs font-bold">
                {tech.logo}
              </div>
              <span className="text-sm font-medium">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// FAQ Section for pricing page
const faqs = [
  {
    question: 'What counts as a test?',
    answer:
      'A test is a single API call to check email deliverability. Each test analyzes your email against 60+ providers and returns detailed results.',
  },
  {
    question: 'Can I upgrade or downgrade anytime?',
    answer:
      'Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades apply at the end of your billing cycle.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'We offer a 14-day money-back guarantee on all paid plans. If you\'re not satisfied, contact support for a full refund.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'The Starter plan includes a 14-day free trial with full access to all features. No credit card required to start.',
  },
];

export function PricingFAQ() {
  return (
    <section className="bg-charcoal-900 py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-text-primary text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-lg bg-charcoal-800 border border-charcoal-700 p-6"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {faq.question}
              </h3>
              <p className="text-text-muted">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
