import { Sidebar, SidebarProvider } from "@/components/ui/sidebar"; // make sure SidebarProvider is exported
import UserProfileCard from "@/components/home/UserProfileCard";
import DiscussionForumPreview from "@/components/home/DiscussionForumPreview";
import RecruitmentPreview from "@/components/home/RecruitmentPreview";
import ReferralPreview from "@/components/home/ReferralPreview";
import CalendarPreview from "@/components/home/CalendarPreview";
import ArticlesPreview from "@/components/home/ArticlesPreview";
import VerificationPrompt from "@/components/auth/VerificationPrompt";

const HomePage = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">Welcome, User!</h1>
          <VerificationPrompt />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UserProfileCard />
            <DiscussionForumPreview />
            <RecruitmentPreview />
            <ReferralPreview />
            <CalendarPreview />
            <ArticlesPreview />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default HomePage;
