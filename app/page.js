"use client";
let end = parse(sleepTime);


if (end <= start) end += 24;


for (let h = start; h < end; h++) {
const display = `${((h - 1) % 12) + 1}:00 ${(h < 12 || h >= 24) ? "AM" : "PM"}`;
list.push({ hour: display, value: "" });
}


setHours(list);
}


async function handleRate() {
const routine = hours.map((h) => ({ hour: h.hour, action: h.value }));


const res = await fetch("/api/rate", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ wakeTime, sleepTime, routine })
});


const data = await res.json();


router.push(`/results?data=${encodeURIComponent(JSON.stringify(data))}`);
}


return (
<div className="p-10 max-w-3xl mx-auto">
<h1 className="text-4xl font-bold mb-6">Rate My Routine</h1>


<div className="space-y-4">
<TimeDropdown label="Wake Time" value={wakeTime} setValue={setWakeTime} />
<TimeDropdown label="Sleep Time" value={sleepTime} setValue={setSleepTime} />


<button onClick={generateHours} className="px-4 py-2 bg-blue-600 text-white rounded">Generate Hours</button>
</div>


<div className="mt-8 space-y-3">
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
/>
))}
</div>


{hours.length > 0 && (
<button onClick={handleRate} className="mt-8 px-4 py-2 bg-green-600 text-white rounded">Rate My Day</button>
)}
</div>
);
}
