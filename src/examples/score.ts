// score = place the input on an ordered scale (2 to 10 levels, lowest first).
// You get an expected level (can be fractional, like 1.7), a probability per
// level, and a confidence score.
import { score } from "@typesafe-ai/sdk";
import { jev } from "../jev.js";

const res = await jev.systemOne({
  state: {
    project: "Discord bot that reminds members about club events",
    pitch: "Pulls events from our Google Calendar, posts a reminder 1 hour before, and lets people RSVP with a reaction.",
  },
  questions: {
    clarity: score("How clear is this hackathon pitch?", [
      "Confusing, can't tell what it does",
      "Rough idea, missing details",
      "Clear, you know exactly what it does",
    ]),
  },
});

console.log(JSON.stringify(res.answers, null, 2));

// example output:
// {
//   "clarity": {
//     "type": "score",
//     "score": 1.86,
//     "confidence": 0.78,
//     "legend": {
//       "0": "Confusing, can't tell what it does",
//       "1": "Rough idea, missing details",
//       "2": "Clear, you know exactly what it does"
//     },
//     "probabilities": { "0": 0.0, "1": 0.14, "2": 0.86 }
//   }
// }

console.log(`-> clarity ${res.answers.clarity.score.toFixed(2)} / 2`);
