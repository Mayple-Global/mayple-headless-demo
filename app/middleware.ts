import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEFAULT_COUNTRY = "US";

export async function middleware(request: NextRequest) {
  const country = request.headers.get("x-vercel-ip-country") || DEFAULT_COUNTRY;
  const response = NextResponse.next();
  response.headers.set("shopify_country", country);
  return response;
}
