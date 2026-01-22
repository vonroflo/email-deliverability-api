import {
  Activity,
  Shield,
  Globe,
  Zap,
  BarChart3,
  Lock,
  Mail,
  CheckCircle,
} from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'Real-time Analysis',
    description:
      'Get instant email deliverability checks across 60+ providers. Detect issues before your emails reach spam folders.',
    highlights: ['SPF, DKIM, DMARC validation', 'Blacklist monitoring', 'Content analysis'],
  },
  {
    icon: Shield,
    title: 'Security Hardening',
    description:
      'Comprehensive security checks for your sending infrastructure. Identify vulnerabilities and strengthen your email security posture.',
    highlights: ['DNS configuration audit', 'IP reputation checks', 'TLS verification'],
  },
  {
    icon: Globe,
    title: 'Global Inbox Placement',
    description:
      'Test delivery to major inbox providers worldwide. Get detailed placement reports for Gmail, Outlook, Yahoo, and 50+ more.',
    highlights: ['Gmail & Outlook testing', 'Regional coverage', 'Seed list accuracy'],
  },
];

const stats = [
  { value: '99.9%', label: 'API Uptime' },
  { value: '<100ms', label: 'Avg Response' },
  { value: '60+', label: 'Providers Tested' },
  { value: '10K+', label: 'Active Developers' },
];

export function Features() {
  return (
    <section className="bg-charcoal-950 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Built for modern engineering teams
          </h2>
          <p className="text-lg text-text-muted">
            Integrate effortlessly with our developer-first tools. We handle the complexity of SPF,
            DKIM, and DMARC verification so you don't have to.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-xl bg-charcoal-800 border border-charcoal-700 p-6 hover:border-brand-blue/50 transition-colors"
            >
              {/* Icon */}
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue group-hover:bg-brand-blue/20 transition-colors">
                <feature.icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-text-muted mb-4 leading-relaxed">
                {feature.description}
              </p>

              {/* Highlights */}
              <ul className="space-y-2">
                {feature.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-center gap-2 text-sm text-text-secondary"
                  >
                    <CheckCircle className="h-4 w-4 text-success shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-20 rounded-xl bg-charcoal-800 border border-charcoal-700 p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-brand-blue mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Additional section: How it works
export function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Get your API key',
      description: 'Sign up and get your API key in seconds. No credit card required to start.',
      icon: Lock,
    },
    {
      step: '02',
      title: 'Send a test request',
      description: 'Make a simple API call with your email content. We handle the rest.',
      icon: Mail,
    },
    {
      step: '03',
      title: 'Review results',
      description: 'Get detailed deliverability reports with actionable insights.',
      icon: BarChart3,
    },
  ];

  return (
    <section className="bg-charcoal-900 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Get started in minutes
          </h2>
          <p className="text-lg text-text-muted">
            Three simple steps to start testing your email deliverability.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-gradient-to-r from-charcoal-600 to-charcoal-700" />
              )}

              <div className="text-center">
                {/* Step number */}
                <div className="relative inline-flex mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-charcoal-800 border border-charcoal-700">
                    <item.icon className="h-7 w-7 text-brand-blue" />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue text-xs font-bold text-white">
                    {item.step.replace('0', '')}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-text-muted">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
