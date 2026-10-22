import assert from "node:assert/strict";
import { after, test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({
  configFile: `${root}/vite.config.ts`,
  root,
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

after(async () => {
  await vite.close();
});

test("renders the app with a known user, track, date, and play count", async () => {
  const [{ default: App }, { tracks }, { users }] = await Promise.all([
    vite.ssrLoadModule("/src/App.tsx"),
    vite.ssrLoadModule("/src/Data/track.ts"),
    vite.ssrLoadModule("/src/Data/user.ts"),
  ]);
  const markup = renderToStaticMarkup(createElement(App));

  assert.match(markup, /<h1>Spotify<\/h1>/);
  assert.ok(users.some(({ name }) => markup.includes(`Usuari: ${name}`)));
  assert.ok(tracks.some(({ title }) => markup.includes(`<h1>${title}</h1>`)));
  assert.match(markup, /Data: \d{1,2}\/\d{1,2}\/\d{4}/);

  const playCount = markup.match(/Reproduccions:(\d+)/);
  assert.ok(playCount);
  assert.ok(Number(playCount[1]) >= 0 && Number(playCount[1]) < 10205);
});
