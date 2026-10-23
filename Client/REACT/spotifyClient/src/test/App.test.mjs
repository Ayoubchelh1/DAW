import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { escapeHtml, getSongCardMarkup, vite } from "./testSetup.mjs";

test("la data actual té un format vàlid de dia/mes/any", async () => {
  const { getCurrentDate } = await vite.ssrLoadModule("/src/Utils/currentDate.ts");
  const currentDate = getCurrentDate();

  assert.match(currentDate, /^\d{1,2}\/\d{1,2}\/\d{4}$/);
  const [day, month, year] = currentDate.split("/").map(Number);
  assert.ok(day >= 1 && day <= 31);
  assert.ok(month >= 1 && month <= 12);
  assert.ok(year >= 1);
});

test("les dades contenen els camps necessaris per renderitzar", async () => {
  const [{ users }, { tracks }] = await Promise.all([
    vite.ssrLoadModule("/src/Data/user.ts"),
    vite.ssrLoadModule("/src/Data/track.ts"),
  ]);

  assert.ok(users.length > 0, "Cal com a mínim un usuari");
  assert.ok(tracks.length > 0, "Cal com a mínim una cançó");

  for (const user of users) {
    assert.equal(typeof user.name, "string");
    assert.ok(user.name.trim().length > 0);
  }

  for (const track of tracks) {
    assert.equal(typeof track.title, "string");
    assert.ok(track.title.trim().length > 0);
    assert.equal(typeof track.artist, "string");
    assert.ok(track.artist.trim().length > 0);
    assert.ok(Number.isFinite(track.duration));
  }
});

test("l'aplicació mostra un usuari i una cançó existents amb reproduccions vàlides", async () => {
  const [{ default: App }, { users }, { tracks }] = await Promise.all([
    vite.ssrLoadModule("/src/App.tsx"),
    vite.ssrLoadModule("/src/Data/user.ts"),
    vite.ssrLoadModule("/src/Data/track.ts"),
  ]);
  const markup = renderToStaticMarkup(createElement(App));
  const songMarkup = getSongCardMarkup(markup);
  const matchingUser = users.find((user) =>
    markup.includes(`<p>Usuari: ${escapeHtml(user.name)}</p>`),
  );
  const matchingTrack = tracks.find((track) =>
    songMarkup.startsWith(
      `<h1>${escapeHtml(track.title)}</h1><p>${escapeHtml(track.artist)}</p><p>Duració:${track.duration}</p><p>Reproduccions:`,
    ),
  );
  const playCountMatch = songMarkup.match(/<p>Reproduccions:(\d+)<\/p>/);
  const displayedDate = markup.match(/<p>Data: (\d{1,2}\/\d{1,2}\/\d{4})<\/p>/);

  assert.ok(markup.includes("<header>"), "La pàgina ha de contenir la capçalera");
  assert.ok(matchingUser, "La capçalera ha de mostrar un usuari de la llista");
  assert.ok(matchingTrack, "La targeta ha de mostrar una cançó de la llista");
  assert.ok(playCountMatch, "La targeta ha de mostrar les reproduccions");
  assert.ok(Number(playCountMatch[1]) >= 0);
  assert.ok(Number(playCountMatch[1]) < 10205);
  assert.ok(displayedDate, "La capçalera ha de mostrar una data vàlida");
});
