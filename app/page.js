"use client";
import { useState } from "react";
import TimeDropdown from "@/components/TimeDropdown";
import HourInputRow from "@/components/HourInputRow";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Wake/sleep state
  const [wakeHour, setWakeHour] = useState(7);
  const [wakeMeridiem, setWakeMeridiem] = useState("AM");

  const [sleepHour, setSleepHour] = useState(10);
  const [sleepMeridiem, setSleepMeridiem] = useState("PM");

  const [hours, setHours] = useState([]);

  // Convert to 24-hour format
  const to24 = (hour, mer) => {
    hour = Number(hour);
    if (mer === "PM" && hour !== 12) hour += 12;
    if (mer === "AM" && hour === 12) hour = 0;
    return hour;
  };

  // Convert back to display format
  const display12 = (h24) => {
    const h = h24 % 12 || 12;
    const mer = h24 < 12 ? "AM" : "PM";
    return `${h}:00 ${mer}`;
  };

  // FIXED — handles crossing midnight properly
  function generateHours() {
    let start = to24(wakeHour, wakeMeridiem);
    let end = to24(sleepHour, sleepMeridiem);

    let list = [];
    let current = start;

    list.push({ hour: display12(current), value: "" });

    while (current !== end) {
      current = (current + 1) % 24; // wraps after midnight
      list.push({ hour: display12(current), value: "" });
    }

    setHours(list);
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
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        paddingTop: "50px",
      }}
    >
      {/* Center Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "white",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Rate My Routine
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
            }}
          >
            Generate Hours
          </button>
        </div>

        {/* Generated hour list */}
        <div style={{ marginTop: "25px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {hours.map((h, i) => (
            <HourInputRow
              key={i}
              hour={h.hour}
              value={h.value}
              onChange={(v) => {
                const newData = [...hours];
                newData[i].value = v;
                setHours(newData);
              }}
              onCopy={() => {
                if (i > 0) {
                  const newData = [...hours];
                  newData[i].value = newData[i - 1].value;
                  setHours(newData);
                }
              }}
            />
          ))}
        </div>

        {hours.length > 0 && (
          <button
            onClick={handleRate}
            style={{
              marginTop: "30px",
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
