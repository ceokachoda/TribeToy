# Phase 6: Customizations & User Profiles

## Objective
Allow users to create customized 3D toy requests, save them to their profile, and manage their general account details.

## 1. User Profiles
- Build a `/profile` dashboard for logged-in users.
- Connect the frontend form to update the `users` table (e.g., updating `full_name`, `address`).
- Allow users to view their past orders, fetching from the `orders` table.

## 2. Toy Customization Feature
- Currently, there is a customization form for 3D printed toys.
- Create a `customizations` table in Supabase.
  - Columns: `id`, `user_id` (optional), `name`, `email`, `description`, `reference_image_url`, `status`, `created_at`.
- When a user submits a custom toy request:
  1. Upload any reference image to the `user-uploads` bucket.
  2. Insert a record into the `customizations` table.
- Admins can view these requests in the Admin Dashboard.
