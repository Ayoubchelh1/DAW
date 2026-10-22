import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { escapeHtml, vite } from "./testSetup.mjs";

test("la capçalera mostra els valors que rep com a propietats", async () => {
  const { default: Header } = await vite.ssrLoadModule("/src/components/Header/Header.tsx");
  const { users } = await vite.ssrLoadModule("/src/Data/user.ts");
  const user = users[0];
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

test("la capçalera escapa els caràcters especials de les propietats", async () => {
  const { default: Header } = await vite.ssrLoadModule("/src/components/Header/Header.tsx");
  const value = `Text <>&"' ${Date.now()}`;
  const props = { title: value, user: value, date: value };
  const markup = renderToStaticMarkup(createElement(Header, props));

  for (const property of Object.values(props)) {
    assert.ok(markup.includes(escapeHtml(property)));
    assert.ok(!markup.includes(property));
  }
});
