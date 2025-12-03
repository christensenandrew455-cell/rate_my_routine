import { openai } from "@/lib/openai";

export async function POST(req) {
  try {
    const body = await req.json();
    const { wakeTime, sleepTime, routine } = body;

    const prompt = `
You are a productivity evaluator.

The user provides:
- Wake time
- Sleep time
- A list of hourly activities from wake → sleep.

You must rate **each hour** from **0–20** using these rules:

0–5  = terrible use of time  
6–10 = weak  
11–14 = decent  
15–17 = good  
18–20 = excellent  

General rules:
- Extremely useless tasks like “stared at wall”, “watched paint dry”, “mindlessly scrolled TikTok” are **0–3**.
- Repetitive tasks with no break = **-3 penalty** to that hour.  
- Switching tasks counts as a “mental break”.
- Overworking more than **14 hours awake** = reduce total score.
- Sleeping less than 6 hours = reduce total score.
- Productive stacking (e.g., “listened to audiobook while cleaning”) is **very high score**.
- Neutral relaxing activities (games, TV, walking, resting) = **8–13**, depending on balance.
- Tasks that complete a major chore or goal = **15–20**.

Return JSON ONLY in this format:

{
  "hourlyRatings": [
    { "hour": "1 PM", "activity": "activity text", "rating": 14 },
    ...
  ],
  "graphData": [
    { "x": "1 PM", "y": 14 },
    ...
  ],
  "summaryScore": 0-100,
  "bestHour": "time",
  "worstHour": "time",
  "suggestion": "one paragraph improvement advice"
}

Here is the user's data:

Wake time: ${wakeTime}
Sleep time: ${sleepTime}
Routine: ${JSON.stringify(routine, null, 2)}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [{ role: "user", content: prompt }],
    });

    const raw = completion.choices[0].message.content;

    const json = JSON.parse(raw);

    return new Response(JSON.stringify(json), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
