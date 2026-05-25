"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Search, Bell, HelpCircle, User, Menu, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  session: any;
}

export default function AdminLayoutClient({ children, session }: AdminLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    // Enable open sidebar by default on desktop viewports (width >= 1024px)
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar Navigation */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 min-h-screen flex flex-col transition-all duration-300",
        isSidebarOpen ? "lg:ml-72" : "lg:ml-0"
      )}>
        {/* Header Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-indigo-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
             {/* Hamburger Toggle Button */}
             <button
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className="p-2 rounded-xl border border-indigo-100 hover:bg-indigo-50/50 text-indigo-600 transition-all active:scale-95 flex items-center justify-center bg-white shadow-sm"
               title="Toggle Sidebar"
             >
               <Menu className="h-5 w-5" />
             </button>

             <div className="relative max-w-sm w-full hidden md:block group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400 group-focus-within:text-primary transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search dashboard..." 
                 className="w-full pl-10 pr-4 py-2 rounded-lg bg-indigo-50/50 border border-transparent focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm"
               />
             </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-400 hover:text-primary transition-all">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-400 hover:text-primary transition-all">
              <HelpCircle className="h-5 w-5" />
            </button>
            <div className="w-px h-4 bg-indigo-100 mx-2" />
            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-85 transition-opacity select-none group text-left outline-none focus:outline-none"
              >
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold leading-none text-indigo-900 group-hover:text-primary transition-colors">{session?.user?.name || "Admin"}</p>
                    <p className="text-[10px] text-indigo-400 uppercase font-bold mt-1 tracking-wider">Status: Online</p>
                 </div>
                 <div className="h-9 w-9 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                    <User className="h-5 w-5" />
                 </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div 
                    className="fixed inset-0 z-40 cursor-default" 
                    onClick={() => setIsProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white border border-indigo-50 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                     <div className="flex flex-col gap-1 pb-3 mb-3 border-b border-indigo-50">
                        <span className="text-xs font-bold text-indigo-900 truncate">
                           {session?.user?.name || "Administrator"}
                        </span>
                        <span className="text-[10px] text-indigo-400 truncate uppercase font-medium">
                           Super Admin
                        </span>
                     </div>
                     
                     <button
                       onClick={() => signOut()}
                       className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                     >
                       <LogOut className="h-4 w-4" />
                       <span>Log Out</span>
                     </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-grow p-8">
          <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
            {children}
          </div>
        </main>

        {/* Global Footer (Dashboard) */}
        <footer className="px-8 py-6 mt-auto flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-t border-border bg-white">
          <span>&copy; {new Date().getFullYear()} LMS Admin Portal</span>
          <span className="text-primary/60">System Version 2.4.0</span>
        </footer>
      </div>

      {/* Dynamic Overlay drawer for mobile/tablet */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
