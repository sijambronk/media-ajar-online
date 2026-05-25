import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BootstrapCardProps {
  title?: string;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  image?: string;
}

export default function BootstrapCard({
  title,
  header,
  footer,
  children,
  className,
  image,
}: BootstrapCardProps) {
  return (
    <div className={cn("bs-card overflow-hidden flex flex-col h-full rounded-3xl", className)}>
      {image && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img 
            src={image} 
            alt={title || "Card image"} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
        </div>
      )}
      
      {header && (
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          {header}
        </div>
      )}
      
      <div className="p-6 flex-grow">
        {title && (
          <h3 className="text-xl font-bold mb-3 tracking-tight">{title}</h3>
        )}
        <div className="text-muted-foreground text-sm leading-relaxed">
          {children}
        </div>
      </div>
      
      {footer && (
        <div className="px-6 py-4 border-t border-border bg-muted/10 mt-auto">
          {footer}
        </div>
      )}
    </div>
  );
}
