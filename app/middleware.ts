import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEFAULT_COUNTRY = "US";

export async function middleware(request: NextRequest) {
  const countryFromHeader =
    request.headers.get("cf-ipcountry") ||
    request.headers.get("X-Vercel-IP-Country-Region") ||
    DEFAULT_COUNTRY;

  console.log(
    "countries",
    request.headers.get("cf-ipcountry"),
    request.headers.get("X-Vercel-IP-Country-Region"),
    DEFAULT_COUNTRY
  );
  const countryCookie = request.cookies.get("shopify_country");
  let country = countryFromHeader;

  // Create the response
  const response = NextResponse.next();

  // If we have a country cookie already, use it
  if (countryCookie?.value) {
    country = countryCookie.value;
  } else {
    // Set the default country cookie if it doesn't exist
    response.cookies.set("shopify_country", country, {
      httpOnly: false, // Set to false so client-side can read it
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return response;
}
