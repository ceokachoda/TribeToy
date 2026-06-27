import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isApiRoute = request.nextUrl.pathname.startsWith('/api/');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  // Skip middleware for public routes or standard pages
  if (!isApiRoute && !isAdminRoute) {
    return supabaseResponse;
  }

  // Allow unrestricted access to auth/webhook API routes
  if (isApiRoute && (request.nextUrl.pathname.includes('/auth') || request.nextUrl.pathname.includes('/webhook'))) {
    return supabaseResponse;
  }

  // Enforce authentication for protected routes
  if (!user && (isAdminRoute || isApiRoute)) {
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set(`redirect`, request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Role validation is intentionally skipped at the middleware level 
  // because fetching the user's role from the public.users table 
  // requires an extra DB lookup which degrades edge performance.
  // We handle layout rendering protection in src/app/admin/layout.tsx 
  // and we securely guard all server mutations in their respective actions.

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
