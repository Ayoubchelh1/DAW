import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { escapeHtml, vite } from "./testSetup.mjs";

test("la targeta mostra les dades de cada cançó de la llista", async (t) => {
  const [{ default: SongCard }, { tracks }] = await Promise.all([
    vite.ssrLoadModule("/src/components/Songs/SongCard.tsx"),
    vite.ssrLoadModule("/src/Data/track.ts"),
  ]);

  for (const track of tracks) {
    await t.test(`mostra les dades de «${track.title}»`, () => {
      const reproduccions = Math.floor(Math.random() * 10205);
      const trackInfo = { ...track, reproduccions };
      const markup = renderToStaticMarkup(createElement(SongCard, { trackInfo }));

      assert.ok(markup.includes(`<h1>${escapeHtml(trackInfo.title)}</h1>`));
      assert.ok(markup.includes(`<p>${escapeHtml(trackInfo.artist)}</p>`));
      assert.ok(markup.includes(`<p>Duració:${trackInfo.duration}</p>`));
      assert.ok(markup.includes(`<p>Reproduccions:${reproduccions}</p>`));
    });
  }
});

test("la targeta escapa el títol i l'artista abans de mostrar-los", async () => {
  const { default: SongCard } = await vite.ssrLoadModule("/src/components/Songs/SongCard.tsx");
  const value = `Text <>&"' ${Date.now()}`;
  const trackInfo = { title: value, artist: value, duration: 1, reproduccions: 1 };
  const markup = renderToStaticMarkup(createElement(SongCard, { trackInfo }));

  assert.ok(markup.includes(`<h1>${escapeHtml(trackInfo.title)}</h1>`));
  assert.ok(markup.includes(`<p>${escapeHtml(trackInfo.artist)}</p>`));
  assert.ok(!markup.includes(trackInfo.title));
  assert.ok(!markup.includes(trackInfo.artist));
});

test("la targeta mostra el botó de like i comença amb zero likes", async () => {
  const { default: SongCard } = await vite.ssrLoadModule("/src/components/Songs/SongCard.tsx");
  const trackInfo = { title: "Cançó", artist: "Artista", duration: 1, reproduccions: 0 };
  const markup = renderToStaticMarkup(createElement(SongCard, { trackInfo }));

  assert.match(markup, /aria-label="M&#x27;agrada"/);
  assert.match(markup, /Likes: 0/);
  assert.match(markup, /like-white\.png/);
});
