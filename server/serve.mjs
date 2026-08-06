import http from "node:http";
import https from "node:https";
import fs from "node:fs";
import path from "node:path";

const PORT = Number(process.env.PORT) || 3000;
const MW_BASE = "https://app.motowarsztat.pl";
const DIST = path.resolve(process.env.DIST_DIR || "dist");

function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", () => resolve(Buffer.alloc(0)));
  });
}

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".woff2": "font/woff2",
};

function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  let filePath = path.join(DIST, urlPath);
  if (urlPath === "/" || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST, "index.html");
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404).end("Not found");
      return;
    }
    res.writeHead(200, { "content-type": MIME[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname.startsWith("/mw/")) {
    const apiPath = url.pathname.replace(/^\/mw/, "/api") + url.search;
    const target = new URL(MW_BASE + apiPath);
    const body = await readBody(req);
    const headers = {};
    if (req.headers.authorization) headers["authorization"] = req.headers.authorization;
    if (req.headers["content-type"]) headers["content-type"] = req.headers["content-type"];

    const proxy = https.request(
      target,
      { method: req.method, headers: { ...headers, host: target.host, origin: MW_BASE } },
      (mwRes) => {
        if (!mwRes) {
          res.writeHead(502).end(JSON.stringify({ message: "Błąd połączenia z API" }));
          return;
        }
        res.writeHead(mwRes.statusCode || 502, { "content-type": "application/json" });
        mwRes.pipe(res);
      },
    );
    proxy.on("error", () => res.writeHead(502).end(JSON.stringify({ message: "Błąd połączenia z API" })));
    if (body.length) proxy.write(body);
    proxy.end();
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Serwer produkcyjny: http://localhost:${PORT}  (proxy /mw -> ${MW_BASE}/api)`);
});
