"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ResultsClient() {
  const params = useSearchParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const raw = params.get("data");
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch (err) {
        console.error("Failed to parse results data:", raw);
      }
    }
  }, [params]);

  if (!data) return <div style={{ padding: "40px" }}>Loading...</div>;

  const graphData = data?.graphData?.map((d) => ({
    x: d.x,
    y: d.y - 10, // center graph at 10 = 0
    raw: d.y,
  })) || [];

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "36px", fontWeight: "700", marginBottom: "20px" }}>
        Your Productivity Results
      </h1>

      <div style={{ fontSize: "64px", fontWeight: "800", marginBottom: "20px" }}>
        {data.summaryScore ?? 0}/100
      </div>

      <p style={{ fontSize: "18px", marginBottom: "40px", color: "#444" }}>
        {data.explanation ?? ""}
      </p>

      <div style={{
        width: "100%",
        height: "500px",
        background: "#fff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        marginBottom: "40px",
      }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "12px" }}>
          Productivity Graph
        </h2>

        {graphData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis
                domain={[-10, 10]}
                ticks={[-10, -5, 0, 5, 10]}
                tickFormatter={(val) => val + 10}
              />
              <ReferenceLine y={0} stroke="#999" strokeDasharray="5 5" />
              <Tooltip formatter={(val, name, info) => [info.payload.raw, "Productivity"]} />
              <Line
                type="monotone"
                dataKey="y"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div>No graph data available</div>
        )}
      </div>

      <div style={{
        background: "#f0f0f0",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "40px",
      }}>
        <p><strong>Best Hour:</strong> {data.bestHour ?? "N/A"}</p>
        <p><strong>Worst Hour:</strong> {data.worstHour ?? "N/A"}</p>
      </div>

      <div style={{
        background: "#e0f2ff",
        padding: "25px",
        borderRadius: "12px",
        marginBottom: "40px",
      }}>
        <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "12px" }}>
          Suggestions for Improvement
        </h2>
        <p style={{ fontSize: "18px", color: "#222" }}>
          {data.suggestion ?? ""}
        </p>
      </div>

      <button
        onClick={() => (window.location.href = "/")}
        style={{
          padding: "14px 24px",
          fontSize: "18px",
          fontWeight: "600",
          color: "#fff",
          background: "#2563eb",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        Rate Another Day
      </button>
    </div>
  );
}
