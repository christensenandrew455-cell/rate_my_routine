"use client";
import { useState } from "react";
import TimeDropdown from "@/components/TimeDropdown";
import HourInputRow from "@/components/HourInputRow";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Time state
  const [wakeHour, setWakeHour] = useState(7);
  const [wakeMeridiem, setWakeMeridiem] = useState("AM");

  const [sleepHour, setSleepHour] = useState(10);
  const [sleepMeridiem, setSleepMeridiem] = useState("PM");

  const [hours, setHours] = useState([]);

  // Convert 12hr -> 24hr
  const to24 = (hour, mer) => {
    let h = Number(hour);
    if (mer === "PM" && h !== 12) h += 12;
    if (mer === "AM" && h === 12) h = 0;
    return h;
  };

  // Convert 24hr -> 12hr display
  const display12 = (h24) => {
    const h = h24 % 12 === 0 ? 12 : h24 % 12;
    const mer = h24 < 12 || h24 === 24 ? "AM" : "PM";
    return `${h}:00 ${mer}`;
  };

  // FIXED hour generator
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
    const routine = hours.map((h) => ({
      hour: h.hour,
      action: h.value,
    }));

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
    <div
      style={{
        padding: "40px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Rate My Routine
        </h1>

        {/* Wake + Sleep Side by Side */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
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

        {/* Generate hours button */}
        <button
          onClick={generateHours}
          style={{
            padding: "12px",
            background: "#2563eb",
            color: "white",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            width: "100%",
            marginBottom: "20px",
          }}
        >
          Generate Hours
        </button>

        {/* Hour input rows */}
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

        {/* Rate button */}
        {hours.length > 0 && (
          <button
            onClick={handleRate}
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "green",
              color: "white",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              width: "100%",
            }}
          >
            Rate My Day
          </button>
        )}
      </div>
    </div>
  );
}
