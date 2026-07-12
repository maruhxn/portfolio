"use client";

import { useEffect, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "next-themes";

let counter = 0;

export function Mermaid({ chart }: { chart: string }) {
  const { resolvedTheme } = useTheme();
  const [svg, setSvg] = useState("");

  useEffect(() => {
    let active = true;
    const id = `mermaid-${counter++}`;
    mermaid.initialize({
      startOnLoad: false,
      theme: resolvedTheme === "dark" ? "dark" : "default",
      securityLevel: "loose",
      fontFamily: "Pretendard Variable, Pretendard, sans-serif",
    });
    mermaid
      .render(id, chart)
      .then(({ svg }) => { if (active) setSvg(svg); })
      .catch(() => { if (active) setSvg(`<pre>${chart}</pre>`); });
    return () => { active = false; };
  }, [chart, resolvedTheme]);

  return (
    <div className="my-6 flex justify-center overflow-x-auto rounded-xl border border-border bg-card p-4"
      dangerouslySetInnerHTML={{ __html: svg }} />
  );
}
