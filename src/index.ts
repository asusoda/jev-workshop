// Start here. This asks all three question types about one message in a
// single request. One request with many questions is cheaper and lighter on
// the shared key than many requests with one question each.
import { triage } from "./triage.js";

const ticket =
  "I was charged twice for my membership dues this semester and nobody has answered my email in a week. I need this fixed before Friday.";

const res = await triage(ticket);

const { urgent, team, frustration } = res.answers;
console.log(`model:       ${res.model}`);
console.log(`urgent:      ${urgent.noul}`);
console.log(`team:        ${team.choice} (confidence ${team.confidence})`);
console.log(`frustration: ${frustration.score} on 0..2`);
console.log(`tokens:      ${res.usage.input_tokens} in / ${res.usage.output_tokens} out`);

// Your turn. Swap `ticket` and edit the questions in triage.ts, or ask your
// agent to build something on top of `jev` (see AGENTS.md).
