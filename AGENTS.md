# AGENTS.md

This is a small TypeScript starter for Jev, TypeSafe's decision model. Jev doesn't generate text. You send it a `state` (text, a JSON object, or an array) and named `questions`, and it returns one typed answer per question.

## How to call Jev here

- Always import `jev` from `src/jev.ts`. It wraps the official `@typesafe-ai/sdk` client with a rate limited queue, because everyone in the workshop shares one API key. Never create a second `TypeSafeClient` and never call the API with raw `fetch`.
- Build questions with the SDK helpers `noul`, `choice` and `score` from `@typesafe-ai/sdk`. Answer types are inferred from them, so don't cast.
- Ask several questions about the same state in one `jev.systemOne` call instead of looping one question at a time.
- Don't fire large batches with `Promise.all`. The queue will hold them, but keep loops small during the workshop.
- The key comes from `TYPESAFE_API_KEY` in `.env`. Never print it or commit it.

## Question types

- `noul(instructions)`: yes/no. Answer: `{ noul }`, the probability of yes, 0 to 1.
- `choice(instructions, { key: description | null, ... })`: pick one, up to 255 options. Answer: `{ choice, confidence, probabilities }`.
- `score(instructions, [lowest, ..., highest])`: 2 to 10 ordered levels. Answer: `{ score, confidence, legend, probabilities }`. `score` is an expected level index and can be fractional.

Jev decides, your code acts. Use thresholds on `noul` and `confidence` to choose what the program does.

Examples live in `src/examples/`. Full docs: https://docs.typesafe.ai (index for agents: https://docs.typesafe.ai/llms.txt).

## Commands

```sh
npm run dev        # src/index.ts
npm run noul       # src/examples/noul.ts (same for choice, score)
npm run typecheck  # tsc --noEmit, run before you say something works
```

Run new scripts with `npx tsx --env-file=.env path/to/file.ts`.
