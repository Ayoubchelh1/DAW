import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import type { Track } from "../src/interfaces/track/track";
import { MAXARTIST, MAXTITOL } from "../src/interfaces/track/track.constants";
import { isValidTrack } from "../src/validatos/track.validator";

const validTrack: Track = {
    title: "Rattle and hum",
    artist: "U2",
    duration: 90
};

const databaseEnvironment = {
    DB_USER: "test",
    DB_PASSWORD: "test",
    DB_HOST: "localhost",
    DB_PORT: "1433",
    DB_NAME: "test",
    DB_ENCRYPT: "false",
    DB_TRUST_SERVER_CERTIFICATE: "true"
};

let server: Server;
let apiUrl: string;

before(async () => {
    Object.assign(process.env, databaseEnvironment);

    const { app } = await import("../src/app");
    server = app.listen(0, "127.0.0.1");

    await new Promise<void>((resolve, reject) => {
        server.once("listening", resolve);
        server.once("error", reject);
    });

    const address = server.address() as AddressInfo;
    apiUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
    if (!server) {
        return;
    }

    await new Promise<void>((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
        server.closeAllConnections();
    });
});

test("accepts valid track data, including the minimum duration", () => {
    assert.equal(isValidTrack(validTrack), true);
    assert.equal(isValidTrack({ ...validTrack, duration: 1 }), true);
});

test("accepts title and artist at their exact maximum lengths", () => {
    assert.equal(isValidTrack({ ...validTrack, title: "t".repeat(MAXTITOL) }), true);
    assert.equal(isValidTrack({ ...validTrack, artist: "a".repeat(MAXARTIST) }), true);
});

test("counts trimmed and repeated whitespace consistently", () => {
    assert.equal(isValidTrack({ ...validTrack, title: "  a   b  " }), true);
    assert.equal(isValidTrack({ ...validTrack, artist: "  a   b  " }), true);
});

test("rejects missing, empty, or whitespace-only title and artist", async (t) => {
    const invalidTracks: Array<[string, unknown]> = [
        ["missing title", { artist: validTrack.artist, duration: validTrack.duration }],
        ["missing artist", { title: validTrack.title, duration: validTrack.duration }],
        ["empty title", { ...validTrack, title: "" }],
        ["whitespace-only title", { ...validTrack, title: " \t\n " }],
        ["empty artist", { ...validTrack, artist: "" }],
        ["whitespace-only artist", { ...validTrack, artist: " \t\n " }]
    ];

    for (const [description, track] of invalidTracks) {
        await t.test(description, () => {
            assert.equal(isValidTrack(track), false);
        });
    }
});

test("rejects title and artist one character over their maximum lengths", () => {
    assert.equal(isValidTrack({ ...validTrack, title: "t".repeat(MAXTITOL + 1) }), false);
    assert.equal(isValidTrack({ ...validTrack, artist: "a".repeat(MAXARTIST + 1) }), false);
});

test("rejects invalid durations", async (t) => {
    const invalidDurations: Array<[string, unknown]> = [
        ["zero", 0],
        ["negative", -1],
        ["NaN", Number.NaN],
        ["positive infinity", Number.POSITIVE_INFINITY],
        ["string", "90"],
        ["null", null]
    ];

    for (const [description, duration] of invalidDurations) {
        await t.test(description, () => {
            assert.equal(isValidTrack({ ...validTrack, duration } as unknown), false);
        });
    }
});

test("rejects null, arrays, and non-object track values", async (t) => {
    for (const [description, value] of [
        ["null", null],
        ["array", []],
        ["string", "track"],
        ["number", 42]
    ] as const) {
        await t.test(description, () => {
            assert.equal(isValidTrack(value), false);
        });
    }
});

test("rejects non-string titles and artists instead of throwing", () => {
    assert.equal(isValidTrack({ ...validTrack, title: 123 } as unknown), false);
    assert.equal(isValidTrack({ ...validTrack, artist: false } as unknown), false);
});

test("serves the API metadata as a complete JSON object", async () => {
    const response = await fetch(`${apiUrl}/`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^application\/json\b/);

    const metadata = await response.json();
    assert.deepEqual(metadata, {
        name: "API Spotify",
        descripcio: "Manage Spotify functionality",
        host: "localhost",
        port: 3000,
        status: "Working",
        version: { major: 1, minor: 0, patch: 0 },
        resources: [
            { name: "Root end point", endPoint: "/" },
            { name: "Track (songs)", endPoint: "GET /tracks" }
        ]
    });
});

test("rejects invalid track creation requests with a 400 JSON response", async (t) => {
    const invalidBodies: Array<[string, unknown]> = [
        ["missing title", { artist: validTrack.artist, duration: validTrack.duration }],
        ["missing artist", { title: validTrack.title, duration: validTrack.duration }],
        ["empty title", { ...validTrack, title: "" }],
        ["numeric title", { ...validTrack, title: 123 }],
        ["title over maximum length", { ...validTrack, title: "t".repeat(MAXTITOL + 1) }],
        ["empty artist", { ...validTrack, artist: "" }],
        ["object artist", { ...validTrack, artist: {} }],
        ["artist over maximum length", { ...validTrack, artist: "a".repeat(MAXARTIST + 1) }],
        ["zero duration", { ...validTrack, duration: 0 }],
        ["string duration", { ...validTrack, duration: "90" }],
        ["null title", { ...validTrack, title: null }]
    ];

    for (const [description, body] of invalidBodies) {
        await t.test(description, async () => {
            const response = await fetch(`${apiUrl}/tracks`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(body)
            });

            assert.equal(response.status, 400);
            assert.match(response.headers.get("content-type") ?? "", /^application\/json\b/);
            assert.deepEqual(await response.json(), { message: "invalid data" });
        });
    }
});

test("rejects invalid track updates before making a database connection", async () => {
    const response = await fetch(`${apiUrl}/tracks/not-a-uuid`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...validTrack, duration: 0 })
    });

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { message: "invalid data" });
});

test("returns 400 for malformed JSON", async () => {
    for (const body of ['{"title":', "null"]) {
        const response = await fetch(`${apiUrl}/tracks`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body
        });

        assert.equal(response.status, 400);
    }
});

test("returns 404 for an unregistered route", async () => {
    const response = await fetch(`${apiUrl}/route-that-does-not-exist`);
    assert.equal(response.status, 404);
});
