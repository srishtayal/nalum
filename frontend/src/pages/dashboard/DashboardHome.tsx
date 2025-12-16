import { useState } from "react";
import { useProfile } from "@/context/ProfileContext";
import PeopleYouMightKnow from "@/pages/dashboard/PeopleYouMightKnow";
import UpcomingEvents from "@/pages/dashboard/UpcomingEvents";
import ConnectionsPopover from "@/components/ConnectionsPopover";
import CreatePostModal from "@/components/posts/CreatePostModal";
import PostsFeed from "@/components/posts/PostsFeed";
import { PenSquare, Search } from "lucide-react";
import { toast } from "sonner";

const DashboardHome = () => {
  const { profile } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleStartPost = () => {
    const isAlumni = (profile?.user as any)?.role === "alumni";

    if (isAlumni) {
      setIsModalOpen(true);
    } else {
      toast.info(
        "Post creation will be available for students soon. Stay tuned!"
      );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Main Content Flex */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Start Post & Feed */}
        <div className="flex-grow space-y-6">
          <button
            onClick={handleStartPost}
            className="w-full flex items-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-gray-400 transition-all duration-200 group text-left"
          >
            <PenSquare className="h-6 w-6 text-gray-400 group-hover:text-white transition-colors" />
            <span className="text-lg font-medium group-hover:text-white transition-colors">
              Start a post
            </span>
          </button>

          <PostsFeed refreshTrigger={refreshTrigger} />
        </div>

        {/* Right Column: Search, People & Events */}
        <div className="w-full lg:w-auto flex-shrink-0 space-y-8">
          {/* Search & Notifications */}
          <div className="flex items-center gap-3">
            <div className="relative flex-grow hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-base text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
              />
            </div>
            <ConnectionsPopover />
          </div>

          <PeopleYouMightKnow />
          <UpcomingEvents />
        </div>
      </div>

      <CreatePostModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={() => setRefreshTrigger((prev) => prev + 1)}
      />
    </div>
  );
};

export default DashboardHome;
