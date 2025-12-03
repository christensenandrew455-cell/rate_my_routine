export default function TimeDropdown({ label, hour, setHour, meridiem, setMeridiem }) {
  return (
    <div className="flex gap-3 items-center">
      <div className="flex-1">
        <label className="block mb-1 font-medium">{label}</label>
        <div className="flex gap-2">
          {/* Hour dropdown */}
          <select
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="border p-2 rounded w-24"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          {/* AM / PM */}
          <select
            value={meridiem}
            onChange={(e) => setMeridiem(e.target.value)}
            className="border p-2 rounded w-20"
          >
            <option>AM</option>
            <option>PM</option>
          </select>
        </div>
      </div>
    </div>
  );
}
