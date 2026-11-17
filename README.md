# jev-workshop

Starter repo for the SoDA Jev workshop. It has a typed client for [Jev](https://docs.typesafe.ai), TypeSafe's decision model, plus one working example for each question type: noul, choice and score. You build your own idea on top of it with an AI agent.

## Setup (5 min)

1. Fork this repo (top right, Fork).
2. On your fork, click Code, then Codespaces, then Create codespace on main. Give it a minute, it installs everything and makes a `.env` for you.
3. Open `.env` and paste the workshop key after `TYPESAFE_API_KEY=`. Don't commit it, `.env` is already gitignored.
4. Run `npm run dev` in the terminal. If you see a team, an urgency number and a frustration score, you're good.

No Codespaces? Any machine with Node 22+ works: clone, `npm install`, `cp .env.example .env`, add the key, `npm run dev`.

## What's in here

`src/index.ts` asks all three question types about one message in one request. Start here.

`src/examples/` has one file per question type with a real input and an example output in the comments. Run them with `npm run noul`, `npm run choice` and `npm run score`.

`src/jev.ts` is the shared client. Use `jev` from there for every call, don't make your own client.

Quick version of the three types: noul is a yes/no question and gives you the probability of yes. Choice picks one option from a list you give it and gives you a probability for each option plus a confidence. Score places the input on an ordered scale of 2 to 10 levels you write, lowest first, and gives you the expected level (can be fractional, like 1.7). Answers are fully typed, so `answers.team.choice` is `"treasurer" | "events" | "tech"` and not just `string`.

## Sharing the key

The whole room is on one API key, so `src/jev.ts` keeps each of us polite. It allows at most 2 requests in flight and spaces them 300ms apart (change with `JEV_MAX_CONCURRENT` and `JEV_MIN_GAP_MS` in `.env`). If the API says 429 (too many requests) or 529 (overloaded), the client waits and retries with backoff, up to 6 times. If you see `jev: rate limited, backing off...`, that's it working, just wait.

Also, put all your questions about one input in a single request instead of one request per question. Cheaper and lighter on the key.

## Build with an agent

Open your agent (Copilot chat in Codespaces, Claude Code, Cursor, whatever) and tell it what you want to build. `AGENTS.md` already tells it how this repo works. For better results, install TypeSafe's own skill first so the agent knows Jev well:

```sh
npx skills add typesafe-ai/skills --skill typesafe-ai
```

Some ideas: sort club Discord messages into channels, flag spam in a group chat, grade hackathon pitches, triage GitHub issues, decide if an email needs a reply today.

## Docs

- Jev docs: https://docs.typesafe.ai
- Question types: https://docs.typesafe.ai/primitives
- JS SDK: https://docs.typesafe.ai/sdk/javascript
