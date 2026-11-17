import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { once } from "node:events";
import { test } from "node:test";
import { promisify } from "node:util";

test("attendee triage uses the organizer key in one upstream request", async (t) => {
  process.env.PORT = "0";
  process.env.HOST = "localhost";
  process.env.TYPESAFE_BASE_URL = "https://typesafe.test";
  process.env.TYPESAFE_API_KEY = "organizer-test-key";
  process.env.WORKSHOP_ACCESS_CODE = "workshop-test-code";
  let upstreamCalls = 0;
  const result = {
    model: "jev-test",
    answers: {
      urgent: { type: "noul", noul: 0.9 },
      team: {
        type: "choice", choice: "treasurer", confidence: 1,
        probabilities: { treasurer: 1, tech: 0, events: 0 },
      },
      frustration: {
        type: "score", score: 1, confidence: 1,
        legend: { 0: "Calm", 1: "Annoyed", 2: "Very upset" },
        probabilities: { 0: 0, 1: 1, 2: 0 },
      },
    },
    usage: { input_tokens: 100, output_tokens: 10 },
  };
  const localFetch = globalThis.fetch;
  t.mock.method(globalThis, "fetch", async (input: string | URL | Request, init?: RequestInit) => {
    const url = new URL(String(input));
    if (url.hostname === "localhost") return localFetch(input, init);
    upstreamCalls++;
    assert.equal(url.href, "https://typesafe.test/v1/systemone");
    assert.equal(new Headers(init?.headers).get("authorization"), "Bearer organizer-test-key");
    assert(typeof init?.body === "string");
    const request = JSON.parse(init.body);
    assert.equal(request.state, "I was charged twice");
    assert.deepEqual(Object.keys(request.questions), ["urgent", "team", "frustration"]);
    return Response.json(result);
  });

  const { server } = await import("../src/server.js");
  t.after(() => server.close());
  if (!server.listening) await once(server, "listening");
  const address = server.address();
  assert(address && typeof address === "object");
  const url = `http://localhost:${address.port}`;
  const post = (body: string, code = "workshop-test-code", type = "text/plain") =>
    fetch(`${url}/triage`, {
      method: "POST",
      body,
      headers: { Authorization: `Bearer ${code}`, "Content-Type": type },
    });

  assert.equal((await post("ticket", "wrong")).status, 401);
  assert.equal((await post("ticket", "workshop-test-code", "application/json")).status, 415);
  assert.equal((await post("   ")).status, 400);
  assert.equal((await post("x".repeat(4097))).status, 413);
  assert.equal(upstreamCalls, 0);

  const { stdout } = await promisify(execFile)(
    process.execPath,
    ["--import", "tsx", "src/workshop.ts", "I was charged twice"],
    { env: { ...process.env, TYPESAFE_API_KEY: "", WORKSHOP_URL: url }, timeout: 5000 },
  );
  assert.deepEqual(JSON.parse(stdout), result);
  assert.equal(upstreamCalls, 1);
});
