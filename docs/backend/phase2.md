# Phase 2: Authentication (Email + Google OAuth)

## Objective
Implement a secure authentication system using Supabase Auth, enabling users to log in via Email/Password and Google OAuth, and secure specific routes.

## 1. Supabase Client Setup
- Install `@supabase/ssr` and `@supabase/supabase-js`.
- Create utility functions in `src/utils/supabase/server.ts` and `client.ts` to manage server-side and client-side Supabase clients using Next.js App Router cookies.

## 2. Authentication Providers
- **Email & Password:** Standard signup and login pages (`/login`, `/signup`).
- **Google OAuth:** Configure Google Cloud Console credentials, set up OAuth in the Supabase Dashboard, and implement the "Sign in with Google" button on the frontend.

## 3. Auth Callback Route
- Implement `/auth/callback` API route to exchange the auth code for a session token (crucial for OAuth flows).

## 4. Route Protection & Middleware
- Create a Next.js `middleware.ts` to protect specific routes.
- **Protected Routes:** `/profile`, `/checkout`, `/admin/*`.
- **Redirects:** Unauthenticated users trying to access protected routes will be redirected to `/login`.

## 5. UI Updates
- Update the navigation bar to show user avatar/name when logged in, and a "Sign Out" button.
- Build the UI for the login and signup forms integrating the Supabase API calls.
