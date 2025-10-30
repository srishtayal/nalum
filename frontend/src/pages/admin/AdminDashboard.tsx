import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import StatsCard from "../../components/admin/StatsCard";
import {
  Users,
  CheckCircle,
  Calendar,
  FileText,
  Ban,
  TrendingUp,
} from "lucide-react";
import { getDashboardStats, DashboardStats } from "../../lib/adminApi";

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        if (response.success) {
          setStats(response.stats);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard stats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !stats) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error || "Failed to load stats"}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Overview of your alumni management system
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="Total Users"
            value={stats.users.total}
            icon={Users}
            color="blue"
            subtitle={`${stats.users.students} students, ${stats.users.alumni} alumni`}
          />
          <StatsCard
            title="Verified Alumni"
            value={stats.users.verified_alumni}
            icon={CheckCircle}
            color="green"
            subtitle={`${stats.verifications.pending} pending verification`}
          />
          <StatsCard
            title="Pending Events"
            value={stats.events.pending}
            icon={Calendar}
            color="yellow"
            subtitle={`${stats.events.approved} approved, ${stats.events.rejected} rejected`}
          />
          <StatsCard
            title="Active Newsletters"
            value={stats.newsletters.total}
            icon={FileText}
            color="purple"
            subtitle={`${stats.newsletters.total_views} total views`}
          />
          <StatsCard
            title="Banned Users"
            value={stats.bans.total}
            icon={Ban}
            color="red"
            subtitle={`${stats.bans.active} currently active`}
          />
          <StatsCard
            title="Recent Registrations"
            value={stats.users.recent_registrations}
            icon={TrendingUp}
            color="green"
            subtitle="Last 30 days"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Verification Queue Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Verification Queue
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Verifications</span>
                <span className="font-semibold text-blue-600">
                  {stats.verifications.pending}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Verified Alumni</span>
                <span className="font-semibold text-green-600">
                  {stats.verifications.verified}
                </span>
              </div>
            </div>
            <a
              href="/admin-panel/verifications"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View Queue →
            </a>
          </div>

          {/* Events Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Events Overview
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Approval</span>
                <span className="font-semibold text-yellow-600">
                  {stats.events.pending}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Approved Events</span>
                <span className="font-semibold text-green-600">
                  {stats.events.approved}
                </span>
              </div>
            </div>
            <a
              href="/admin-panel/events"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Manage Events →
            </a>
          </div>
        </div>

        {/* Newsletter Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Newsletter Engagement
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Newsletters</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.newsletters.total}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.newsletters.total_views}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Downloads</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.newsletters.total_downloads}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
