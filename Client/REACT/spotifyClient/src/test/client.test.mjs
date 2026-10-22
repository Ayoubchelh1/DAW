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

test("renders the header with the exact title, user, and date", async () => {
  const { default: Header } = await vite.ssrLoadModule("/src/components/Header/Header.tsx");
  const markup = renderToStaticMarkup(
    createElement(Header, { title: "Spotify", user: "Anna", date: "9/2/2024" }),
  );

  assert.equal(
    markup,
    "<header><h1>Spotify</h1><p>Usuari: Anna</p><p>Data: 9/2/2024</p></header>",
  );
});

test("escapes user-provided header text instead of rendering it as HTML", async () => {
  const { default: Header } = await vite.ssrLoadModule("/src/components/Header/Header.tsx");
  const markup = renderToStaticMarkup(
    createElement(Header, {
      title: "<Spotify>",
      user: "<script>alert(1)</script>",
      date: "1/1/2024",
    }),
  );

  assert.equal(
    markup,
    "<header><h1>&lt;Spotify&gt;</h1><p>Usuari: &lt;script&gt;alert(1)&lt;/script&gt;</p><p>Data: 1/1/2024</p></header>",
  );
});

test("renders all track details and play count", async () => {
  const { default: SongCard } = await vite.ssrLoadModule("/src/components/Songs/SongCard.tsx");
  const markup = renderToStaticMarkup(
    createElement(SongCard, {
      trackInfo: {
        title: "Rattle and hum",
        artist: "U2",
        duration: 90,
        reproduccions: 5102,
      },
    }),
  );

  assert.equal(
    markup,
    "<h1>Rattle and hum</h1><p>U2</p><p>Duracio:90</p><p>Reproduccions:5102</p>",
  );
});

test("renders zero duration and play count without hiding either value", async () => {
  const { default: SongCard } = await vite.ssrLoadModule("/src/components/Songs/SongCard.tsx");
  const markup = renderToStaticMarkup(
    createElement(SongCard, {
      trackInfo: { title: "Silent track", artist: "Test", duration: 0, reproduccions: 0 },
    }),
  );

  assert.equal(
    markup,
    "<h1>Silent track</h1><p>Test</p><p>Duracio:0</p><p>Reproduccions:0</p>",
  );
});

test("escapes track text instead of rendering it as HTML", async () => {
  const { default: SongCard } = await vite.ssrLoadModule("/src/components/Songs/SongCard.tsx");
  const markup = renderToStaticMarkup(
    createElement(SongCard, {
      trackInfo: {
        title: "<img src=x>",
        artist: "<script>alert(1)</script>",
        duration: 10,
        reproduccions: 1,
      },
    }),
  );

  assert.equal(
    markup,
    "<h1>&lt;img src=x&gt;</h1><p>&lt;script&gt;alert(1)&lt;/script&gt;</p><p>Duracio:10</p><p>Reproduccions:1</p>",
  );
});

test("formats local dates correctly across month and leap-year boundaries", async () => {
  const { getCurrentDate } = await vite.ssrLoadModule("/src/Utils/currentDate.ts");
  const RealDate = globalThis.Date;

  const dateCases = [
    { year: 2024, month: 1, day: 29, expected: "29/2/2024" },
    { year: 2023, month: 11, day: 31, expected: "31/12/2023" },
    { year: 2025, month: 0, day: 1, expected: "1/1/2025" },
  ];

  try {
    for (const { year, month, day, expected } of dateCases) {
      globalThis.Date = class extends RealDate {
        constructor(...args) {
          if (args.length === 0) {
            super(year, month, day, 12);
          } else {
            super(...args);
          }
        }
      };

      assert.equal(getCurrentDate(), expected);
    }
  } finally {
    globalThis.Date = RealDate;
  }
});

test("selects the first user and track and allows a zero play count", async () => {
  const { default: App } = await vite.ssrLoadModule("/src/App.tsx");
  const originalRandom = Math.random;

  try {
    Math.random = () => 0;
    const markup = renderToStaticMarkup(createElement(App));

    assert.match(markup, /Usuari: Anna/);
    assert.match(markup, /<h1>Rattle and hum<\/h1>/);
    assert.match(markup, /<p>Duracio:90<\/p>/);
    assert.match(markup, /<p>Reproduccions:0<\/p>/);
  } finally {
    Math.random = originalRandom;
  }
});

test("selects the last user and track and keeps play count below its upper limit", async () => {
  const { default: App } = await vite.ssrLoadModule("/src/App.tsx");
  const originalRandom = Math.random;

  try {
    Math.random = () => 0.999999;
    const markup = renderToStaticMarkup(createElement(App));

    assert.match(markup, /Usuari: Pol/);
    assert.match(markup, /<h1>sunday bloody sunday<\/h1>/);
    assert.match(markup, /<p>Duracio:180<\/p>/);
    assert.match(markup, /<p>Reproduccions:10204<\/p>/);
  } finally {
    Math.random = originalRandom;
  }
});

test("keeps the displayed track fields consistent with the selected source track", async () => {
  const [{ default: App }, { tracks }] = await Promise.all([
    vite.ssrLoadModule("/src/App.tsx"),
    vite.ssrLoadModule("/src/Data/track.ts"),
  ]);
  const originalRandom = Math.random;
  const selectedTrackIndex = 1;
  const randomValues = [0, (selectedTrackIndex + 0.1) / tracks.length, 0];
  let randomIndex = 0;

  try {
    Math.random = () => randomValues[randomIndex++];
    const markup = renderToStaticMarkup(createElement(App));
    const selectedTrack = tracks[selectedTrackIndex];

    assert.match(markup, new RegExp(`<h1>${selectedTrack.title}</h1>`));
    assert.match(markup, new RegExp(`<p>${selectedTrack.artist}</p>`));
    assert.match(markup, new RegExp(`<p>Duracio:${selectedTrack.duration}</p>`));
  } finally {
    Math.random = originalRandom;
  }
});

test("restores the random source after deterministic app rendering", async () => {
  const { default: App } = await vite.ssrLoadModule("/src/App.tsx");
  const originalRandom = Math.random;

  try {
    Math.random = () => 0;
    renderToStaticMarkup(createElement(App));
  } finally {
    Math.random = originalRandom;
  }

  assert.equal(Math.random, originalRandom);
});

test("formats the current date using the host's local calendar date", async () => {
  const { getCurrentDate } = await vite.ssrLoadModule("/src/Utils/currentDate.ts");
  const current = new Date();
  const expected = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

  assert.equal(getCurrentDate(), expected);
});

test("provides the expected sample users and tracks", async () => {
  const [{ users }, { tracks }] = await Promise.all([
    vite.ssrLoadModule("/src/Data/user.ts"),
    vite.ssrLoadModule("/src/Data/track.ts"),
  ]);

  assert.deepEqual(users, [
    { name: "Anna" },
    { name: "Marc" },
    { name: "Laia" },
    { name: "Pol" },
  ]);
  assert.deepEqual(tracks, [
    { title: "Rattle and hum", artist: "U2", duration: 90 },
    { title: "sunday bloody sunday", artist: "U2", duration: 180 },
  ]);
});

test("selects the expected user and track and creates an in-range play count", async () => {
  const { default: App } = await vite.ssrLoadModule("/src/App.tsx");
  const originalRandom = Math.random;
  const randomValues = [0.75, 0.99, 0.5];
  let randomIndex = 0;

  try {
    Math.random = () => {
      assert.ok(randomIndex < randomValues.length, "App should only request three random values");
      return randomValues[randomIndex++];
    };

    const markup = renderToStaticMarkup(createElement(App));

    assert.equal(randomIndex, 3);
    assert.match(markup, /Usuari: Pol/);
    assert.match(markup, /<h1>sunday bloody sunday<\/h1>/);
    assert.match(markup, /<p>U2<\/p>/);
    assert.match(markup, /<p>Duracio:180<\/p>/);
    assert.match(markup, /<p>Reproduccions:5102<\/p>/);
  } finally {
    Math.random = originalRandom;
  }
});
