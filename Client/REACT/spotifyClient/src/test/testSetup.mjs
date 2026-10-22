import assert from "node:assert/strict";
import { after } from "node:test";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { createServer } from "vite";

const root = fileURLToPath(new URL("../..", import.meta.url));

export const vite = await createServer({
  configFile: join(root, "vite.config.ts"),
  root,
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
  logLevel: "error",
});

after(async () => {
  await vite.close();
});

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
  })[character]);
}

export function getSongCardMarkup(appMarkup) {
  const headerEnd = appMarkup.indexOf("</header>");
  assert.notEqual(headerEnd, -1, "L'aplicació ha de mostrar una capçalera");
  return appMarkup.slice(headerEnd + "</header>".length);
}
