export default function HourInputRow({ hour, value, onChange, onCopy }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <span style={{ width: "120px" }}>{hour}</span>

      <input
        style={{
          flex: 1,
          border: "1px solid #ccc",
          padding: "8px",
          borderRadius: "6px",
        }}
        placeholder="Type a verb: study, gym, work..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <button
        onClick={onCopy}
        style={{
          padding: "6px 12px",
          background: "#e5e5e5",
          borderRadius: "6px",
          fontSize: "14px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Copy last input
      </button>
    </div>
  );
}
