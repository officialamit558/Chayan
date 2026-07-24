# Chayan
**select right. serve right.**

A production-ready government jobs portal built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, Prisma, PostgreSQL, and NextAuth v5. Designed for high traffic, Google SEO, and AdSense monetization.

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/<your-username>/chayan.git
cd chayan

# 2. Install
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your database URL and secrets

# 4. Database
npx prisma generate
npx prisma db push
npx prisma db seed

# 5. Run
npm run dev
# Open http://localhost:3000
```

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 15 (App Router) | Framework — SSR, ISR, SSG, API routes |
| React 19 | UI library |
| TypeScript | Type safety |
| Tailwind CSS v4 | Utility-first CSS |
| shadcn/ui | Accessible component library |
| Framer Motion | Animations |
| TanStack React Query | Server state management |
| React Hook Form + Zod | Form validation |
| next-themes | Dark/light mode |

### Backend & Database
| Technology | Purpose |
|------------|---------|
| Next.js API Routes | Serverless backend |
| Prisma ORM | Database access & migrations |
| PostgreSQL | Primary database |
| Redis | Caching (optional) |

### Authentication
| Provider | Strategy |
|----------|----------|
| Email/Password | Credentials + JWT |
| Google OAuth | OAuth 2.0 |
| NextAuth v5 (Auth.js) | Auth framework |

### Infrastructure
| Tool | Purpose |
|------|---------|
| Vercel | Hosting (free tier) |
| Neon / Supabase | PostgreSQL (free tier) |
| Cloudinary | Image hosting (free tier) |
| Resend | Email (free tier) |
| GitHub | Version control |
| GitHub Actions | CI/CD |

---

## Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop
docker-compose down
```

The docker-compose starts:
- **Next.js app** on port 3000
- **PostgreSQL** on port 5432
- **Redis** on port 6379

---

## Vercel Deployment

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import GitHub repository
3. Set environment variables (from `.env.example`)
4. Set build command: `npx prisma generate && next build`
5. Deploy

Database: Use [Neon](https://neon.tech) (free PostgreSQL) or [Supabase](https://supabase.com).

fix(auth): redirect loop on admin layout
seo(meta): add JSON-LD schema for jobs
perf(images): add lazy loading to home page
```

---

## License

MIT
