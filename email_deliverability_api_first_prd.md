# **Product Requirements Document**

**Email Deliverability Testing API**

*API-First SaaS Platform*

*Version 1.0 | January 2026*

# **Executive Summary**

This document outlines an API-first email deliverability testing platform built for developers. The product enables programmatic testing of email deliverability through a REST API, designed for CI/CD integration and automated monitoring. Built with Next.js, Supabase, and Stripe, the platform prioritizes developer experience, speed, and reliability over visual dashboards.

# **Product Vision**

## **Vision Statement**

Become the infrastructure layer for email deliverability testing \- as essential and invisible as Stripe is for payments.

## **Mission**

Enable developers to programmatically verify email deliverability with a single API call, preventing production email failures before they impact users.

## **Core Principle**

**API-First, Dashboard-Later.** Build for developers who write code, not marketers who click buttons. The web interface exists only to serve the API, not replace it.

# **Problem Statement**

Developers building email-dependent applications face critical challenges:

* No automated way to test if emails reach inboxes vs spam before deployment  
* Existing tools require manual web testing \- incompatible with CI/CD pipelines  
* DNS misconfigurations and authentication failures discovered only after user complaints  
* Monitoring sender reputation requires checking multiple services manually  
* Lost revenue from failed transactional emails (password resets, order confirmations)

# **Target Users**

## **Primary Persona: Backend Developer**

* Needs: Fast API, clear documentation, SDKs, CI/CD examples  
* Pain: Manual email testing slows down development velocity  
* Goal: Ship features faster with confidence that emails work  
* Quote: "I just want a curl command that tells me if my email will land in spam"

## **Secondary Persona: DevOps/SRE Engineer**

* Needs: Monitoring endpoints, webhooks, alerting integration  
* Pain: Email issues discovered too late, no proactive monitoring  
* Goal: Get alerted before users report email problems

## **Tertiary Persona: Email Marketing Manager**

* Needs: Simple dashboard to check campaign deliverability  
* Note: Phase 2 \- not MVP target

# **Technology Stack**

## **Core Infrastructure**

* **Next.js 14+ (App Router)** \- API routes, minimal web UI, documentation pages  
* **Supabase** \- PostgreSQL database, authentication, real-time subscriptions  
* **Stripe** \- Subscription billing, usage-based pricing, payment processing  
* **Vercel** \- Hosting, serverless functions, edge runtime

## **Email Testing Infrastructure**

* **Seed Inboxes** \- Gmail, Outlook, Yahoo, Apple Mail via IMAP/API  
* **SpamAssassin** \- Self-hosted or API service for spam scoring  
* **DNS Services** \- Cloudflare API for SPF/DKIM/DMARC validation  
* **Queue System** \- Upstash Redis or Inngest for async job processing

## **Supporting Services**

* Resend or Postmark \- Email sending for notifications  
* Upstash Redis \- Caching, rate limiting  
* Google Postmaster Tools API \- Reputation data  
* Sentry \- Error tracking and monitoring

# **API Specification**

## **Core Endpoints \- MVP**

### **POST /v1/tests**

Create a new deliverability test by sending an email to seed inboxes.

**Request:**

{  "from": "noreply@example.com",  "subject": "Test Email",  "html": "\<p\>Email content\</p\>",  "text": "Email content",  "webhook\_url": "https://yourapp.com/webhook" (optional)}

**Response:**

{  "test\_id": "test\_abc123",  "status": "processing",  "created\_at": "2026-01-21T15:00:00Z",  "estimated\_completion": "2026-01-21T15:05:00Z"}

### **GET /v1/tests/{test\_id}**

Retrieve test results including inbox placement and spam scores.

**Response:**

{  "test\_id": "test\_abc123",  "status": "completed",  "inbox\_placement": {    "gmail": "inbox",    "outlook": "inbox",    "yahoo": "spam",    "apple\_mail": "inbox"  },  "spam\_score": 2.8,  "authentication": {    "spf": "pass",    "dkim": "pass",    "dmarc": "pass"  },  "recommendations": \[    "Consider warming up your IP for Yahoo",    "Reduce image-to-text ratio"  \],  "completed\_at": "2026-01-21T15:04:32Z"}

### **GET /v1/domains/{domain}/reputation**

Check domain reputation across blacklists and reputation services.

**Response:**

{  "domain": "example.com",  "blacklists": {    "spamhaus": "clean",    "surbl": "clean",    "barracuda": "listed"  },  "reputation\_score": 87,  "postmaster\_data": {    "spam\_rate": 0.02,    "domain\_reputation": "high"  },  "checked\_at": "2026-01-21T15:00:00Z"}

### **POST /v1/domains/{domain}/validate**

Validate SPF, DKIM, and DMARC DNS records.

**Response:**

{  "domain": "example.com",  "spf": {    "valid": true,    "record": "v=spf1 include:\_spf.google.com \~all"  },  "dkim": {    "valid": true,    "selector": "default"  },  "dmarc": {    "valid": true,    "policy": "quarantine",    "record": "v=DMARC1; p=quarantine; rua=..."  },  "issues": \[\]}

## **Authentication**

* API Key authentication via Authorization header  
* Format: Authorization: Bearer sk\_live\_xxxxx  
* Test mode keys: sk\_test\_xxxxx (don't send actual emails)

# **MVP Features (Weeks 1-6)**

## **Phase 1: Core API (Weeks 1-3)**

* API endpoint: Create test (POST /v1/tests)  
* API endpoint: Get results (GET /v1/tests/{id})  
* Seed inbox setup: Gmail, Outlook, Yahoo accounts  
* Email sending to seed inboxes  
* Inbox placement detection via IMAP  
* SpamAssassin integration for spam scoring  
* SPF/DKIM/DMARC validation endpoint  
* Supabase database schema and API key management

## **Phase 2: Billing & Auth (Week 4\)**

* Supabase Auth integration  
* Stripe subscription setup (3 tiers)  
* API key generation and management  
* Usage tracking and rate limiting  
* Stripe webhook handling for subscription events

## **Phase 3: Minimal Dashboard (Weeks 5-6)**

* Landing page with API docs  
* Sign up / login flow  
* Dashboard: API key management  
* Dashboard: Test history (read-only list)  
* Dashboard: Usage metrics and billing  
* Interactive API documentation (like Stripe Docs)  
* Pricing page with Stripe Checkout integration

## **Post-MVP (Weeks 7+)**

* Webhook support for async notifications  
* Domain reputation monitoring endpoint  
* Historical trending and analytics  
* SDKs: Node.js, Python, Go  
* GitHub Actions integration template

# **Database Schema (Supabase)**

## **Tables**

### **users**

id (uuid, PK)email (text)stripe\_customer\_id (text)stripe\_subscription\_id (text)plan (enum: free, starter, pro, enterprise)api\_key (text, encrypted)api\_key\_test (text, encrypted)created\_at (timestamp)updated\_at (timestamp)

### **tests**

id (uuid, PK)user\_id (uuid, FK)status (enum: processing, completed, failed)from\_address (text)subject (text)html\_content (text)text\_content (text)inbox\_placement (jsonb)spam\_score (decimal)authentication\_results (jsonb)recommendations (text\[\])webhook\_url (text, nullable)created\_at (timestamp)completed\_at (timestamp)

### **usage\_logs**

id (uuid, PK)user\_id (uuid, FK)test\_id (uuid, FK)endpoint (text)timestamp (timestamp)response\_time\_ms (integer)

### **domain\_reputations**

id (uuid, PK)domain (text)blacklist\_status (jsonb)reputation\_score (integer)postmaster\_data (jsonb)checked\_at (timestamp)

# **Pricing Strategy**

| Tier | Price | Tests/Month | Features |
| :---- | :---- | :---- | :---- |
| Free | $0 | 25 | Basic API, 7-day history, test mode |
| Starter | $39/mo | 500 | Full API, webhooks, 30-day history |
| Pro | $99/mo | 2,500 | Priority support, 90-day history, team features |
| Enterprise | Custom | Custom | SLA, dedicated support, on-prem option |

**Overage Pricing:** $0.10 per additional test beyond monthly limit. Automatically billed via Stripe.

# **Developer Experience**

## **Quick Start Example**

\# Install SDKnpm install @yourapi/deliverability\# Test in 3 linesimport { DeliverabilityClient } from '@yourapi/deliverability';const client \= new DeliverabilityClient('sk\_live\_xxx');const result \= await client.test({  from: 'noreply@myapp.com',  subject: 'Welcome Email',  html: emailTemplate});console.log(result.inboxPlacement);// { gmail: 'inbox', outlook: 'inbox', yahoo: 'spam' }

## **CI/CD Integration (GitHub Actions)**

name: Test Email Deliverabilityon: \[pull\_request\]jobs:  test:    runs-on: ubuntu-latest    steps:      \- uses: actions/checkout@v3      \- uses: yourapi/deliverability-action@v1        with:          api-key: ${{ secrets.DELIVERABILITY\_API\_KEY }}          template: ./emails/welcome.html          fail-on-spam: true

## **Documentation Strategy**

* Interactive API docs (like Stripe) with live testing  
* Code examples in 5 languages: Node.js, Python, Go, Ruby, PHP  
* Postman collection for API exploration  
* GitHub repo with integration templates  
* Video tutorials: 5-minute quickstart, CI/CD setup

# **Go-to-Market Strategy**

## **Launch Channels**

* **Product Hunt** \- "Email deliverability testing API for developers"  
* **Hacker News** \- Show Build: Share technical implementation details  
* **Dev.to** \- Tutorial: "Add email deliverability testing to your CI/CD pipeline"  
* **GitHub** \- Open-source GitHub Action for deliverability testing  
* **Twitter/X** \- Build in public thread with daily updates

## **Content Strategy**

* Technical blog posts: SPF/DKIM/DMARC explained, inbox placement algorithms  
* Integration guides: Next.js, Rails, Django, Laravel  
* Case studies: How X company prevented email failures  
* SEO-focused content: "email deliverability testing", "test spam score API"

## **Positioning**

**Primary:** "The Stripe of email deliverability \- one API call to test inbox placement"

**Secondary:** "Prevent production email failures before they happen"

**Against competitors:** "Fast API for developers vs slow dashboards for marketers"

# **Development Roadmap**

| Week | Focus | Deliverables |
| :---- | :---- | :---- |
| Week 1 | Foundation | Next.js setup, Supabase config, database schema, seed inbox creation |
| Week 2 | Core API | POST /v1/tests endpoint, email sending logic, IMAP inbox checking |
| Week 3 | Testing Logic | GET /v1/tests/{id}, SpamAssassin integration, SPF/DKIM/DMARC validation |
| Week 4 | Auth & Billing | Supabase Auth, Stripe integration, API key generation, rate limiting |
| Week 5 | Frontend | Landing page, pricing page, sign up flow, basic dashboard |
| Week 6 | Polish & Launch | API docs, testing, monitoring, Product Hunt launch prep |

# **Success Metrics**

## **Week 1 (Private Beta)**

* 10 developer users testing API  
* 100+ tests completed successfully

## **Month 1**

* 100 sign-ups (free \+ paid)  
* 5 paid customers ($195-495 MRR)  
* 1,000+ API calls per day

## **Month 3**

* 500 total users  
* 25 paid customers ($975-2,475 MRR)  
* 5,000+ API calls per day

## **Month 6**

* 2,000 total users  
* 100 paid customers ($3,900-9,900 MRR)  
* 20,000+ API calls per day  
* 10% free-to-paid conversion rate

## **Technical KPIs**

* API uptime: \>99.9%  
* P95 response time: \<200ms  
* Test completion rate: \>98%  
* Inbox placement accuracy: \>95%

# **Risks & Mitigation**

| Risk | Impact | Mitigation |
| :---- | :---- | :---- |
| Seed inboxes get blocked | Service failure, customer churn | Rotate inboxes regularly, use residential IPs, warm sender reputation, multiple backup accounts |
| API-first limits market size | Slower growth, missing non-technical users | Add dashboard in Phase 2, but validate API-first hypothesis first. Developer market is large enough. |
| Inaccurate test results | Reputation damage, loss of trust | Extensive beta testing, compare results against known baselines, transparent methodology docs |
| Competitors copy API approach | Market commoditization | Win on developer experience and speed. Move fast, excellent docs, responsive support. |

# **Conclusion**

This API-first approach to email deliverability testing addresses a clear market need: developers want programmatic access to deliverability testing, not dashboards. By focusing exclusively on the API and developer experience, we can ship faster, differentiate clearly, and build a sticky product that lives in customers' codebases.

The technology stack (Next.js, Supabase, Stripe) enables rapid development with minimal infrastructure overhead. A 6-week timeline to MVP is achievable for a solo developer or small team, with clear milestones and incremental validation.

The freemium pricing model enables viral growth through the developer community while the subscription tiers provide predictable revenue from teams that depend on the service for CI/CD pipelines. Success depends on nailing the developer experience: fast API, great docs, and zero friction.

This is a product developers will love because it solves a real pain point with an elegant, simple solution. The API-first approach is the competitive moat \- we're building infrastructure, not a dashboard.