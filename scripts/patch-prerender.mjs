import fs from "fs";
import path from "path";

const file = path.resolve(
  "node_modules/vite-plugin-prerender/dist/index.mjs"
);

if (!fs.existsSync(file)) {
  console.log("[patch] vite-plugin-prerender not found, skipping");
  process.exit(0);
}

let src = fs.readFileSync(file, "utf8");

const broken =
  /const Prerenderer = require\("@prerenderer\/prerenderer"\);/;
const fixed =
  'import { createRequire as _createRequire } from "module";\n' +
  'const _require = _createRequire(import.meta.url);\n' +
  'const Prerenderer = _require("@prerenderer/prerenderer");';

if (broken.test(src)) {
  src = src.replace(broken, fixed);
  fs.writeFileSync(file, src);
  console.log("[patch] vite-plugin-prerender ESM fixed");
} else if (src.includes("_createRequire")) {
  console.log("[patch] vite-plugin-prerender already patched");
} else {
  console.warn("[patch] unexpected vite-plugin-prerender source, not patched");
}
