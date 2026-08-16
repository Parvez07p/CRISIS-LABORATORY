import { NextRequest } from "next/server";
import { serveFile } from "../serveStatic";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteParams = {
  params: Promise<{
    slug?: string[];
  }>;
};

export async function GET(request: NextRequest, context: RouteParams) {
  const { slug } = await context.params;
  const relativePath = (slug || []).join("/");
  return serveFile(relativePath);
}

export async function HEAD(request: NextRequest, context: RouteParams) {
  const { slug } = await context.params;
  const relativePath = (slug || []).join("/");
  return serveFile(relativePath, true);
}
