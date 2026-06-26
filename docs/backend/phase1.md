# Phase 1: Database & Storage Foundation

## Objective
Set up the core Supabase PostgreSQL database tables, define relationships, establish Row Level Security (RLS) policies, and configure Storage buckets.

## 1. Database Schema
We will create the following tables using Supabase SQL migrations:

### `users`
- Extends the default `auth.users`.
- Columns: `id` (uuid, references auth.users), `email`, `full_name`, `role` (enum: 'customer', 'admin'), `created_at`.

### `products`
- Columns: `id` (uuid), `name`, `category`, `price` (numeric), `original_price` (numeric), `image_url`, `is_new` (boolean), `is_sale` (boolean), `is_premium` (boolean), `stock_quantity` (int), `description`, `created_at`.

### `blogs`
- Columns: `id` (uuid), `slug` (unique), `title`, `excerpt`, `content` (text), `cover_image_url`, `author_name`, `tags` (text[]), `created_at`.

### `cart_items` (For persistence)
- Columns: `id` (uuid), `user_id` (uuid, references users), `product_id` (uuid, references products), `quantity` (int), `created_at`.

### `orders`
- Columns: `id` (uuid), `user_id` (uuid), `razorpay_order_id` (string), `razorpay_payment_id` (string), `status` (enum: 'pending', 'paid', 'shipped', 'delivered', 'cancelled'), `total_amount` (numeric), `shipping_address` (jsonb), `created_at`.

### `order_items`
- Columns: `id` (uuid), `order_id` (uuid), `product_id` (uuid), `quantity` (int), `price_at_purchase` (numeric).

## 2. Row Level Security (RLS)
- **Public access:** Anyone can `SELECT` from `products` and `blogs`.
- **Authenticated access:** Users can `SELECT`, `INSERT`, `UPDATE`, `DELETE` their own `cart_items` and `orders`.
- **Admin access:** Users with `role = 'admin'` can bypass RLS to manage `products`, `blogs`, and all `orders`.

## 3. Storage Buckets
- `public/products`: Storing product images (Publicly accessible).
- `public/blogs`: Storing blog cover images (Publicly accessible).
- `user-uploads`: Storing custom 3D design requests or user avatars (Protected by RLS).
