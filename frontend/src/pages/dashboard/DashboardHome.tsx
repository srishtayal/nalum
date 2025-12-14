import { useProfile } from "@/context/ProfileContext";
import UserAvatar from "@/components/UserAvatar";
import PeopleYouMightKnow from "@/pages/dashboard/PeopleYouMightKnow";
import UpcomingEvents from "@/pages/dashboard/UpcomingEvents";
import ConnectionsPopover from "@/components/ConnectionsPopover";

const DashboardHome = () => {
  const { profile, isLoading } = useProfile();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Header */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {profile?.user.name?.split(" ")[0] || "User"}
            </h1>
            <p className="text-gray-400">
              Manage your profile and connect with the NSUT community.
            </p>
          </div>
          {!isLoading && profile && (
            <div className="hidden sm:flex items-center gap-4">
              <UserAvatar
                src={profile.profile_picture}
                name={profile.user.name}
                size="lg"
                className="border-2 border-white/20 shadow-lg"
              />
              <ConnectionsPopover />
            </div>
          )}
        </div>
      </div>

      {/* People You Might Know Section */}
      <div className="w-full">
        <PeopleYouMightKnow />
      </div>

      {/* Upcoming Events Section */}
      <div className="w-full">
        <UpcomingEvents />
      </div>
    </div>
  );
};

export default DashboardHome;
