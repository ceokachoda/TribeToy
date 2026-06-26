# Phase 4: Cart Persistence, Orders & Razorpay

## Objective
Implement a persistent shopping cart using the database, build a secure checkout flow, integrate Razorpay for processing payments, and manage order lifecycle.

## 1. Database Cart Persistence
- Replace or enhance the React Context based cart with a hybrid model.
- For logged-out users: Cart remains in `localStorage` or cookies.
- For logged-in users: Cart is synced to the `cart_items` table in Supabase.
- Merge local cart with DB cart upon user login.

## 2. Razorpay Integration
- Install Razorpay Node.js SDK.
- Configure Webhooks in Razorpay Dashboard to notify our backend on payment success/failure.
- **Create Order API:** `/api/razorpay/create-order` creates an order in Razorpay and returns the `order_id` to the frontend.
- **Verify Payment API:** `/api/razorpay/verify` receives the payment signature from the client, verifies it, and updates the `orders` table in Supabase.

## 3. Order Management Lifecycle
- Upon successful payment:
  1. Insert a record into the `orders` table (`status = 'paid'`).
  2. Insert records into `order_items` referencing the purchased products.
  3. Clear the user's `cart_items` in the database.
  4. Redirect user to `/order-success` page.
