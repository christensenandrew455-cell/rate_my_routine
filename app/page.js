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

  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f0f0f0",
    padding: "20px",
  };

  const boxStyle = {
    background: "white",
    width: "100%",
    maxWidth: "550px",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
    border: "1px solid #ddd",
  };

  const titleStyle = {
    fontSize: "34px",
    fontWeight: "800",
    marginBottom: "30px",
    textAlign: "center",
  };

  const generateHours = () => {
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

    const start = to24(wakeHour, wakeMeridiem);
    let end = to24(sleepHour, sleepMeridiem);
    let finalEnd = end <= start ? end + 24 : end;

    const list = [];
    for (let h = start; h < finalEnd; h++) {
      list.push({ hour: display12(h), value: "" });
    }
    setHours(list);
  };

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
    <div style={pageStyle}>
      <div style={boxStyle}>
        <h1 style={titleStyle}>Rate My Routine</h1>

        {/* time pickers */}
        <div style={{ marginBottom: "20px" }}>
          <TimeDropdown
            label="Wake Time"
            hour={wakeHour}
            setHour={setWakeHour}
            meridiem={wakeMeridiem}
            setMeridiem={setWakeMeridiem}
          />

          <div style={{ height: "15px" }}></div>

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
              width: "100%",
              padding: "12px",
              marginTop: "20px",
              background: "#2463eb",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Generate Hours
          </button>
        </div>

        {/* hour inputs */}
        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            paddingRight: "5px",
          }}
        >
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
              marginTop: "25px",
              padding: "12px",
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Rate My Day
          </button>
        )}
      </div>
    </div>
  );
}
