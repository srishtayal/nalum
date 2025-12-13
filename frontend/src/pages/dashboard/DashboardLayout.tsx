import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ProfileProvider } from "@/context/ProfileContext";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

import { useState } from "react";

const DashboardLayout = () => {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/dashboard/chat");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ProfileProvider>
      <div className="flex h-[100dvh] w-full overflow-hidden bg-slate-950 text-slate-100 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
        {/* Fixed Background Glow */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
        </div>

        {/* Mobile Header - Hidden on Chat Page */}
        {!isChatPage && (
          <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="text-white p-1 hover:bg-white/10 rounded-md">
                    <Menu className="h-6 w-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 bg-transparent border-none w-72">
                  <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
                </SheetContent>
              </Sheet>
              <span className="font-bold text-white tracking-wider">NALUM</span>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 h-full overflow-y-auto relative z-10">
          <div className={cn(
            "relative mx-auto transition-all duration-300",
            isChatPage
              ? "pt-0 pb-0 px-0 max-w-full h-full"
              : "pt-0 md:pt-8 p-4 md:p-8 max-w-7xl"
          )}>
            {/* Mobile Header Spacer */}
            {!isChatPage && <div className="md:hidden h-28 w-full shrink-0" />}
            <Outlet />
          </div>
        </main>
      </div>
    </ProfileProvider>
  );
};

export default DashboardLayout;
