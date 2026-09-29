import type { APIRoute } from "astro";
import { cardSvg } from "../../lib/card-render";
export const GET: APIRoute = async () =>
  new Response(await cardSvg(), {
    headers: { "Content-Type": "image/svg+xml; charset=utf-8" },
  });
