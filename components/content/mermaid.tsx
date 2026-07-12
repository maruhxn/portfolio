"use client";

import { useEffect, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "next-themes";

let counter = 0;

export function Mermaid({ chart }: { chart: string }) {
  const { resolvedTheme } = useTheme();
  const [svg, setSvg] = useState("");
  const [failed, setFailed] = useState(false);

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
      .then(({ svg }) => { if (active) { setSvg(svg); setFailed(false); } })
      .catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [chart, resolvedTheme]);

  // 렌더 실패 시 원문을 이스케이프된 텍스트로 표시 (HTML 주입 방지)
  if (failed) {
    return (
      <pre className="my-6 overflow-x-auto rounded-xl border border-border bg-card p-4 text-sm text-foreground">{chart}</pre>
    );
  }

  return (
    <div className="my-6 flex justify-center overflow-x-auto rounded-xl border border-border bg-card p-4"
      dangerouslySetInnerHTML={{ __html: svg }} />
  );
}
