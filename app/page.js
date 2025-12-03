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
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>

      {/* Hero Section */}
      <div style={{
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        padding: "30px",
        marginBottom: "40px",
      }}>
        <h1 style={{ fontSize: "36px", fontWeight: "700", textAlign: "center", marginBottom: "20px" }}>
          Rate My Routine
        </h1>

        {/* Wake + Sleep Side by Side */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <div style={{ flex: 1 }}>
            <TimeDropdown
              label="Wake Time"
              hour={wakeHour}
              setHour={setWakeHour}
              meridiem={wakeMeridiem}
              setMeridiem={setWakeMeridiem}
            />
          </div>
          <div style={{ flex: 1 }}>
            <TimeDropdown
              label="Sleep Time"
              hour={sleepHour}
              setHour={setSleepHour}
              meridiem={sleepMeridiem}
              setMeridiem={setSleepMeridiem}
            />
          </div>
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

      {/* App Description (NEW) */}
      <div style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "30px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        marginBottom: "40px",
      }}>
        <p style={{ fontSize: "18px", color: "#444", lineHeight: "1.6" }}>
          “Rate My Routine” is your personal productivity companion. Whether you want a fun way to check your day, a serious tool to optimize your habits, or just curiosity about your productivity, this app helps you understand each hour of your day. Receive scores, visual graphs, and suggestions to improve your routine and make the most out of every day.
        </p>
      </div>

      {/* FAQ Section */}
      <div style={{
        background: "#f9f9f9",
        borderRadius: "12px",
        padding: "30px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        marginBottom: "40px",
      }}>
        <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "20px", textAlign: "center" }}>
          Frequently Asked Questions
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <strong>Is Rate My Routine free?</strong>
            <p>Yes! You can use it without any cost.</p>
          </div>
          <div>
            <strong>Does Rate My Routine take my information?</strong>
            <p>No, all information is deleted and not saved.</p>
          </div>
          <div>
            <strong>How does it work?</strong>
            <p>Simply enter your wake time, bedtime, and daily activities. The AI evaluates each hour and gives you a productivity score along with suggestions.</p>
          </div>
          <div>
            <strong>Should I take my results seriously?</strong>
            <p>The results can be viewed as serious or just for fun—it’s up to you!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
