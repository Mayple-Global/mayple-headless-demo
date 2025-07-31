import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEFAULT_COUNTRY = "US";

export function middleware(request: NextRequest) {
  // Check if user already has a country preference cookie
  const existingCountry = request.cookies.get("country-code");

  if (!existingCountry) {
    // Get country from Vercel's geo headers (works in production)
    // For development, this will be undefined
    const country =
      request.headers.get("x-vercel-ip-country") || DEFAULT_COUNTRY;

    // Create response and set the country cookie
    const response = NextResponse.next();
    response.cookies.set("country-code", country, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  }

  return NextResponse.next();
}
