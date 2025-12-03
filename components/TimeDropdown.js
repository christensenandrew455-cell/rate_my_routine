export default function TimeDropdown({ label, value, setValue }) {
const times = [];
for (let h = 1; h <= 12; h++) {
times.push(`${h}:00 AM`);
times.push(`${h}:00 PM`);
}


return (
<div>
<label className="block mb-1 font-medium">{label}</label>
<select
value={value}
onChange={(e) => setValue(e.target.value)}
className="border p-2 rounded w-full"
>
{times.map((t) => (
<option key={t}>{t}</option>
))}
</select>
</div>
);
}
