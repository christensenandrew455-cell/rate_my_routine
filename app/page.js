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
    const start = to24(wakeHour, wakeMeridiem);
    let end = to24(sleepHour, sleepMeridiem);
    let finalEnd = end <= start ? end + 24 : end;

    const list = [];
    for (let h = start; h < finalEnd; h++) {
      list.push({ hour: display12(h), value: "" });
    }

    setHours(list);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-2xl border border-gray-200">
        <h1 className="text-4xl font-bold text-center mb-8">Rate My Routine</h1>

        <div className="space-y-4">
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg w-full hover:bg-blue-700 transition"
          >
            Generate Hours
          </button>
        </div>

        <div className="mt-8 space-y-3 max-h-96 overflow-y-auto pr-2">
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
            className="mt-8 px-4 py-2 bg-green-600 text-white rounded-lg w-full hover:bg-green-700 transition"
          >
            Rate My Day
          </button>
        )}
      </div>
    </div>
  );
}
