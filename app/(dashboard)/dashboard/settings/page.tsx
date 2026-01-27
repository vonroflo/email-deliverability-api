'use client';

import Link from 'next/link';
import { User, Shield, Key, ChevronRight } from 'lucide-react';

const settingsSections = [
  {
    href: '/dashboard/general',
    icon: User,
    title: 'General',
    description: 'Update your account name and email address',
  },
  {
    href: '/dashboard/security',
    icon: Shield,
    title: 'Security',
    description: 'Manage your password and account security',
  },
  {
    href: '/dashboard/api-keys',
    icon: Key,
    title: 'API Keys',
    description: 'Create and manage your API keys',
  },
];

export default function SettingsPage() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-text-primary mb-6">
        Settings
      </h1>

      <div className="space-y-4">
        {settingsSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="flex items-center justify-between p-4 rounded-lg bg-charcoal-800 border border-charcoal-700 hover:bg-charcoal-700/50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-charcoal-700">
                <section.icon className="h-5 w-5 text-text-secondary" />
              </div>
              <div>
                <h2 className="font-medium text-text-primary">{section.title}</h2>
                <p className="text-sm text-text-muted">{section.description}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-text-muted group-hover:text-text-secondary transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  );
}
