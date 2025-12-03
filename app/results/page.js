"use client";

import { Suspense } from "react";
import ResultsClient from "./results-client";

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading results...</div>}>
      <ResultsClient />
    </Suspense>
  );
}
