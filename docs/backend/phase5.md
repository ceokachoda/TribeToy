# Phase 5: Admin Dashboard

## Objective
Build a dedicated Admin Dashboard interface within the Next.js app allowing authorized personnel to manage products, view orders, and handle content updates.

## 1. Security & Role Management
- Define an 'admin' role in the `users` table.
- Create middleware logic to ensure only users with `role = 'admin'` can access routes under `/admin`.
- Ensure RLS policies in Supabase prevent non-admin users from running `INSERT`/`UPDATE`/`DELETE` queries via the API.

## 2. Dashboard Layout (`/admin`)
- Create a dedicated layout (`app/admin/layout.tsx`) with a sidebar navigation tailored for admin tasks (Products, Orders, Blogs, Users).

## 3. Product Management (CRUD)
- Create UI to List, Add, Edit, and Delete products.
- Implement an image upload flow that pushes images directly to Supabase Storage `products` bucket and saves the URL.

## 4. Order Management
- View all orders, filter by status.
- UI to update order status (e.g., from 'paid' to 'shipped').

## 5. Blog Content Management
- Basic CMS functionality to write new blogs and upload cover images.
