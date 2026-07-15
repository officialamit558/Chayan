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

## Project Structure

```
chayan/
├── .github/                 # GitHub templates & CI/CD
│   ├── ISSUE_TEMPLATE/
│   ├── workflows/
│   └── PULL_REQUEST_TEMPLATE.md
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed script
├── public/                  # Static assets
│   ├── robots.txt
│   ├── sitemap.xml
│   └── images/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/          # Login, Register, Forgot Password
│   │   ├── (public)/        # Public listing/detail pages
│   │   ├── (user)/          # Profile, Bookmarks
│   │   ├── admin/           # Admin panel (11 pages)
│   │   └── api/             # REST API routes (25+ endpoints)
│   ├── components/
│   │   ├── admin/           # Admin UI components
│   │   ├── home/            # Home page sections
│   │   ├── jobs/            # Job detail components
│   │   ├── layout/          # Header, Footer, Providers
│   │   └── ui/              # shadcn/ui primitives
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Core utilities
│   │   ├── auth.ts          # NextAuth configuration
│   │   ├── prisma.ts        # Prisma client
│   │   ├── utils.ts         # Helper functions
│   │   └── constants.ts     # Site-wide constants
│   └── styles/              # Global CSS
├── docker/                  # Docker configuration
├── docker-compose.yml       # Multi-container setup
├── Dockerfile               # Production container
├── middleware.ts            # Next.js middleware (auth)
└── package.json
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `AUTH_SECRET` | ✅ | NextAuth encryption key (generate with `openssl rand -hex 32`) |
| `AUTH_URL` | ✅ | App URL (local: http://localhost:3000) |
| `GOOGLE_CLIENT_ID` | for Google Auth | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | for Google Auth | Google OAuth client secret |
| `RESEND_API_KEY` | for Email | Resend API key (password reset, notifications) |
| `REDIS_URL` | optional | Redis connection for caching |
| `CLOUDINARY_CLOUD_NAME` | optional | Cloudinary image hosting |
| `CLOUDINARY_API_KEY` | optional | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | optional | Cloudinary API secret |
| `NEXT_PUBLIC_APP_URL` | ✅ | Public URL of the deployed site |
| `NEXT_PUBLIC_APP_NAME` | ✅ | Site name (displayed in UI) |

Copy `.env.example` to `.env` and fill in the values. Never commit the real `.env` file.

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List jobs (paginated, filterable by category/qualification/state) |
| GET | `/api/jobs/[id]` | Single job details |
| GET | `/api/results` | List results |
| GET | `/api/admit-cards` | List admit cards |
| GET | `/api/answer-keys` | List answer keys |
| GET | `/api/admissions` | List admissions |
| GET | `/api/syllabus` | List syllabus items |
| GET | `/api/notifications` | List notifications |
| GET | `/api/categories` | List categories |
| GET | `/api/stats` | Home page statistics |
| GET | `/api/search?q=` | Global search |

### Protected (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST/PUT/DELETE | `/api/jobs/[id]` | CRUD jobs |
| POST/PUT/DELETE | `/api/results/[id]` | CRUD results |
| POST/PUT/DELETE | `/api/admit-cards/[id]` | CRUD admit cards |
| POST/PUT/DELETE | `/api/answer-keys/[id]` | CRUD answer keys |
| POST/PUT/DELETE | `/api/admissions/[id]` | CRUD admissions |
| POST/PUT/DELETE | `/api/syllabus/[id]` | CRUD syllabus |
| GET/PUT/DELETE | `/api/users/[id]` | User management |
| GET | `/api/admin/analytics` | Analytics data |

---

## SEO & Performance

- ✅ Dynamic sitemap.xml generation
- ✅ robots.txt
- ✅ RSS feed
- ✅ JSON-LD structured data (Article, Breadcrumb, FAQ, Organization)
- ✅ OpenGraph & Twitter Card metadata
- ✅ Canonical URLs
- ✅ Dynamic metadata per page
- ✅ Breadcrumb navigation
- ✅ ISR & caching
- ✅ Image optimization with Next/Image
- ✅ Responsive design (mobile-first)
- ✅ Lighthouse 95+ target

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

---

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production — deploys automatically |
| `staging` | Pre-production testing |
| `dev` | Active development |
| `feature/*` | New features (branch from `dev`) |
| `fix/*` | Bug fixes (branch from `dev`) |
| `release/*` | Release preparation |

### Commit Convention

```
<type>(<scope>): <description>

Types: feat, fix, style, refactor, perf, seo, security, docs, chore
Scope: admin, jobs, auth, api, seo, db, ui, deps, config
```

Examples:
```
feat(jobs): add qualification filter
fix(auth): redirect loop on admin layout
seo(meta): add JSON-LD schema for jobs
perf(images): add lazy loading to home page
```

---

## License

MIT
