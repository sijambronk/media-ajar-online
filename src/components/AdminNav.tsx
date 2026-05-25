"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, ClipboardCheck, LayoutDashboard, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";

// Component for admin navigation
export default function AdminNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || "ADMIN";

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Materi", href: "/admin/materi", icon: FileText },
    { name: "Asesmen", href: "/admin/asesmen", icon: ClipboardCheck },
    ...(role === "ADMIN" ? [{ name: "Pengaturan", href: "/admin/settings", icon: Settings }] : []),
  ];

  return (
    <nav className="bg-secondary/30 p-2 rounded-3xl border border-border/50 mb-8">
      {/* Grid-based Nav Items for Mobile, Flex for Desktop */}
      <div className="grid grid-cols-2 md:flex md:items-center gap-1.5 md:gap-1 w-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-center md:justify-start gap-2 px-3 py-3 md:px-4 md:py-2 rounded-[1rem] md:rounded-xl transition-all font-bold md:font-medium text-[10px] md:text-sm whitespace-nowrap border border-transparent",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 border-primary/20" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-border/20 md:border-transparent bg-white/[0.03] md:bg-transparent"
              )}
            >
              <item.icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
