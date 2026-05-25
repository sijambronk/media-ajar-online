"use client";

import Formula from "./Formula";

interface ScienceTextProps {
  text: string;
}

export default function ScienceText({ text }: ScienceTextProps) {
  if (!text) return null;

  // Detect if text is HTML (likely from Tiptap Editor)
  const isHtml = /<[a-z][\s\S]*>/i.test(text);

  if (isHtml) {
    return (
      <div className="science-text-container w-full break-words">
        <style>{`
          .science-text-container img {
            display: inline-block !important;
            border-radius: 0.75rem !important;
            max-width: 100% !important;
            height: auto !important;
            max-height: 18vh !important; /* Limit height on mobile to ensure all options fit without scrolling */
            object-fit: contain !important;
            margin: 0.5rem 0 !important;
          }
          @media (min-width: 768px) {
            .science-text-container img {
              max-height: 28vh !important;
            }
          }
          @media (min-width: 1024px) {
            .science-text-container img {
              max-height: 35vh !important;
            }
          }
          @media (max-height: 720px) and (max-width: 767px) {
            .science-text-container img {
              max-height: 15vh !important; /* Scale down image further ONLY on short mobile viewports */
            }
          }
        `}</style>
        <div 
          className="prose max-w-none w-full break-words prose-p:my-1" 
          dangerouslySetInnerHTML={{ __html: text }} 
        />
      </div>
    );
  }

  // Split text by $ symbols to find KaTeX parts (Legacy support)
  const parts = text.split(/(\$.*?\$)/g);

  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          const math = part.slice(1, -1);
          return <Formula key={i} math={math} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
