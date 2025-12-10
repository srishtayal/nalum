import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ProfileProvider } from "@/context/ProfileContext";
import { cn } from "@/lib/utils";

const DashboardLayout = () => {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/dashboard/chat");

  return (
    <ProfileProvider>
      <div className="flex min-h-screen bg-slate-950 text-slate-100 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
        {/* Fixed Background Glow */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
        </div>

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 h-screen overflow-y-auto relative z-10">
          <div className={cn(
            "relative mx-auto transition-all duration-300",
            isChatPage ? "p-0 max-w-full h-full" : "p-8 max-w-7xl"
          )}>
            <Outlet />
          </div>
        </main>
      </div>
    </ProfileProvider>
  );
};

export default DashboardLayout;
