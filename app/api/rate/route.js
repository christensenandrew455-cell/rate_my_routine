import { openai } from "@/lib/openai";

export async function POST(req) {
  try {
    const body = await req.json();
    const { wakeTime, sleepTime, routine } = body;

    // -----------------------------------------
    // 1. GPT VALIDATES EACH HOURLY ACTION
    // -----------------------------------------
    for (let i = 0; i < routine.length; i++) {
      const { hour, action } = routine[i];

      const validationPrompt = `
Your job is to check if an activity is something a human can DO.

Examples of NOT do-able (nonsense):
- donkey
- window
- lamp post
- grass
- potato
- blue square
- triangle
- air
These are NOT actions, NOT tasks, NOT activities.

Examples of do-able:
- go to school
- study
- clean room
- eat breakfast
- play soccer
- walk dog
- do homework

Respond ONLY in JSON:
{
  "doable": true or false,
  "reason": "short explanation"
}

Activity: "${action}"
`;

      const validation = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [{ role: "user", content: validationPrompt }],
      });

      let result;
      try {
        result = JSON.parse(validation.choices[0].message.content);
      } catch (err) {
        return new Response(
          JSON.stringify({
            error: `Validation JSON parse error at hour "${hour}".`,
            invalidTime: hour
          }),
          { status: 400 }
        );
      }

      if (!result.doable) {
        return new Response(
          JSON.stringify({
            error: `The activity at ${hour} — "${action}" — is NOT something a human can do. ${result.reason}`,
            invalidTime: hour,
            invalidActivity: action
          }),
          { status: 400 }
        );
      }
    }

    // -----------------------------------------
    // 2. ALL VALID → SEND RATING REQUEST
    // -----------------------------------------

    const prompt = `
You are a productivity evaluator.

The user provides:
- Wake time
- Sleep time
- A list of hourly activities from wake → sleep.

You must rate each hour 0–20 using these rules:
0–5  = terrible  
6–10 = weak  
11–14 = decent  
15–17 = good  
18–20 = excellent  

General rules:
- Useless tasks (stare at wall, mindless scroll) = 0–3
- Repetitive tasks no break = -3
- Switching tasks = mental break
- Overworking 14+ hrs = reduce
- Sleep < 6 hrs = reduce
- Productive stacking = high
- Relaxing neutral = 8–13
- Major achievements = 15–20

Return JSON ONLY:

{
  "hourlyRatings": [
    { "hour": "1 PM", "activity": "activity text", "rating": 14 }
  ],
  "graphData": [
    { "x": "1 PM", "y": 14 }
  ],
  "summaryScore": 0-100,
  "bestHour": "time",
  "worstHour": "time",
  "suggestion": "one paragraph improvement advice",
  "explanation": "one paragraph overall explanation"
}

Wake time: ${wakeTime}
Sleep time: ${sleepTime}
Routine: ${JSON.stringify(routine, null, 2)}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [{ role: "user", content: prompt }],
    });

    const raw = completion.choices[0].message.content;

    let json;
    try {
      json = JSON.parse(raw);
    } catch (err) {
      console.error("GPT returned invalid JSON:", raw);
      return new Response(
        JSON.stringify({ error: "Failed to parse GPT response", raw }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify(json), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
