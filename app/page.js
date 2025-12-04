"use client";
import { useState } from "react";
import TimeDropdown from "@/components/TimeDropdown";
import HourInputRow from "@/components/HourInputRow";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [wakeHour, setWakeHour] = useState(7);
  const [wakeMeridiem, setWakeMeridiem] = useState("AM");
  const [sleepHour, setSleepHour] = useState(10);
  const [sleepMeridiem, setSleepMeridiem] = useState("PM");
  const [hours, setHours] = useState([]);

  const to24 = (hour, mer) => {
    let h = Number(hour);
    if (mer === "PM" && h !== 12) h += 12;
    if (mer === "AM" && h === 12) h = 0;
    return h;
  };

  const display12 = (h24) => {
    const h = h24 % 12 === 0 ? 12 : h24 % 12;
    const mer = h24 < 12 || h24 === 24 ? "AM" : "PM";
    return `${h}:00 ${mer}`;
  };

  function generateHours() {
    let start = to24(wakeHour, wakeMeridiem);
    let end = to24(sleepHour, sleepMeridiem);

    let result = [];
    let current = start;
    result.push({ hour: display12(current), value: "" });

    while (current !== end) {
      current = (current + 1) % 24;
      result.push({ hour: display12(current), value: "" });
    }
    setHours(result);
  }

  async function handleRate() {
    const routine = hours.map((h) => ({ hour: h.hour, action: h.value }));

    const res = await fetch("/api/rate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wakeTime: `${wakeHour}:00 ${wakeMeridiem}`,
        sleepTime: `${sleepHour}:00 ${sleepMeridiem}`,
        routine,
      }),
    });

    const data = await res.json();
    router.push(`/results?data=${encodeURIComponent(JSON.stringify(data))}`);
  }

  return (
    <div style={{ padding: "40px", maxWidth: "750px", margin: "0 auto" }}>

      {/* HERO SECTION */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          padding: "35px",
          marginBottom: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "40px",
            fontWeight: "700",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          Rate My Routine
        </h1>

        <p
          style={{
            fontSize: "18px",
            textAlign: "center",
            color: "#444",
            marginBottom: "25px",
            lineHeight: "1.6",
          }}
        >
          Analyze and improve your daily productivity with intelligent,
          hour-by-hour insights powered by AI.
        </p>

        {/* Wake + Sleep Inputs */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <TimeDropdown
            label="Wake Time"
            hour={wakeHour}
            setHour={setWakeHour}
            meridiem={wakeMeridiem}
            setMeridiem={setWakeMeridiem}
          />
          <TimeDropdown
            label="Sleep Time"
            hour={sleepHour}
            setHour={setSleepHour}
            meridiem={sleepMeridiem}
            setMeridiem={setSleepMeridiem}
          />
        </div>

        <button
          onClick={generateHours}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            fontWeight: "600",
            background: "#2563eb",
            color: "#fff",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          Generate Hours
        </button>

        {/* Hour Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {hours.map((h, i) => (
            <HourInputRow
              key={i}
              hour={h.hour}
              value={h.value}
              onChange={(v) => {
                const newHours = [...hours];
                newHours[i].value = v;
                setHours(newHours);
              }}
              onCopy={() => {
                if (i > 0) {
                  const newHours = [...hours];
                  newHours[i].value = newHours[i - 1].value;
                  setHours(newHours);
                }
              }}
            />
          ))}
        </div>

        {hours.length > 0 && (
          <button
            onClick={handleRate}
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "16px",
              fontWeight: "600",
              background: "green",
              color: "white",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            Rate My Day
          </button>
        )}
      </div>

      {/* ABOUT SECTION */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          marginBottom: "40px",
        }}
      >
        <p style={{ fontSize: "18px", color: "#444", lineHeight: "1.7" }}>
          Rate My Routine is a simple but powerful tool that helps you understand
          how you spend your day. Whether you’re using it for fun, serious habit
          tracking, or improving productivity, the app breaks down your day
          hour-by-hour and gives you personalized AI feedback.
          <br />
          <br />
          You’ll receive a productivity score from –10 to +10 for each hour,
          along with suggestions that help you build better habits, stay
          organized, and understand how your actions shape your results.
        </p>

        <ul
          style={{
            marginTop: "20px",
            color: "#444",
            fontSize: "17px",
            lineHeight: "1.7",
            paddingLeft: "20px",
          }}
        >
          <li>✔ Easy hour generator</li>
          <li>✔ AI-powered productivity scoring</li>
          <li>✔ Personalized improvement suggestions</li>
          <li>✔ No login required</li>
          <li>✔ No data stored or tracked</li>
        </ul>
      </div>

      {/* FAQ SECTION */}
      <div
        style={{
          background: "#f9f9f9",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
          marginBottom: "40px",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "700",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Frequently Asked Questions
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <strong>Is Rate My Routine free?</strong>
            <p>Yes. The tool is completely free to use with no account required.</p>
          </div>

          <div>
            <strong>Does Rate My Routine save my information?</strong>
            <p>
              No. Your routine is processed only to generate your score and then
              immediately deleted. Nothing is stored or shared.
            </p>
          </div>

          <div>
            <strong>How does the app work?</strong>
            <p>
              You pick your wake time and sleep time, fill in what you did each
              hour, and the AI scores your full day from –10 to +10 while giving
              helpful improvement tips.
            </p>
          </div>

          <div>
            <strong>Should I take the results seriously?</strong>
            <p>
              You can treat them seriously or use them just for fun. Many people
              use it for habit tracking, while others use it casually.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          textAlign: "center",
          color: "#666",
          fontSize: "14px",
          marginTop: "40px",
          paddingBottom: "30px",
        }}
      >
        <p>Rate My Routine © 2025 — No data is stored. All analysis is temporary.</p>
        <p>This site is for productivity guidance and entertainment purposes.</p>
      </div>
    </div>
  );
}
