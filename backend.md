# TribeToy Backend Architecture & Roadmap

Welcome to the TribeToy backend documentation. This outlines the complete strategy for transitioning from a static frontend to a fully dynamic e-commerce platform powered by **Supabase** and **Razorpay**.

## Tech Stack
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Supabase Auth)
- **Storage:** Supabase Storage (Public & Private buckets)
- **Payments:** Razorpay Integration
- **Framework:** Next.js (App Router) with Server Actions / API Routes

## Implementation Phases

The integration is broken down into 7 logical phases. Click on each phase for detailed implementation steps and architecture:

1. [Phase 1: Database & Storage Foundation](./docs/backend/phase1.md)
2. [Phase 2: Authentication (Email + Google OAuth)](./docs/backend/phase2.md)
3. [Phase 3: Data Migration & Dynamic Fetching](./docs/backend/phase3.md)
4. [Phase 4: Cart Persistence, Orders & Razorpay](./docs/backend/phase4.md)
5. [Phase 5: Admin Dashboard](./docs/backend/phase5.md)
6. [Phase 6: Customizations & User Profiles](./docs/backend/phase6.md)
7. [Phase 7: QA, Testing, & Optimization](./docs/backend/phase7.md)

---
*Note: This architecture is designed to scale and ensure security via RLS policies while providing a seamless UX.*
