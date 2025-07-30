import { geolocation } from "@vercel/functions";

export async function GET(request: Request) {
  return Response.json(geolocation(request));
}
