import { NextRequest } from "next/server";
import { serveFile } from "./serveStatic";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return serveFile("index.html");
}

export async function HEAD(request: NextRequest) {
  return serveFile("index.html", true);
}
