export default function HourInputRow({ hour, value, onChange }) {
return (
<div className="flex items-center gap-3">
<span className="w-32">{hour}</span>
<input
className="flex-1 border p-2 rounded"
placeholder="Type a verb: study, gym, work..."
value={value}
onChange={(e) => onChange(e.target.value)}
/>
</div>
);
}
