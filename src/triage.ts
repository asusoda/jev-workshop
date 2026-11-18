import { choice, noul, score } from "@typesafe-ai/sdk";
import { jev } from "./jev.js";

export function triage(ticket: string) {
  return jev.systemOne({
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
}
