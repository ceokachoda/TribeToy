# Phase 3: Data Migration & Dynamic Fetching

## Objective
Migrate the existing static JSON/TypeScript data (Products and Blogs) into the Supabase PostgreSQL database and refactor frontend components to fetch data dynamically.

## 1. Data Migration Scripts
- Create Node.js/Next.js scripts to read `src/data/products.ts` and `src/data/blogs.ts`.
- Format the data to match the new database schema (Phase 1).
- Use the Supabase client to `INSERT` the records into the `products` and `blogs` tables.
- Upload existing static images from `/public` to Supabase Storage buckets and update database `image_url` fields.

## 2. Frontend Refactoring (Data Fetching)
- Update `src/app/shop/page.tsx` and `HeroSection.tsx` to fetch products from Supabase using Server Actions or React Server Components.
- Update `src/app/product/[id]/page.tsx` to fetch single product details from the database.
- Update `src/app/blog/page.tsx` and individual blog pages to fetch from the `blogs` table.

## 3. Loading & Error States
- Implement Next.js `loading.tsx` and `error.tsx` boundaries to handle latency during data fetching gracefully.
- Optionally add SWR or React Query for client-side data fetching where needed (e.g., search filters).
