# Phase 7: QA, Testing, & Optimization

## Objective
Ensure the application is secure, performant, and completely bug-free before full production deployment.

## 1. Security & RLS Audit
- Test all Supabase Row Level Security (RLS) policies using different roles (unauthenticated, authenticated customer, admin).
- Ensure users absolutely cannot view other users' orders or modify products.

## 2. End-to-End User Journey Testing
- Test the full flow: Sign Up (Email & Google) -> Browse Shop -> Add to Cart -> Checkout with Razorpay (Test Mode) -> Verify Order Success -> View Profile Order History.

## 3. Performance & Optimization
- Check Next.js server logs for any slow API routes or unoptimized database queries.
- Ensure images served from Supabase Storage are properly cached and optimized using Next.js `next/image` component configurations.
- Verify that loading states and skeletons appear correctly during data fetches.

## 4. Final Deployment Checks
- Ensure all environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`) are correctly set in Vercel or the hosting provider.
- Run `npm run build` and resolve any TypeScript or ESLint errors.
