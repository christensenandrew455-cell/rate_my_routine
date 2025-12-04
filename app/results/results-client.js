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
    if (raw) setData(JSON.parse(raw));
  }, [params]);

  if (!data) return <div style={{ padding: "40px" }}>Loading...</div>;

  // --- WORD SCORE PICKER ---
  const getScoreWord = (score) => {
    if (score >= 0 && score < 10) return "how?";
    if (score >= 10 && score < 20) return "really";
    if (score >= 20 && score < 30) return "bum";
    if (score >= 30 && score < 40) return "getting there";
    if (score >= 40 && score < 50) return "better than a bum";
    if (score >= 50 && score < 60) return "halfway";
    if (score >= 60 && score < 70) return "better";
    if (score >= 70 && score < 80) return "good";
    if (score >= 80 && score < 90) return "excellent";
    if (score >= 90 && score <= 100) return "amazing";

    return "unknown";
  };

  const scoreWord = getScoreWord(data.summaryScore);

  // Remap GPT 0–20 ratings for graph (-10 → 10)
  const graphData =
    data?.graphData?.map((d) => ({
      x: d.x,
      y: d.y - 10,
      raw: d.y,
    })) || [];

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      {/* Page Title */}
      <h1 style={{ fontSize: "36px", fontWeight: "700", marginBottom: "20px" }}>
        Your Productivity Results
      </h1>

      {/* Summary Score */}
      <div style={{ fontSize: "64px", fontWeight: "800", marginBottom: "10px" }}>
        {data.summaryScore}/100
      </div>

      {/* Word Based on Score */}
      <div
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "30px",
          color: "#2563eb",
        }}
      >
        {scoreWord}
      </div>

      {/* Explanation */}
      <p style={{ fontSize: "18px", marginBottom: "40px", color: "#444" }}>
        {data.explanation}
      </p>

      {/* Graph Container */}
      <div
        style={{
          width: "100%",
          height: "500px",
          background: "#fff",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          marginBottom: "40px",
        }}
      >
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "12px" }}>
          Productivity Graph
        </h2>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis domain={[-10, 10]} ticks={[-10, -5, 0, 5, 10]} />
            <ReferenceLine y={0} stroke="#999" strokeDasharray="5 5" />
            <Tooltip
              formatter={(val, name, info) => [info.payload.raw, "Productivity"]}
            />
            <Line
              type="monotone"
              dataKey="y"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Best/Worst Hour */}
      <div
        style={{
          background: "#f0f0f0",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "40px",
        }}
      >
        <p>
          <strong>Best Hour:</strong> {data.bestHour}
        </p>
        <p>
          <strong>Worst Hour:</strong> {data.worstHour}
        </p>
      </div>

      {/* Suggestions */}
      <div
        style={{
          background: "#e0f2ff",
          padding: "25px",
          borderRadius: "12px",
          marginBottom: "40px",
        }}
      >
        <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "12px" }}>
          Suggestions for Improvement
        </h2>
        <p style={{ fontSize: "18px", color: "#222" }}>{data.suggestion}</p>
      </div>

      {/* Button */}
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
