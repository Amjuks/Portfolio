import type { APIRoute } from "astro";
import { cardPng } from "../../lib/card-render";
export const GET: APIRoute = async () =>
  new Response(new Uint8Array(await cardPng()), {
    headers: { "Content-Type": "image/png" },
  });
