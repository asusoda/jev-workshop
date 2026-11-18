# jev-workshop

Build any tool or app you want around [Jev](https://docs.typesafe.ai), TypeSafe's decision model. Ticket triage is a starter example that shows how to send input, ask three kinds of questions, and use the answers in your code.

## Setup (5 min)

1. Fork this repo (top right, Fork).
2. On your fork, select the workshop branch, then click **Code → Codespaces → Create codespace**. Setup installs dependencies and copies the public workshop URL and code from `.env.example` into `.env`.
3. Run `npm run triage` in the terminal. Try your own input with `npm run triage -- "I was charged twice for dues"`. Look for a Jev model name and the `urgent`, `team`, and `frustration` answers. Leave `TYPESAFE_API_KEY` blank.

On a machine with Node 22+, clone the workshop branch and run `npm ci`, `cp .env.example .env`, and `npm run triage`. If the organizer changes the public settings, update `WORKSHOP_URL` and `WORKSHOP_ACCESS_CODE` in any existing `.env`.

Run `npm test` for the local integration check with a TypeSafe stub and `npm run typecheck` for the TypeScript check.

## What's in here

`src/workshop.ts` sends a ticket to the workshop server. `src/triage.ts` defines the three Jev questions the server asks in one request.

`src/index.ts` and `src/examples/` show direct SDK usage. With your own TypeSafe key, run `npm run dev`, `npm run noul`, `npm run choice` or `npm run score`.

`src/jev.ts` is the shared client. Use `jev` from there for every call, don't make your own client.

Quick version of the three types: noul is a yes/no question and gives you the probability of yes. Choice picks one option from a list you give it and gives you a probability for each option plus a confidence. Score places the input on an ordered scale of 2 to 10 levels you write, lowest first, and gives you the expected level (can be fractional, like 1.7). Answers are fully typed, so `answers.team.choice` is `"treasurer" | "events" | "tech"` and not just `string`.

## Request limits

The server accepts text tickets up to 4096 bytes. If the room fills the queue, wait briefly before trying again.

Also, put all your questions about one input in a single request instead of one request per question. Cheaper and lighter on the key.

## Build your own project

Pick a small decision your app needs to make. Write down what Jev should look at, what question it should answer, and what your code should do with the answer. Try one clear input and one ambiguous input so you can see when to act and when to ask for review.

The shared workshop endpoint runs the starter triage questions. For your own questions, adapt the SDK examples in `src/examples/` and run them with your own TypeSafe key. You can also develop your app's behavior with sample answers while you iterate.

### Project ideas

- **Discord helper.** Use Choice to route a message to help, events, or jobs. Send low-confidence matches to a moderator.
- **Lost-and-found matcher.** Use Noul to estimate whether a lost-item report describes a found item. Show likely matches for someone to confirm.
- **Hackathon pitch coach.** Use Score to rate how clearly a pitch explains its problem and audience. Show the rubric alongside the result.
- **Meeting notes assistant.** Use Noul to identify sentences that contain action items. Let the user review those sentences before creating tasks.
- **GitHub issue labeler.** Use Choice to suggest bug, feature, or question, then let a maintainer confirm the label.

### Build with an agent

Tell your coding agent what you want to build and give it a few example inputs. Ask it to use the Jev examples as a starting point and write the app logic around the returned answers. You can give your agent TypeSafe's skill with:

```sh
npx skills add typesafe-ai/skills --skill typesafe-ai
```

## Docs

- Jev docs: https://docs.typesafe.ai
- Question types: https://docs.typesafe.ai/primitives
- JS SDK: https://docs.typesafe.ai/sdk/javascript
