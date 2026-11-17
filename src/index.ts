// Start here. This asks all three question types about one message in a
// single request. One request with many questions is cheaper and lighter on
// the shared key than many requests with one question each.
import { choice, noul, score } from "@typesafe-ai/sdk";
import { jev } from "./jev.js";

const ticket =
  "I was charged twice for my membership dues this semester and nobody has answered my email in a week. I need this fixed before Friday.";

const res = await jev.systemOne({
  state: ticket,
  questions: {
    urgent: noul("Does this need a reply today?"),
    team: choice("Who should handle this?", {
      treasurer: "Dues, payments, refunds, reimbursements",
      events: "Workshops, meetings, socials",
      tech: "Website, Discord bot, accounts",
    }),
    frustration: score("How frustrated is the person?", ["Calm", "Annoyed", "Very upset"]),
  },
});

const { urgent, team, frustration } = res.answers;
console.log(`model:       ${res.model}`);
console.log(`urgent:      ${urgent.noul}`);
console.log(`team:        ${team.choice} (confidence ${team.confidence})`);
console.log(`frustration: ${frustration.score} on 0..2`);
console.log(`tokens:      ${res.usage.input_tokens} in / ${res.usage.output_tokens} out`);

// Your turn. Swap `ticket` and the questions for your own idea, or ask your
// agent to build something on top of `jev` (see AGENTS.md).
