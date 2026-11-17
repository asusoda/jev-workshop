// noul = yes/no. You get back the probability that the answer is yes (0 to 1).
import { noul } from "@typesafe-ai/sdk";
import { jev } from "../jev.js";

const res = await jev.systemOne({
  state: "Can someone send me the zoom link for tonight's meeting? I can't find it anywhere.",
  questions: {
    is_question: noul("Is the person asking for something?"),
    is_spam: noul("Is this message spam or self promotion?"),
  },
});

console.log(JSON.stringify(res.answers, null, 2));

// example output:
// {
//   "is_question": { "type": "noul", "noul": 0.99 },
//   "is_spam": { "type": "noul", "noul": 0.02 }
// }

// typed: res.answers.is_spam.noul is a number, so this just works
if (res.answers.is_spam.noul > 0.5) console.log("-> delete it");
else console.log("-> reply with the link");
