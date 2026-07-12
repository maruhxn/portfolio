"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type { ReactNode } from "react";
import { isValidElement } from "react";
import { Mermaid } from "./mermaid";
import { slugify } from "@/lib/slug";

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) return extractText((node.props as { children?: ReactNode }).children);
  return "";
}

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert
      prose-headings:scroll-mt-24 prose-headings:font-bold
      prose-h2:mt-14 prose-h2:border-t prose-h2:border-border prose-h2:pt-10
      prose-a:text-accent prose-table:text-sm
      prose-img:rounded-lg prose-img:border prose-img:border-border
      prose-code:before:content-[''] prose-code:after:content-['']">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h2({ children }) {
            // TOC(toc.tsx)와 동일한 slugify로 id를 부여해 앵커 링크가 항상 일치하도록 함
            return <h2 id={slugify(extractText(children))}>{children}</h2>;
          },
          pre({ children }) {
            const child = Array.isArray(children) ? children[0] : children;
            const className = isValidElement(child)
              ? ((child.props as { className?: string }).className ?? "")
              : "";
            if (/language-mermaid/.test(className) && isValidElement(child)) {
              return <Mermaid chart={extractText((child.props as { children?: ReactNode }).children).trim()} />;
            }
            return (
              <pre className="overflow-x-auto rounded-xl border border-border bg-card p-4 text-sm text-foreground">{children}</pre>
            );
          },
          img({ src, alt }) {
            if (typeof src !== "string") return null;
            // eslint-disable-next-line @next/next/no-img-element
            return <img src={src} alt={alt ?? ""} loading="lazy" className="mx-auto" />;
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
