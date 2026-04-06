# InstaTickets — Frontend

Modern event ticketing web app built with Next.js 14, React, and Tailwind CSS.

---

## Quick Start
```bash
# 1. Clone and install
git clone https://github.com/instatickets/web
cd instatickets-web
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Edit .env.local — set NEXT_PUBLIC_API_URL and WEBHOOK_SECRET

# 3. Start the backend first
# (see instatickets API README)
docker-compose up -d postgres
cd ../instatickets && go run ./cmd/server

# 4. Start the frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Go backend API base URL | `http://localhost:8080/api/v1` |
| `WEBHOOK_SECRET` | Must match backend `WEBHOOK_SECRET` | `your-secret-here` |

---

## Pages

| Route | Description | Auth |
|---|---|---|
| `/` | Landing page | Public |
| `/events` | Browse all events | Public |
| `/events/[id]` | Event detail + tier selection | Public |
| `/events/[id]/checkout` | Checkout flow | Public |
| `/login` | Sign in | Guest only |
| `/register` | Create account | Guest only |
| `/organizer` | Organizer dashboard | ORGANIZER |
| `/organizer/events/new` | Create event wizard | ORGANIZER |
| `/organizer/events/[id]` | Event management | ORGANIZER |
| `/organizer/events/[id]/orders` | Event orders table | ORGANIZER |
| `/buyer` | Buyer dashboard | BUYER |
| `/buyer/orders/[id]` | Order detail + tickets | BUYER |
| `/scanner` | Ticket scanner | API Key |

---

## Tech Stack

| Concern | Library |
|---|---|
| Framework | Next.js 14 App Router |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Animations | Framer Motion |
| State | Zustand |
| Server state | TanStack Query |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Toasts | Sonner |
| Theme | next-themes |

---

## Architecture
```
app/
├── (public)/      → No auth required
├── (auth)/        → Guest only (redirects if logged in)
├── (dashboard)/   → JWT protected
│   ├── organizer/ → ORGANIZER role
│   └── buyer/     → BUYER role
└── scanner/       → API key protected (full-screen, no nav)
```

### Auth Flow
1. Register/Login → JWT returned from backend
2. JWT stored in Zustand + `localStorage` (Axios) + cookie (middleware)
3. Middleware reads cookie to protect dashboard routes
4. Axios interceptor attaches JWT to every API call
5. 401 response → clear token + redirect to `/login`

### Checkout Flow
```
Select tickets → Zustand cart
→ POST /orders/checkout → PENDING order (10 min lock)
→ Countdown timer starts
→ Simulate payment → Next.js API route generates HMAC
→ POST /webhooks/payment (signed)
→ Tickets issued → Success + confetti
```

---

## Running Tests
```bash
# Type checking
npx tsc --noEmit

# Lint
npm run lint

# Production build
npm run build
```

---

## Scanner Setup

1. Go to `http://localhost:3000/scanner`
2. Enter the `SCANNER_API_KEY` from the backend `.env`
3. Scan ticket codes from buyer orders
4. Green = Access Granted, Red = Already Used, Amber = Not Found

The API key is stored in `sessionStorage` and clears when the tab closes.

---

## Connecting to Backend

The frontend expects the Go backend running on port 8080.
```bash
# Backend health check
curl http://localhost:8080/health

# If CORS errors appear, ensure the backend allows localhost:3000
# Add to Go backend main.go:
r.Use(cors.New(cors.Config{
    AllowOrigins: []string{"http://localhost:3000"},
    AllowMethods: []string{"GET", "POST", "PATCH", "DELETE"},
    AllowHeaders: []string{"Authorization", "Content-Type",
                           "X-Scanner-Key", "X-Webhook-Signature"},
}))
```

Install the CORS middleware in the backend:
```bash
cd ../instatickets
go get github.com/gin-contrib/cors
```