// Shared Jev client. Every call in this repo goes through `jev`.
//
// The whole room shares one API key, so this client is polite on purpose:
// - at most JEV_MAX_CONCURRENT requests in flight from this process
// - at least JEV_MIN_GAP_MS between request starts
// - on 429 / 529 the SDK backs off (exponential + jitter, honors Retry-After)
//   and the retry goes back through the same queue

import { TypeSafeClient } from "@typesafe-ai/sdk";

const maxConcurrent = Number(process.env.JEV_MAX_CONCURRENT ?? 2);
const minGapMs = Number(process.env.JEV_MIN_GAP_MS ?? 300);

if (!process.env.TYPESAFE_API_KEY) {
  console.error("Direct Jev calls require TYPESAFE_API_KEY.");
  process.exit(1);
}

let active = 0;
let nextStart = 0;
const waiting: (() => void)[] = [];

async function acquire() {
  if (active >= maxConcurrent) await new Promise<void>((resolve) => waiting.push(resolve));
  active++;
  const now = Date.now();
  const wait = Math.max(0, nextStart - now);
  nextStart = Math.max(now, nextStart) + minGapMs;
  if (wait) await new Promise((r) => setTimeout(r, wait));
}

function release() {
  active--;
  waiting.shift()?.();
}

async function queuedFetch(input: string, init?: RequestInit) {
  await acquire();
  try {
    const res = await fetch(input, init);
    if (res.status === 429) console.warn("jev: rate limited, backing off...");
    return res;
  } finally {
    release();
  }
}

export const jev = new TypeSafeClient({
  defaultModel: "jev-latest",
  fetch: queuedFetch,
  timeout: 20_000,
  retry: {
    maxRetries: 6,
    backoffInitialMs: 1_000,
    backoffMaxMs: 20_000,
    backoffJitter: 0.5,
  },
});
