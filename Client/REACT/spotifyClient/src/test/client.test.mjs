import assert from "node:assert/strict";
import { after, test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { createServer } from "vite";

const root = fileURLToPath(new URL("../..", import.meta.url));
const vite = await createServer({
  configFile: join(root, "vite.config.ts"),
  root,
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

after(async () => {
  await vite.close();
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
  })[character]);
}

function getSongCardMarkup(appMarkup) {
  const headerEnd = appMarkup.indexOf("</header>");
  assert.notEqual(headerEnd, -1, "L'aplicació ha de mostrar una capçalera");
  return appMarkup.slice(headerEnd + "</header>".length);
}

test("la capçalera mostra els valors que rep com a propietats", async () => {
  const { default: Header } = await vite.ssrLoadModule("/src/components/Header/Header.tsx");
  const usersModule = await vite.ssrLoadModule("/src/Data/user.ts");
  const user = usersModule.users[0];
  const props = {
    title: `Títol ${Date.now()}`,
    user: user.name,
    date: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
  };
  const markup = renderToStaticMarkup(createElement(Header, props));

  assert.ok(markup.includes(`<h1>${escapeHtml(props.title)}</h1>`));
  assert.ok(markup.includes(`<p>Usuari: ${escapeHtml(props.user)}</p>`));
  assert.ok(markup.includes(`<p>Data: ${escapeHtml(props.date)}</p>`));
});

test("la targeta mostra totes les dades de cada cançó de la llista", async (t) => {
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

test("la capçalera i la targeta escapen els caràcters especials de les propietats", async (t) => {
  const [{ default: Header }, { default: SongCard }] = await Promise.all([
    vite.ssrLoadModule("/src/components/Header/Header.tsx"),
    vite.ssrLoadModule("/src/components/Songs/SongCard.tsx"),
  ]);
  const specialText = `Text <>&"' ${Date.now()}`;

  await t.test("capçalera", () => {
    const props = { title: specialText, user: specialText, date: specialText };
    const markup = renderToStaticMarkup(createElement(Header, props));

    for (const value of Object.values(props)) {
      assert.ok(markup.includes(escapeHtml(value)));
      assert.ok(!markup.includes(value));
    }
  });

  await t.test("targeta de cançó", () => {
    const trackInfo = {
      title: specialText,
      artist: specialText,
      duration: 1,
      reproduccions: 1,
    };
    const markup = renderToStaticMarkup(createElement(SongCard, { trackInfo }));

    assert.ok(markup.includes(`<h1>${escapeHtml(trackInfo.title)}</h1>`));
    assert.ok(markup.includes(`<p>${escapeHtml(trackInfo.artist)}</p>`));
    assert.ok(!markup.includes(trackInfo.title));
    assert.ok(!markup.includes(trackInfo.artist));
  });
});

test("la funció de data retorna una data local amb format dia/mes/any", async () => {
  const { getCurrentDate } = await vite.ssrLoadModule("/src/Utils/currentDate.ts");
  const currentDate = getCurrentDate();

  assert.match(currentDate, /^\d{1,2}\/\d{1,2}\/\d{4}$/);

  const [day, month, year] = currentDate.split("/").map(Number);
  assert.ok(day >= 1 && day <= 31);
  assert.ok(month >= 1 && month <= 12);
  assert.ok(year >= 1);
});

test("les dades carregades tenen els camps necessaris per renderitzar", async () => {
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
  const playCountMatch = songMarkup.match(/<p>Reproduccions:(\d+)<\/p>$/);

  assert.ok(markup.includes("<header>"), "La pàgina ha de contenir la capçalera");
  assert.ok(matchingUser, "La capçalera ha de mostrar un usuari de la llista");
  assert.ok(matchingTrack, "La targeta ha de mostrar una cançó de la llista");
  assert.ok(playCountMatch, "La targeta ha de mostrar les reproduccions");
  assert.ok(Number(playCountMatch[1]) >= 0);
  assert.ok(Number(playCountMatch[1]) < 10205);

  const displayedDate = markup.match(/<p>Data: (\d{1,2}\/\d{1,2}\/\d{4})<\/p>/);
  assert.ok(displayedDate, "La capçalera ha de mostrar una data vàlida");
});
