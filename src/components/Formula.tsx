"use client";

import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

interface FormulaProps {
  math: string;
  block?: boolean;
}

export default function Formula({ math, block = false }: FormulaProps) {
  if (block) {
    return (
      <div className="my-4 overflow-x-auto p-4 glass rounded-xl border border-primary/20 bg-primary/5">
        <BlockMath math={math} />
      </div>
    );
  }

  return (
    <span className="inline-block text-primary font-medium px-1">
      <InlineMath math={math} />
    </span>
  );
}
