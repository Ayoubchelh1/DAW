import assert from "node:assert/strict";
import { after, before, mock, test } from "node:test";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { randomUUID } from "node:crypto";
import sql from "mssql";
import type { Track } from "../interfaces/track/track";
import { MAXARTIST, MAXTITOL } from "../interfaces/track/track.constants";
import { isValidTrack } from "../validatos/track.validator";
import { countries } from "../data/country/country";
import { users } from "../data/user/user";

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

const sqlRecords = new Map<string, Array<Record<string, unknown>>>([
    ["Track", []],
    ["User", []]
]);

const testConnectionPool = {
    request() {
        const inputs: Record<string, unknown> = {};

        return {
            input(name: string, _type: unknown, value: unknown) {
                inputs[name] = value;
                return this;
            },
            async query(queryText: string) {
                const table = queryText.toLowerCase().includes("[user]") ? "User" : "Track";
                const records = sqlRecords.get(table)!;
                const id = inputs.id;

                if (queryText.toLowerCase().startsWith("select")) {
                    const recordset = queryText.toLowerCase().includes("where")
                        ? records.filter((record) => record.id === id)
                        : [...records];
                    return { recordset, rowsAffected: [] };
                }

                if (queryText.toLowerCase().startsWith("insert")) {
                    const record = table === "Track"
                        ? {
                            id: randomUUID(),
                            title: inputs.title,
                            artist: inputs.artist_id,
                            duration: inputs.duration
                        }
                        : {
                            id: randomUUID(),
                            email: inputs.email,
                            countryId: inputs.countryId
                        };
                    records.push(record);
                    return { recordset: [], rowsAffected: [1] };
                }

                if (queryText.toLowerCase().startsWith("update")) {
                    const record = records.find((entry) => entry.id === id);
                    if (record) {
                        Object.assign(record, {
                            title: inputs.title,
                            artist: inputs.artist_id,
                            duration: inputs.duration
                        });
                    }
                    return { recordset: [], rowsAffected: [record ? 1 : 0] };
                }

                if (queryText.toLowerCase().startsWith("delete")) {
                    const index = records.findIndex((entry) => entry.id === id);
                    if (index !== -1) records.splice(index, 1);
                    return { recordset: [], rowsAffected: [index === -1 ? 0 : 1] };
                }

                throw new Error(`Unexpected SQL in test: ${queryText}`);
            }
        };
    }
};

before(async () => {
    Object.assign(process.env, databaseEnvironment);
    mock.method(sql, "connect", async () => testConnectionPool as never);

    const { app } = await import("../app.js");
    server = app.listen(0, "127.0.0.1");

    await new Promise<void>((resolve, reject) => {
        server.once("listening", resolve);
        server.once("error", reject);
    });

    const address = server.address() as AddressInfo;
    apiUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
    mock.restoreAll();
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

test("GET, POST, and PUT countries return and update records", async (t) => {
    let createdId: string | undefined;

    try {
        const listResponse = await fetch(`${apiUrl}/countries`);
        assert.equal(listResponse.status, 200);
        assert.ok(Array.isArray(await listResponse.json()));

        const createResponse = await fetch(`${apiUrl}/countries`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ name: " Test Country " })
        });
        assert.equal(createResponse.status, 201);
        const createdResult = await createResponse.json();
        assert.equal(createdResult.success, true);
        assert.equal(createdResult.data.name, "Test Country");
        createdId = createdResult.data.id;

        const getResponse = await fetch(`${apiUrl}/countries/${createdId}`);
        assert.equal(getResponse.status, 200);
        assert.deepEqual(await getResponse.json(), createdResult.data);

        const updateResponse = await fetch(`${apiUrl}/countries/${createdId}`, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ name: "Updated Country" })
        });
        assert.equal(updateResponse.status, 200);
        assert.equal((await updateResponse.json()).name, "Updated Country");
    } finally {
        if (createdId) {
            const index = countries.findIndex((country) => country.id === createdId);
            if (index !== -1) countries.splice(index, 1);
        }
    }
});

test("GET, POST, PUT, and DELETE artists work through the API", async () => {
    let createdId: string | undefined;

    try {
        const listResponse = await fetch(`${apiUrl}/artists`);
        assert.equal(listResponse.status, 200);
        assert.ok(Array.isArray(await listResponse.json()));

        const createResponse = await fetch(`${apiUrl}/artists`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                artistName: "Test Artist",
                realName: "Test Real Name",
                country: "246"
            })
        });
        assert.equal(createResponse.status, 201);
        const created = (await createResponse.json()).data;
        createdId = created.id;
        assert.equal(created.country, "246");

        const getResponse = await fetch(`${apiUrl}/artists/${createdId}`);
        assert.equal(getResponse.status, 200);
        assert.deepEqual(await getResponse.json(), created);

        const updateResponse = await fetch(`${apiUrl}/artists/${createdId}`, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                artistName: "Updated Artist",
                realName: "Updated Real Name",
                country: "246"
            })
        });
        assert.equal(updateResponse.status, 200);
        assert.equal((await updateResponse.json()).artistName, "Updated Artist");

        const deleteResponse = await fetch(`${apiUrl}/artists/${createdId}`, { method: "DELETE" });
        assert.equal(deleteResponse.status, 204);
        createdId = undefined;
    } finally {
        if (createdId) {
            const { artists } = await import("../data/artist/artist.js");
            const index = artists.findIndex((artist) => artist.id === createdId);
            if (index !== -1) artists.splice(index, 1);
        }
    }
});

test("GET, POST, PUT, and DELETE albums work through the API", async () => {
    let createdId: string | undefined;

    try {
        const listResponse = await fetch(`${apiUrl}/albums`);
        assert.equal(listResponse.status, 200);
        assert.ok(Array.isArray(await listResponse.json()));

        const createResponse = await fetch(`${apiUrl}/albums`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ name: "Test Album", artistId: "1", date: "2026-01-01" })
        });
        assert.equal(createResponse.status, 201);
        const created = await createResponse.json();
        createdId = created.id;
        assert.equal(created.name, "Test Album");

        const getResponse = await fetch(`${apiUrl}/albums/${createdId}`);
        assert.equal(getResponse.status, 200);
        assert.deepEqual(await getResponse.json(), created);

        const updateResponse = await fetch(`${apiUrl}/albums/${createdId}`, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ name: "Updated Album", artistId: "1", date: "2026-02-01" })
        });
        assert.equal(updateResponse.status, 200);
        assert.equal((await updateResponse.json()).name, "Updated Album");

        const deleteResponse = await fetch(`${apiUrl}/albums/${createdId}`, { method: "DELETE" });
        assert.equal(deleteResponse.status, 204);
        createdId = undefined;
    } finally {
        if (createdId) {
            const { albums } = await import("../data/album/album.js");
            const index = albums.findIndex((album) => album.id === createdId);
            if (index !== -1) albums.splice(index, 1);
        }
    }
});

test("GET, POST, PUT, and DELETE playlists work through the API", async () => {
    let createdId: string | undefined;

    try {
        const listResponse = await fetch(`${apiUrl}/playlists`);
        assert.equal(listResponse.status, 200);
        assert.ok(Array.isArray(await listResponse.json()));

        const createResponse = await fetch(`${apiUrl}/playlists`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ title: "Test Playlist", userId: "4984" })
        });
        assert.equal(createResponse.status, 201);
        const created = await createResponse.json();
        createdId = created.id;
        assert.equal(created.title, "Test Playlist");

        const getResponse = await fetch(`${apiUrl}/playlists/${createdId}`);
        assert.equal(getResponse.status, 200);
        assert.deepEqual(await getResponse.json(), created);

        const updateResponse = await fetch(`${apiUrl}/playlists/${createdId}`, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ title: "Updated Playlist", userId: "4984" })
        });
        assert.equal(updateResponse.status, 200);
        assert.equal((await updateResponse.json()).title, "Updated Playlist");

        const deleteResponse = await fetch(`${apiUrl}/playlists/${createdId}`, { method: "DELETE" });
        assert.equal(deleteResponse.status, 204);
        createdId = undefined;
    } finally {
        if (createdId) {
            const { playlists } = await import("../data/playlist/playlist.js");
            const index = playlists.findIndex((playlist) => playlist.id === createdId);
            if (index !== -1) playlists.splice(index, 1);
        }
    }
});

test("GET, POST, and PUT history records work through the API", async () => {
    let createdId: string | undefined;

    try {
        const listResponse = await fetch(`${apiUrl}/history`);
        assert.equal(listResponse.status, 200);
        assert.ok(Array.isArray(await listResponse.json()));

        const createResponse = await fetch(`${apiUrl}/history`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ userId: "4984", trackId: "3456", date: "2026-01-01" })
        });
        assert.equal(createResponse.status, 201);
        const created = await createResponse.json();
        createdId = created.id;

        const getResponse = await fetch(`${apiUrl}/history/${createdId}`);
        assert.equal(getResponse.status, 200);
        assert.deepEqual(await getResponse.json(), created);

        const updateResponse = await fetch(`${apiUrl}/history/${createdId}`, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ userId: "4984", trackId: "3499", date: "2026-02-01" })
        });
        assert.equal(updateResponse.status, 200);
        assert.equal((await updateResponse.json()).trackId, "3499");
    } finally {
        if (createdId) {
            const { history } = await import("../data/history/history.js");
            const index = history.findIndex((record) => record.id === createdId);
            if (index !== -1) history.splice(index, 1);
        }
    }
});

test("GET, POST, and DELETE playlist tracks work through the API", async () => {
    let createdId: string | undefined;

    try {
        const listResponse = await fetch(`${apiUrl}/playlisttracks`);
        assert.equal(listResponse.status, 200);
        assert.ok(Array.isArray(await listResponse.json()));

        const createResponse = await fetch(`${apiUrl}/playlisttracks`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ playlistId: "1", trackId: "3499" })
        });
        assert.equal(createResponse.status, 201);
        const created = await createResponse.json();
        createdId = created.id;

        const getResponse = await fetch(`${apiUrl}/playlisttracks/${createdId}`);
        assert.equal(getResponse.status, 200);
        assert.deepEqual(await getResponse.json(), created);

        const deleteResponse = await fetch(`${apiUrl}/playlisttracks/${createdId}`, { method: "DELETE" });
        assert.equal(deleteResponse.status, 204);
        createdId = undefined;
    } finally {
        if (createdId) {
            const { playlistTracks } = await import("../data/playlistTrack/playlistTrack.js");
            const index = playlistTracks.findIndex((record) => record.id === createdId);
            if (index !== -1) playlistTracks.splice(index, 1);
        }
    }
});

test("POST and DELETE album tracks work through the API", async () => {
    let createdId: string | undefined;

    try {
        const createResponse = await fetch(`${apiUrl}/albumtracks`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ albumId: "1", trackId: "3499" })
        });
        assert.equal(createResponse.status, 201);
        const created = await createResponse.json();
        createdId = created.id;

        const deleteResponse = await fetch(`${apiUrl}/albumtracks/${createdId}`, { method: "DELETE" });
        assert.equal(deleteResponse.status, 204);
        createdId = undefined;
    } finally {
        if (createdId) {
            const { albumTracks } = await import("../data/albumTrack/albumTrack.js");
            const index = albumTracks.findIndex((record) => record.id === createdId);
            if (index !== -1) albumTracks.splice(index, 1);
        }
    }
});

test("PUT and DELETE users operate on the matching user record", async () => {
    const testUserId = `test-${Date.now()}`;
    users.push({ id: testUserId, email: "before@example.test", countryId: "246" });

    try {
        const updateResponse = await fetch(`${apiUrl}/users/${testUserId}`, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email: "after@example.test", countryId: "246" })
        });
        assert.equal(updateResponse.status, 200);
        assert.deepEqual(await updateResponse.json(), {
            id: testUserId,
            email: "after@example.test",
            countryId: "246"
        });

        const deleteResponse = await fetch(`${apiUrl}/users/${testUserId}`, { method: "DELETE" });
        assert.equal(deleteResponse.status, 204);
        users.splice(users.findIndex((user) => user.id === testUserId), 1);
    } finally {
        const index = users.findIndex((user) => user.id === testUserId);
        if (index !== -1) users.splice(index, 1);
    }
});

test("GET and POST users return the records stored by the service", async () => {
    const email = `test-${Date.now()}@example.test`;

    const createResponse = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, countryId: "246" })
    });
    assert.equal(createResponse.status, 201);

    const listResponse = await fetch(`${apiUrl}/users`);
    assert.equal(listResponse.status, 200);
    const listedUsers = await listResponse.json();
    const created = listedUsers.find((user: { email: string }) => user.email === email);
    assert.ok(created);

    const getResponse = await fetch(`${apiUrl}/users/${created.id}`);
    assert.equal(getResponse.status, 200);
    const result = await getResponse.json();
    assert.equal(result.success, true);
    assert.equal(result.data.email, email);
});

test("GET, POST, PUT, and DELETE tracks work through the API", async () => {
    const title = `CRUD test ${randomUUID()}`;
    let createdId: string | undefined;

    const listBeforeResponse = await fetch(`${apiUrl}/tracks`);
    assert.equal(listBeforeResponse.status, 200);
    assert.ok(Array.isArray(await listBeforeResponse.json()));

    const createResponse = await fetch(`${apiUrl}/tracks`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, artist: "test-artist", duration: 90 })
    });
    assert.equal(createResponse.status, 201);
    assert.deepEqual(await createResponse.json(), { success: true, code: 201, data: 1 });

    try {
        const listAfterResponse = await fetch(`${apiUrl}/tracks`);
        assert.equal(listAfterResponse.status, 200);
        const created = (await listAfterResponse.json()).find((track: Track & { id: string }) => track.title === title);
        assert.ok(created);
        createdId = created.id;

        const getResponse = await fetch(`${apiUrl}/tracks/${createdId}`);
        assert.equal(getResponse.status, 200);
        assert.deepEqual((await getResponse.json()).data, created);

        const updatedTitle = `${title} updated`;
        const updateResponse = await fetch(`${apiUrl}/tracks/${createdId}`, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ title: updatedTitle, artist: "test-artist", duration: 120 })
        });
        assert.equal(updateResponse.status, 200);
        assert.equal((await updateResponse.json()).data, 1);

        const getUpdatedResponse = await fetch(`${apiUrl}/tracks/${createdId}`);
        assert.equal((await getUpdatedResponse.json()).data.title, updatedTitle);

        const deleteResponse = await fetch(`${apiUrl}/tracks/${createdId}`, { method: "DELETE" });
        assert.equal(deleteResponse.status, 204);
        createdId = undefined;
    } finally {
        if (createdId) {
            const records = sqlRecords.get("Track")!;
            const index = records.findIndex((record) => record.id === createdId);
            if (index !== -1) records.splice(index, 1);
        }
    }
});
