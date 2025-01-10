import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { allowedRoles } from "./constants"
import { NextResponse } from "next/server";

const isProtectedRoutes = createRouteMatcher(["/dashboard"])

export default clerkMiddleware((auth, req) => {
  const role = auth().sessionClaims?.role || "";
  const isAllowed = allowedRoles.includes(role);

  if (isProtectedRoutes(req)) {
    if (!isAllowed) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}