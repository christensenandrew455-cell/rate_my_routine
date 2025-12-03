"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResultsClient() {
  const params = useSearchParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const raw = params.get("data");
    if (raw) {
      setData(JSON.parse(raw));
    }
  }, [params]);

  if (!data) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Your Routine Score</h1>

      <div className="text-6xl font-bold mb-4">{data.score}/100</div>

      <p className="text-lg mb-6">{data.explanation}</p>

      <div className="bg-gray-200 p-4 rounded">
        <p><strong>Best Hour:</strong> {data.bestHour}</p>
        <p><strong>Worst Hour:</strong> {data.worstHour}</p>
      </div>

      <button
        onClick={() => (window.location.href = "/")}
        className="mt-8 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Rate Another Day
      </button>
    </div>
  );
}
