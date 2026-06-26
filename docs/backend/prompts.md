# Phase Execution Prompts

Copy and paste the corresponding prompt to me (Antigravity) when you are ready to start a phase. These prompts include the strict rule for testing before moving on.

---

## Prompt for Phase 1: Database & Storage
```text
Let's execute Phase 1: Database & Storage Foundation according to docs/backend/phase1.md. 
Please use the Supabase MCP tool to create the tables, establish the relationships, configure Row Level Security (RLS) policies, and set up the storage buckets. 

STRICT RULE: After completing the implementation, you must verify the schema and RLS policies yourself first. Once you have verified everything is correct, provide me with manual testing instructions (e.g., verifying in the Supabase Studio dashboard) before we consider this phase complete.
```

---

## Prompt for Phase 2: Authentication
```text
Let's execute Phase 2: Authentication (Email + Google OAuth) according to docs/backend/phase2.md.
Please set up the `@supabase/ssr` client in the Next.js app, configure the login/signup routes, handle the Google OAuth flow, and set up the middleware to protect routes.

STRICT RULE: After implementing, you must test the auth flow in the code (e.g., check build/linting). Then, give me clear manual testing steps to try logging in with Email and Google, and test the protected routes on my end. Do not proceed until I confirm manual testing is successful.
```

---

## Prompt for Phase 3: Data Migration & Fetching
```text
Let's execute Phase 3: Data Migration & Dynamic Fetching according to docs/backend/phase3.md.
Please write the scripts to migrate products and blogs into Supabase, and then refactor the Next.js frontend components (Shop, Hero Section, Blog) to fetch data dynamically from the database.

STRICT RULE: After making the code changes, run any necessary automated checks or test scripts to ensure data was migrated. Then, provide me with manual testing steps to verify that the shop and blog pages load correctly with the database data before we move on.
```

---

## Prompt for Phase 4: Cart & Razorpay
```text
Let's execute Phase 4: Cart Persistence, Orders & Razorpay Payments according to docs/backend/phase4.md.
Please integrate Razorpay for payments, set up the webhooks, update the database cart logic, and manage the order creation lifecycle.

STRICT RULE: After implementing the logic, test the API endpoints (e.g., creating an order) yourself if possible. Then, give me manual testing instructions using Razorpay's Test Mode to simulate a full checkout flow. We will not move on until I successfully complete a test purchase.
```

---

## Prompt for Phase 5: Admin Dashboard
```text
Let's execute Phase 5: Admin Dashboard according to docs/backend/phase5.md.
Please build the dedicated /admin routes with role-based protection, and implement the UI for managing products and viewing orders.

STRICT RULE: Once built, verify the middleware is correctly blocking non-admins. Then, provide me with manual testing steps to access the dashboard as an admin, add a test product, and update an order status.
```

---

## Prompt for Phase 6: Customizations & Profiles
```text
Let's execute Phase 6: Customizations & User Profiles according to docs/backend/phase6.md.
Please build the user profile page and connect the 3D toy customization form to save requests into the `customizations` table.

STRICT RULE: Test the component logic. Then, provide me with manual testing instructions to update my profile and submit a custom toy request.
```

---

## Prompt for Phase 7: QA & Optimization
```text
Let's execute Phase 7: QA, Testing, & Optimization according to docs/backend/phase7.md.
Please review the codebase for any unoptimized queries, missing loading states, or security loopholes. 

STRICT RULE: Run a full audit and fix any found issues. Provide me with a final checklist of manual E2E (End-to-End) tests to run across the entire application to certify it ready for production.
```
