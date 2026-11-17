// choice = pick one option. You get the winning key, a probability for every
// option, and a confidence score.
import { choice } from "@typesafe-ai/sdk";
import { jev } from "../jev.js";

const res = await jev.systemOne({
  state: "my laptop keeps crashing when i run my CSE 340 assignment in docker, anyone know why??",
  questions: {
    channel: choice("Which Discord channel does this message belong in?", {
      help: "Questions about code, tools, or classes",
      events: "Workshops, meetings, socials",
      jobs: "Internships, job posts, resumes",
      general: null, // null is fine when the key says it all
    }),
  },
});

console.log(JSON.stringify(res.answers, null, 2));

// example output:
// {
//   "channel": {
//     "type": "choice",
//     "choice": "help",
//     "confidence": 0.93,
//     "probabilities": { "help": 0.97, "events": 0.0, "jobs": 0.0, "general": 0.03 }
//   }
// }

// typed: .choice is "help" | "events" | "jobs" | "general", not just string
const { channel } = res.answers;
if (channel.confidence < 0.6) console.log("-> not sure, ask a mod");
else console.log(`-> move to #${channel.choice}`);
