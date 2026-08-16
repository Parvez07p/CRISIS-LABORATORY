import path from "node:path";
import fs from "node:fs";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".txt": "text/plain; charset=utf-8",
  ".pdf": "application/pdf",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".map": "application/json",
};

export async function serveFile(relativePath: string, isHead = false): Promise<Response> {
  const rootDir = process.cwd();
  
  // Normalize and clean path
  const sanitizedPath = path.normalize(relativePath || "index.html").replace(/^(\.\.[\/\\])+/, "");
  
  // Potential target candidates in order:
  // 1. Direct path in root directory (e.g. 'register.html', 'assets/css/main.css')
  // 2. Direct path + '.html' (e.g. 'register' -> 'register.html')
  // 3. Directory index (e.g. 'challenges/challenge01' -> 'challenges/challenge01/index.html')
  // 4. In public directory (e.g. 'public/next.svg')
  const candidates: string[] = [
    path.resolve(rootDir, sanitizedPath),
    path.resolve(rootDir, sanitizedPath + ".html"),
    path.resolve(rootDir, sanitizedPath, "index.html"),
    path.resolve(rootDir, "public", sanitizedPath),
    path.resolve(rootDir, "public", sanitizedPath + ".html"),
  ];

  let targetFile: string | null = null;

  for (const candidate of candidates) {
    // Security check: Must be within rootDir
    if (!candidate.startsWith(rootDir)) {
      continue;
    }

    try {
      if (fs.existsSync(candidate)) {
        const stat = fs.statSync(candidate);
        if (stat.isFile()) {
          targetFile = candidate;
          break;
        } else if (stat.isDirectory()) {
          const indexCandidate = path.join(candidate, "index.html");
          if (fs.existsSync(indexCandidate) && fs.statSync(indexCandidate).isFile()) {
            targetFile = indexCandidate;
            break;
          }
        }
      }
    } catch {
      // Continue to next candidate
    }
  }

  if (!targetFile) {
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  const ext = path.extname(targetFile).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  const stat = await fs.promises.stat(targetFile);

  const headers = new Headers({
    "Content-Type": contentType,
    "Content-Length": stat.size.toString(),
    "Last-Modified": stat.mtime.toUTCString(),
    "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=3600",
  });

  if (isHead) {
    return new Response(null, {
      status: 200,
      headers,
    });
  }

  const content = await fs.promises.readFile(targetFile);
  return new Response(content, {
    status: 200,
    headers,
  });
}
