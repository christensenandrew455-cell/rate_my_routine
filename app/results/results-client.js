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

  if (!data) return <div className="p-10">Loading...</div>;

  // Convert to graph format:
  // x = hour, y = rating - 10  (center graph at 0)
  const graphData = data.graphData.map((d) => ({
    x: d.x,
    y: d.y - 10, // 10 becomes 0 on graph
    raw: d.y,
  }));

  return (
    <div className="p-10 max-w-4xl mx-auto">

      <h1 className="text-4xl font-bold mb-4">Your Productivity Results</h1>

      {/* Overall score */}
      <div className="text-6xl font-extrabold mb-3">
        {data.summaryScore}/100
      </div>

      {/* Explanation */}
      <p className="text-lg mb-8 text-gray-700">
        {data.explanation}
      </p>

      {/* Graph */}
      <div className="bg-white border rounded-xl shadow p-6 mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          Productivity Graph
        </h2>

        <div style={{ width: "100%", height: "500px" }}>
          <ResponsiveContainer>
            <LineChart data={graphData}>

              <CartesianGrid strokeDasharray="3 3" />

              {/* X Axis (hours) */}
              <XAxis dataKey="x" />

              {/* Y Axis: -10 → 10 (center at 0 = neutral) */}
              <YAxis
                domain={[-10, 10]}
                ticks={[-10, -5, 0, 5, 10]}
                tickFormatter={(val) => val + 10}
              />

              {/* Neutral Line */}
              <ReferenceLine y={0} stroke="gray" strokeDasharray="5 5" />

              <Tooltip
                formatter={(val, name, info) => [
                  info.payload.raw, // show original score
                  "Productivity",
                ]}
              />

              {/* Smooth curve line */}
              <Line
                type="monotone"
                dataKey="y"
                stroke="blue"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Best / Worst Hour */}
      <div className="bg-gray-100 p-4 rounded-lg mb-10">
        <p><strong>Best Hour:</strong> {data.bestHour}</p>
        <p><strong>Worst Hour:</strong> {data.worstHour}</p>
      </div>

      {/* Suggestion section */}
      <div className="bg-blue-50 p-6 rounded-xl shadow mb-10">
        <h2 className="text-2xl font-bold mb-3">Suggestions for Improvement</h2>
        <p className="text-lg text-gray-800">{data.suggestion}</p>
      </div>

      {/* Button */}
      <button
        onClick={() => (window.location.href = "/")}
        className="mt-6 px-5 py-3 bg-blue-600 text-white rounded-lg text-lg"
      >
        Rate Another Day
      </button>
    </div>
  );
}
