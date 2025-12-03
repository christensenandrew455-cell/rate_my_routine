export default function TimeDropdown({ label, hour, setHour, meridiem, setMeridiem }) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <div style={{ flex: 1 }}>
        <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>
          {label}
        </label>

        <div style={{ display: "flex", gap: "10px" }}>
          {/* Hour dropdown */}
          <select
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            style={{
              border: "1px solid #ccc",
              padding: "8px",
              borderRadius: "6px",
              width: "70px",
            }}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          {/* AM / PM */}
          <select
            value={meridiem}
            onChange={(e) => setMeridiem(e.target.value)}
            style={{
              border: "1px solid #ccc",
              padding: "8px",
              borderRadius: "6px",
              width: "70px",
            }}
          >
            <option>AM</option>
            <option>PM</option>
          </select>
        </div>
      </div>
    </div>
  );
}
