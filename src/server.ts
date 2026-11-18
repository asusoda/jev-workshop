import { createHash, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";
import { APIError } from "@typesafe-ai/sdk";
import { triage } from "./triage.js";

const accessCode = process.env.WORKSHOP_ACCESS_CODE;
if (!accessCode) throw new Error("Set WORKSHOP_ACCESS_CODE before starting the server.");

const digest = (value: string) => createHash("sha256").update(value).digest();
const expectedAuth = digest(`Bearer ${accessCode}`);
const maxTicketBytes = 4096;
// shortcut: process-local admission limit, use shared limits if running multiple instances
const maxPending = 24;
let pending = 0;

export const server = createServer(async (req, res) => {
  const json = (status: number, body: unknown) => {
    res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(body));
  };

  if (req.method !== "POST" || req.url !== "/triage") {
    return json(404, { error: "Use POST /triage." });
  }
  if (!timingSafeEqual(digest(req.headers.authorization ?? ""), expectedAuth)) {
    return json(401, { error: "Check your workshop access code." });
  }
  if (req.headers["content-type"]?.split(";")[0].trim().toLowerCase() !== "text/plain") {
    return json(415, { error: "Send the ticket as text/plain." });
  }
  if (pending >= maxPending) {
    return json(503, { error: "The workshop queue is full. Try again shortly." });
  }

  pending++;
  try {
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of req.iterator({ destroyOnReturn: false })) {
      size += chunk.length;
      if (size > maxTicketBytes) {
        res.setHeader("Connection", "close");
        return json(413, { error: "Tickets must be at most 4096 bytes." });
      }
      chunks.push(chunk);
    }
    const ticket = Buffer.concat(chunks).toString("utf8").trim();
    if (!ticket) return json(400, { error: "Enter a ticket." });

    const { model, answers, usage } = await triage(ticket);
    json(200, { model, answers, usage });
  } catch (error) {
    if (res.destroyed) return;
    const upstreamStatus = error instanceof APIError ? error.status : undefined;
    console.error("Jev triage failed", upstreamStatus ?? "connection or request error");
    const message = upstreamStatus === 402
      ? "The workshop's TypeSafe credits are unavailable. Tell the organizer."
      : "Jev is unavailable. Try again shortly.";
    json(502, { error: message });
  } finally {
    pending--;
  }
});

server.requestTimeout = 15_000;
server.listen(Number(process.env.PORT ?? 3000), process.env.HOST ?? "0.0.0.0", () => {
  const address = server.address();
  if (address && typeof address === "object") {
    console.log(`Workshop server listening on port ${address.port}`);
  }
});
