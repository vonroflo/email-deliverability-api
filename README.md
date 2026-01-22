# Email Deliverability API

An API-first SaaS platform for testing email deliverability. Programmatically verify inbox placement, spam scores, and DNS authentication with a single API call.

**Built for developers who need automated email testing in CI/CD pipelines.**

## Features

- **REST API** - Test email deliverability programmatically
- **Inbox Placement Testing** - Check if emails land in inbox vs spam across Gmail, Outlook, Yahoo, and Apple Mail
- **Spam Score Analysis** - Get detailed spam scoring with recommendations
- **DNS Validation** - Validate SPF, DKIM, and DMARC records
- **API Key Management** - Secure API key generation and management
- **Usage Tracking** - Monitor API usage and billing
- **Interactive Dashboard** - Web interface for testing and monitoring
- **Documentation** - Comprehensive API documentation with code examples

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 15+ (App Router)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Payments**: [Stripe](https://stripe.com/) for subscription billing
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)
- **Authentication**: Custom JWT-based session management
- **Email Testing**: IMAP integration for inbox placement detection

## Getting Started

### Prerequisites

- Node.js 18+ (see `.nvmrc` for recommended version)
- PostgreSQL database
- Stripe account (for payments)
- pnpm package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/vonroflo/email-deliverability-api.git
cd email-deliverability-api

# Install dependencies
pnpm install
```

### Environment Setup

Copy `.env.example` to `.env` and fill in your configuration:

```bash
cp .env.example .env
```

Required environment variables:

- `POSTGRES_URL` - PostgreSQL connection string
- `AUTH_SECRET` - Secret key for JWT signing (generate with `openssl rand -base64 32`)
- `BASE_URL` - Your application URL (e.g., `http://localhost:3000`)
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret (for production)

### Database Setup

Run migrations and seed the database:

```bash
# Run database migrations
pnpm db:migrate

# Seed database with default data
pnpm db:seed
```

This creates a default user:
- Email: `test@test.com`
- Password: `admin123`

### Development

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Usage

### Authentication

All API requests require an API key in the Authorization header:

```bash
curl -H "Authorization: Bearer sk_live_xxxxx" \
  https://api.yourdomain.com/v1/tests
```

### Create a Test

```bash
curl -X POST https://api.yourdomain.com/v1/tests \
  -H "Authorization: Bearer sk_live_xxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "noreply@example.com",
    "subject": "Test Email",
    "html": "<p>Email content</p>",
    "text": "Email content"
  }'
```

### Get Test Results

```bash
curl https://api.yourdomain.com/v1/tests/{test_id} \
  -H "Authorization: Bearer sk_live_xxxxx"
```

### Validate DNS Records

```bash
curl -X POST https://api.yourdomain.com/v1/domains/example.com/validate \
  -H "Authorization: Bearer sk_live_xxxxx"
```

## Project Structure

```
├── app/
│   ├── (dashboard)/     # Dashboard pages (protected routes)
│   ├── (login)/         # Authentication pages
│   ├── (marketing)/     # Marketing pages and docs
│   └── api/            # API routes
├── components/
│   ├── dashboard/      # Dashboard components
│   ├── landing/        # Landing page components
│   ├── docs/           # Documentation components
│   └── ui/             # Reusable UI components
├── lib/
│   ├── api/            # API middleware and schemas
│   ├── auth/           # Authentication logic
│   ├── db/             # Database configuration and queries
│   ├── email/          # Email testing logic
│   └── payments/       # Stripe integration
└── middleware.ts        # Next.js middleware
```

## Development Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
pnpm db:setup         # Setup database (migrate + seed)

# Type checking
pnpm type-check       # Run TypeScript type checking
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com/)
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform:

- `POSTGRES_URL` - Production database URL
- `AUTH_SECRET` - Production auth secret
- `BASE_URL` - Your production domain
- `STRIPE_SECRET_KEY` - Production Stripe key
- `STRIPE_WEBHOOK_SECRET` - Production webhook secret

## Documentation

- [API Documentation](/docs) - Full API reference
- [Quick Start Guide](/docs/quickstart) - Get started in 5 minutes
- [Authentication](/docs/authentication) - API key setup
- [Rate Limits](/docs/rate-limits) - Usage limits and pricing

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or contributions, please open an issue on GitHub.
