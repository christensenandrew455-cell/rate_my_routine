import { openai } from "@/lib/openai";


export async function POST(req) {
try {
const body = await req.json();
const { wakeTime, sleepTime, routine } = body;


const prompt = `Rate this person's daily routine.
Wake time: ${wakeTime}
Sleep time: ${sleepTime}
Routine (hour by hour): ${JSON.stringify(routine)}


Rules:
- Give a productivity score from 0–100.
- Give a short explanation.
- Identify best hour and worst hour.
Return JSON ONLY with keys: score, explanation, bestHour, worstHour.`;


const completion = await openai.chat.completions.create({
model: "gpt-4.1",
messages: [{ role: "user", content: prompt }]
});


const raw = completion.choices[0].message.content;
const parsed = JSON.parse(raw);


return new Response(JSON.stringify(parsed), { status: 200 });
} catch (error) {
return new Response(JSON.stringify({ error: error.message }), { status: 500 });
}
}
