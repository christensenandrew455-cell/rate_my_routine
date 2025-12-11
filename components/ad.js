"use client";
import { useEffect } from "react";

export default function Ad() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://pl28239900.effectivegatecpm.com/4e20b4df145884b421e51e790c1e1d08/invoke.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    document.body.appendChild(script);
  }, []);

  return (
    <div
      id="container-4e20b4df145884b421e51e790c1e1d08"
      style={{
        marginTop: "20px",
        marginBottom: "20px",
      }}
    />
  );
}
