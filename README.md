# jev-workshop

Build any tool or app you want around [Jev](https://docs.typesafe.ai), TypeSafe's decision model. Ticket triage is a starter example that shows how to send input, ask three kinds of questions, and use the answers in your code.

## Option 1: GitHub Codespaces

1. On GitHub, click **Fork** and create the fork in your account.
2. Open your fork on `main`. Click **Code → Codespaces → Create codespace on main**.
3. Wait for setup to finish. The Codespace installs dependencies and creates `.env` from `.env.example` with the workshop URL and access code.
4. In the Codespace terminal, run the starter example.

   ```sh
   npm run dev
   ```

## Option 2: Clone locally

1. Make sure Git and Node.js 22 or newer are installed. Check your Node version with `node --version`.
2. Clone `main` and enter the project folder. Use your fork's clone URL if you plan to push your own changes.

   ```sh
   git clone --branch main https://github.com/asusoda/jev-workshop.git
   cd jev-workshop
   ```

3. Install dependencies and create your local `.env`.

   ```sh
   npm ci
   cp .env.example .env
   ```

4. Run the starter example.

   ```sh
   npm run dev
   ```

## Try another input

The example prints a Jev model name and three answers in JSON: `urgent`, `team`, and `frustration`. You can leave `TYPESAFE_API_KEY` blank for this example. If the organizer gives you new workshop settings, update `WORKSHOP_URL` and `WORKSHOP_ACCESS_CODE` in your `.env`.

```sh
npm run dev -- "I was charged twice for my club dues."
```

Run `npm test` for the local integration check with a TypeSafe stub and `npm run typecheck` for the TypeScript check.

## What's in here

`src/workshop.ts` sends a ticket to the workshop server. `src/triage.ts` defines the three Jev questions the server asks in one request.

`src/index.ts` and `src/examples/` show direct SDK usage. With your own TypeSafe key, run `npm run direct`, `npm run noul`, `npm run choice` or `npm run score`.

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
