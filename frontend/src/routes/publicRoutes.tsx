import { lazy } from "react";
import { Route } from "react-router-dom";

// Lazy loaded public pages
const Root = lazy(() => import("@/pages/Root"));
const HomePage = lazy(() => import("@/pages/HomePage"));
const NotableAlumni = lazy(() => import("@/pages/stories/notableAlumni"));
const AlumniStories = lazy(() => import("@/pages/stories/alumniStories"));
const GivingStories = lazy(() => import("@/pages/stories/givingStories"));
const CampusNews = lazy(() => import("@/pages/stories/campusNews"));
const ClubsPage = lazy(() => import("@/pages/communities/clubs"));
const IndustriesPage = lazy(() => import("@/pages/communities/industries"));
const RecentGradsPage = lazy(() => import("@/pages/communities/recentGrads"));
const LearningPage = lazy(() => import("@/pages/benefits/learning"));
const CareerPage = lazy(() => import("@/pages/benefits/career"));
const AlumniDirectoryHome = lazy(() => import("@/pages/benefits/alumniDirectoryHome"));
const GivingHome = lazy(() => import("@/pages/benefits/givingHome"));
const AttendAnEvent = lazy(() => import("@/pages/events/attendAnEvent"));
const ExploreCommunities = lazy(() => import("@/pages/communities/exploreCommunities"));
const AboutPage = lazy(() => import("@/pages/About"));

export function PublicRoutes() {
  return (
    <Route path="/" element={<Root />}>
      <Route index element={<HomePage />} />
      <Route path="/stories/notable-alumni" element={<NotableAlumni />} />
      <Route path="/stories/alumni-stories" element={<AlumniStories />} />
      <Route path="/stories/giving-stories" element={<GivingStories />} />
      <Route path="/stories/campus-news" element={<CampusNews />} />
      <Route path="/communities/clubs" element={<ClubsPage />} />
      <Route path="/communities/industries" element={<IndustriesPage />} />
      <Route path="/communities/recent-grads" element={<RecentGradsPage />} />
      <Route path="/benefits/learning" element={<LearningPage />} />
      <Route path="/benefits/career" element={<CareerPage />} />
      <Route path="/benefits/alumni-directory" element={<AlumniDirectoryHome />} />
      <Route path="/giving" element={<GivingHome />} />
      <Route path="/events/attend" element={<AttendAnEvent />} />
      <Route path="/communities/explore" element={<ExploreCommunities />} />
      <Route path="/about" element={<AboutPage />} />
    </Route>
  );
}
