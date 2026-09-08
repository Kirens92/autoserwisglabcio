import http from "node:http";
import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const PORT = Number(process.env.PORT) || 3000;
const MW_BASE = "https://app.motowarsztat.pl";
const DIST = path.resolve(process.env.DIST_DIR || "dist");
const DATA_DIR = path.resolve(process.env.DATA_DIR || "data");
const SERVICES_FILE = path.join(DATA_DIR, "services.json");
const REALIZATIONS_FILE = path.join(DATA_DIR, "realizations.json");
const SITE_CONTENT_FILE = path.join(DATA_DIR, "site-content.json");
const ECU_TCU_FILE = path.join(DATA_DIR, "ecu-tcu.json");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
const ADMIN_LOGIN = process.env.ADMIN_LOGIN;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_SECRET = process.env.SESSION_SECRET;
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID || "ChIJeY3aNu-1GkcRNZCeCraEeZI";

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
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".woff2": "font/woff2",
};

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  let filePath = path.join(DIST, urlPath);
  if (urlPath === "/" || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST, "index.html");
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404).end("Not found");
      return;
    }
    res.writeHead(200, { "content-type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream" });
    res.end(data);
  });
}

function sendJson(res, status, data, headers = {}) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", ...headers });
  res.end(JSON.stringify(data));
}

function getCookie(req, name) {
  return (req.headers.cookie || "").split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`))?.slice(name.length + 1);
}

function sign(value) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("base64url");
}

function isAdmin(req) {
  const token = getCookie(req, "admin_session");
  if (!token || !SESSION_SECRET) return false;
  const [expires, signature] = token.split(".");
  const expected = expires ? sign(expires) : "";
  return Boolean(expires && signature && Number(expires) > Date.now() && signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected)));
}

function readJsonFile(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJsonFile(file, data) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

function services() {
  return readJsonFile(SERVICES_FILE, []);
}

function realizations() {
  return readJsonFile(REALIZATIONS_FILE, []);
}

function siteContent() {
  return readJsonFile(SITE_CONTENT_FILE, {});
}

function ecuTcuContent() {
  return readJsonFile(ECU_TCU_FILE, {});
}

function validServices(data) {
  return Array.isArray(data) && data.every((item) => item && typeof item.title === "string" && typeof item.description === "string" && typeof item.icon === "string" && (!item.items || (Array.isArray(item.items) && item.items.every((entry) => typeof entry === "string"))));
}

function validSiteContent(data) {
  return Boolean(
    data &&
    typeof data === "object" &&
    typeof data.seo?.title === "string" &&
    typeof data.seo?.description === "string" &&
    typeof data.business?.phone === "string" &&
    typeof data.business?.email === "string" &&
    typeof data.hero?.titleLine1 === "string" &&
    typeof data.hero?.titleLine2 === "string" &&
    typeof data.specialization?.title === "string" &&
    Array.isArray(data.specialization?.brands) &&
    Array.isArray(data.services?.items) &&
    Array.isArray(data.about?.stats) &&
    Array.isArray(data.process?.steps) &&
    Array.isArray(data.reviews?.items)
  );
}

function validEcuTcuContent(data) {
  return Boolean(
    data &&
    typeof data === "object" &&
    typeof data.seo?.title === "string" &&
    typeof data.seo?.description === "string" &&
    typeof data.hero?.titleLine1 === "string" &&
    typeof data.hero?.titleLine2 === "string" &&
    Array.isArray(data.hero?.trust) &&
    Array.isArray(data.benefits) &&
    Array.isArray(data.services?.items) &&
    Array.isArray(data.problem?.bullets) &&
    Array.isArray(data.flex?.modes) &&
    Array.isArray(data.process?.steps) &&
    Array.isArray(data.shipping?.points) &&
    Array.isArray(data.faq?.items)
  );
}

async function googleReviews() {
  if (!GOOGLE_PLACES_API_KEY) {
    return { live: false, configured: false };
  }

  const endpoint = `https://places.googleapis.com/v1/places/${encodeURIComponent(GOOGLE_PLACE_ID)}?languageCode=pl`;
  const response = await fetch(endpoint, {
    headers: {
      "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
      "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri",
    },
  });

  if (!response.ok) {
    throw new Error(`Google Places API returned ${response.status}`);
  }

  const place = await response.json();
  return {
    live: true,
    configured: true,
    rating: typeof place.rating === "number" ? place.rating : undefined,
    reviewCount: typeof place.userRatingCount === "number" ? place.userRatingCount : undefined,
    googleMapsUri: place.googleMapsUri,
    reviews: Array.isArray(place.reviews)
      ? place.reviews.slice(0, 5).map((review) => ({
          id: review.name || review.googleMapsUri || crypto.randomUUID(),
          rating: typeof review.rating === "number" ? review.rating : 5,
          text: review.text?.text || review.originalText?.text || "",
          relativeTime: review.relativePublishTimeDescription,
          googleMapsUri: review.googleMapsUri,
          flagContentUri: review.flagContentUri,
          author: {
            name: review.authorAttribution?.displayName || "Użytkownik Google",
            uri: review.authorAttribution?.uri,
            photoUri: review.authorAttribution?.photoUri,
          },
        }))
      : [],
  };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/api/services" && req.method === "GET") {
    sendJson(res, 200, services(), { "cache-control": "no-store" });
    return;
  }

  if (url.pathname === "/api/realizations" && req.method === "GET") {
    sendJson(res, 200, realizations(), { "cache-control": "no-store" });
    return;
  }

  if (url.pathname === "/api/site-content" && req.method === "GET") {
    sendJson(res, 200, siteContent(), { "cache-control": "no-store" });
    return;
  }

  if (url.pathname === "/api/ecu-tcu" && req.method === "GET") {
    sendJson(res, 200, ecuTcuContent(), { "cache-control": "no-store" });
    return;
  }

  if (url.pathname === "/api/google-reviews" && req.method === "GET") {
    try {
      const data = await googleReviews();
      sendJson(res, data.live ? 200 : 503, data, { "cache-control": "no-store" });
    } catch (error) {
      console.error("Google reviews:", error instanceof Error ? error.message : "unknown error");
      sendJson(res, 502, { live: false, configured: Boolean(GOOGLE_PLACES_API_KEY) }, { "cache-control": "no-store" });
    }
    return;
  }

  if (url.pathname === "/api/admin/site-content" && req.method === "PUT") {
    if (!isAdmin(req)) {
      sendJson(res, 401, { message: "Brak dostępu" });
      return;
    }
    try {
      const data = JSON.parse((await readBody(req)).toString("utf8"));
      if (!validSiteContent(data)) throw new Error("invalid");
      writeJsonFile(SITE_CONTENT_FILE, data);
      sendJson(res, 200, data, { "cache-control": "no-store" });
    } catch {
      sendJson(res, 400, { message: "Nieprawidłowa struktura treści strony" });
    }
    return;
  }

  if (url.pathname === "/api/admin/ecu-tcu" && req.method === "PUT") {
    if (!isAdmin(req)) {
      sendJson(res, 401, { message: "Brak dostępu" });
      return;
    }
    try {
      const data = JSON.parse((await readBody(req)).toString("utf8"));
      if (!validEcuTcuContent(data)) throw new Error("invalid");
      writeJsonFile(ECU_TCU_FILE, data);
      sendJson(res, 200, data, { "cache-control": "no-store" });
    } catch {
      sendJson(res, 400, { message: "Nieprawidłowa struktura treści ECU / TCU" });
    }
    return;
  }

  if (url.pathname === "/api/admin/realizations" && req.method === "PUT") {
    if (!isAdmin(req)) {
      sendJson(res, 401, { message: "Brak dostępu" });
      return;
    }
    try {
      const data = JSON.parse((await readBody(req)).toString("utf8"));
      if (!Array.isArray(data)) throw new Error();
      writeJsonFile(REALIZATIONS_FILE, data);
      sendJson(res, 200, data);
    } catch {
      sendJson(res, 400, { message: "Nieprawidłowe dane" });
    }
    return;
  }

  if (url.pathname === "/api/admin/upload" && req.method === "POST") {
    if (!isAdmin(req)) {
      sendJson(res, 401, { message: "Brak dostępu" });
      return;
    }
    const original = path.basename(url.searchParams.get("name") || "image.jpg").replace(/[^a-zA-Z0-9._-]/g, "_");
    const body = await readBody(req);
    if (!body.length || body.length > 8 * 1024 * 1024) {
      sendJson(res, 400, { message: "Nieprawidłowy plik" });
      return;
    }
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    const file = `${Date.now()}-${original}`;
    fs.writeFileSync(path.join(UPLOADS_DIR, file), body);
    sendJson(res, 200, { image: `/uploads/${file}` });
    return;
  }

  if (url.pathname.startsWith("/uploads/")) {
    const file = path.basename(url.pathname);
    const target = path.join(UPLOADS_DIR, file);
    if (!fs.existsSync(target)) {
      res.writeHead(404).end("Not found");
      return;
    }
    const ext = path.extname(target).toLowerCase();
    res.writeHead(200, { "content-type": MIME[ext] || "application/octet-stream" });
    fs.createReadStream(target).pipe(res);
    return;
  }

  if (url.pathname === "/api/admin/session" && req.method === "GET") {
    sendJson(res, 200, { authenticated: isAdmin(req) });
    return;
  }

  if (url.pathname === "/api/admin/login" && req.method === "POST") {
    let body = {};
    try {
      body = JSON.parse((await readBody(req)).toString("utf8") || "{}");
    } catch {
      sendJson(res, 400, { message: "Nieprawidłowe dane logowania" });
      return;
    }
    if (!ADMIN_LOGIN || !ADMIN_PASSWORD || !SESSION_SECRET || body.login !== ADMIN_LOGIN || body.password !== ADMIN_PASSWORD) {
      sendJson(res, 401, { message: "Nieprawidłowy login lub hasło" });
      return;
    }
    const expires = String(Date.now() + 8 * 60 * 60 * 1000);
    sendJson(res, 200, { authenticated: true }, { "set-cookie": `admin_session=${expires}.${sign(expires)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800; Secure` });
    return;
  }

  if (url.pathname === "/api/admin/logout" && req.method === "POST") {
    sendJson(res, 200, { authenticated: false }, { "set-cookie": "admin_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0; Secure" });
    return;
  }

  if (url.pathname === "/api/admin/services" && req.method === "PUT") {
    if (!isAdmin(req)) {
      sendJson(res, 401, { message: "Brak dostępu" });
      return;
    }
    try {
      const data = JSON.parse((await readBody(req)).toString("utf8"));
      if (!validServices(data)) throw new Error("invalid");
      writeJsonFile(SERVICES_FILE, data);
      sendJson(res, 200, data);
    } catch {
      sendJson(res, 400, { message: "Nieprawidłowe dane usług" });
    }
    return;
  }

  if (url.pathname.startsWith("/mw/")) {
    const apiPath = url.pathname.replace(/^\/mw/, "/api") + url.search;
    const target = new URL(MW_BASE + apiPath);
    const body = await readBody(req);
    const headers = {};
    if (req.headers.authorization) headers.authorization = req.headers.authorization;
    if (req.headers["content-type"]) headers["content-type"] = req.headers["content-type"];

    const proxy = https.request(
      target,
      { method: req.method, headers: { ...headers, host: target.host, origin: MW_BASE } },
      (mwRes) => {
        res.writeHead(mwRes.statusCode || 502, { "content-type": mwRes.headers["content-type"] || "application/json" });
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
