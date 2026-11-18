const url = process.env.WORKSHOP_URL;
const code = process.env.WORKSHOP_ACCESS_CODE;
if (!url || !code) {
  console.error("Set WORKSHOP_URL and WORKSHOP_ACCESS_CODE in .env.");
  process.exit(1);
}

const ticket = process.argv.slice(2).join(" ") ||
  "I was charged twice for my membership dues and need this fixed before Friday.";
const endpoint = new URL("/triage", url);
if (endpoint.protocol !== "https:" &&
    !(endpoint.protocol === "http:" && endpoint.hostname === "localhost")) {
  throw new Error("Use an HTTPS workshop URL or http://localhost for local testing.");
}

const response = await fetch(endpoint, {
  method: "POST",
  headers: { Authorization: `Bearer ${code}`, "Content-Type": "text/plain; charset=utf-8" },
  body: ticket,
  redirect: "error",
});
if (!response.ok) {
  const body = await response.json().catch(() => ({}));
  console.error(body.error ?? `Workshop request failed (HTTP ${response.status}).`);
  process.exit(1);
}
console.log(JSON.stringify(await response.json(), null, 2));
