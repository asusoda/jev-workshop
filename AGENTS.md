# AGENTS.md

This is a small TypeScript starter for Jev, TypeSafe's decision model. Jev doesn't generate text. You send it a `state` (text, a JSON object, or an array) and named `questions`, and it returns one typed answer per question.

## Workshop projects

Help attendees build any tool or app they choose around Jev. Ticket triage is an example of the request and response flow. Use it to explain the pattern, then adapt the input, questions, and app behavior to the attendee's idea. Start with one decision and try both clear and ambiguous inputs.

The shared `POST /triage` endpoint runs the starter's fixed questions. For custom questions, adapt `src/examples/` and use the attendee's own TypeSafe key for live requests. Sample answers can be used while building the app logic.

## How to call Jev here

- For organizer-side calls, always import `jev` from `src/jev.ts`. It wraps the official `@typesafe-ai/sdk` client with a rate-limited queue. Never create a second `TypeSafeClient` and never call the TypeSafe API with raw `fetch`.
- Build questions with the SDK helpers `noul`, `choice` and `score` from `@typesafe-ai/sdk`. Answer types are inferred from them, so don't cast.
- Ask several questions about the same state in one `jev.systemOne` call instead of looping one question at a time.
- Don't fire large batches with `Promise.all`. The queue will hold them, but keep loops small during the workshop.
- The organizer sets `TYPESAFE_API_KEY` in the laptop's gitignored `.env` and forwards port 3000 over ngrok. Attendees use the public workshop URL and event code from `.env.example` to call `POST /triage` via `src/workshop.ts`. Keep the TypeSafe key and ngrok authtoken private.

## Question types

- `noul(instructions)`: yes/no. Answer: `{ noul }`, the probability of yes, 0 to 1.
- `choice(instructions, { key: description | null, ... })`: pick one, up to 255 options. Answer: `{ choice, confidence, probabilities }`.
- `score(instructions, [lowest, ..., highest])`: 2 to 10 ordered levels. Answer: `{ score, confidence, legend, probabilities }`. `score` is an expected level index and can be fractional.

Jev decides, your code acts. Use thresholds on `noul` and `confidence` to choose what the program does.

Examples live in `src/examples/`. Full docs: https://docs.typesafe.ai (index for agents: https://docs.typesafe.ai/llms.txt).

## Commands

```sh
npm start          # organizer's workshop server
npm run triage     # attendee's workshop command
npm test           # integration check with a TypeSafe stub
npm run dev        # direct SDK demo with your own TypeSafe key
npm run noul       # src/examples/noul.ts (same for choice, score)
npm run typecheck  # tsc --noEmit, run before you say something works
```

Run new scripts with `npx tsx --env-file=.env path/to/file.ts`.
