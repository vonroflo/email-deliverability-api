import { Metadata } from 'next';
import { PricingSection, TechStackSection, PricingFAQ } from '@/components/landing';

export const metadata: Metadata = {
  title: 'Pricing - DeliverabilityAPI',
  description:
    'Simple, developer-first pricing. Start testing your emails in seconds. Choose the plan that scales with your production needs.',
};

export default function PricingPage() {
  return (
    <main className="pt-16">
      <PricingSection />
      <TechStackSection />
      <PricingFAQ />
    </main>
  );
}
