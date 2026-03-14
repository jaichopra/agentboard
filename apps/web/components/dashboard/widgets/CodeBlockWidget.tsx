"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Widget } from "@/lib/schemas";
import WidgetShell from "../WidgetShell";

interface CodeBlockWidgetProps {
  widget: Widget;
  data: Record<string, unknown>[];
}

export default function CodeBlockWidget({ widget, data }: CodeBlockWidgetProps) {
  const config = widget.config as {
    code?: string;
    language?: string;
    showLineNumbers?: boolean;
  };

  const code = config.code || (data[0]?.code as string) || "";
  const language = config.language || (data[0]?.language as string) || "typescript";
  const showLineNumbers = config.showLineNumbers ?? true;

  return (
    <WidgetShell title={widget.title} description={widget.description}>
      <div className="min-h-0 flex-1 overflow-auto rounded-lg">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            borderRadius: 8,
            fontSize: 13,
            background: "rgba(24, 24, 27, 0.8)",
            border: "1px solid rgba(63, 63, 70, 0.5)",
          }}
          lineNumberStyle={{ color: "#52525b", fontSize: 12 }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </WidgetShell>
  );
}
