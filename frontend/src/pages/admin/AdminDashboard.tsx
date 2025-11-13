import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Calendar, 
  FileText, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import apiClient from '@/lib/api';

interface DashboardStats {
  users: {
    total: number;
    students: number;
    alumni: number;
    verified_alumni: number;
    banned: number;
    recent_registrations: number;
  };
  verifications: {
    pending: number;
    verified: number;
  };
  events: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  newsletters: {
    total: number;
    total_views: number;
    total_downloads: number;
  };
  bans: {
    active: number;
    total: number;
  };
}

const AdminDashboard = () => {
  const { user, accessToken } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accessToken) {
      fetchDashboardStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const fetchDashboardStats = async () => {
    try {
      const response = await apiClient.get(
        '/admin/statistics/dashboard',
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#800000] border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your alumni portal today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats?.users.total || 0}
              </div>
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +{stats?.users.recent_registrations || 0} this month
              </p>
            </CardContent>
          </Card>

          {/* Verified Alumni */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Verified Alumni
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats?.users.verified_alumni || 0}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {stats?.users.alumni || 0} total alumni
              </p>
            </CardContent>
          </Card>

          {/* Pending Verifications */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Verifications
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats?.verifications.pending || 0}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {stats?.verifications.verified || 0} verified
              </p>
            </CardContent>
          </Card>

          {/* Pending Events */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Events
              </CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats?.events.pending || 0}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {stats?.events.total || 0} total events
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Stats */}
          <Card>
            <CardHeader>
              <CardTitle>User Statistics</CardTitle>
              <CardDescription>Overview of user distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-gray-600">Students</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {stats?.users.students || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-sm text-gray-600">Alumni</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {stats?.users.alumni || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <span className="text-sm text-gray-600">Verified Alumni</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {stats?.users.verified_alumni || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span className="text-sm text-gray-600">Banned</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {stats?.users.banned || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Event Approval Status</CardTitle>
              <CardDescription>Event moderation overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-gray-600">Pending</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {stats?.events.pending || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Approved</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {stats?.events.approved || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-gray-600">Rejected</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {stats?.events.rejected || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <span className="text-sm font-medium text-gray-700">Total Events</span>
                  <span className="text-sm font-bold">
                    {stats?.events.total || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Newsletters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Newsletters</CardTitle>
                  <CardDescription>Published content</CardDescription>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.newsletters.total || 0}</div>
              <div className="mt-3 space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Total Views:</span>
                  <span className="font-semibold">{stats?.newsletters.total_views || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Downloads:</span>
                  <span className="font-semibold">{stats?.newsletters.total_downloads || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bans */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">User Bans</CardTitle>
                  <CardDescription>Moderation actions</CardDescription>
                </div>
                <UserX className="h-8 w-8 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.bans.active || 0}</div>
              <div className="mt-3 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Total Bans:</span>
                  <span className="font-semibold">{stats?.bans.total || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats?.verifications.pending > 0 && (
                  <a
                    href="/admin-panel/verifications"
                    className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700"
                  >
                    <AlertCircle className="h-4 w-4" />
                    Review {stats.verifications.pending} pending verifications
                  </a>
                )}
                {stats?.events.pending > 0 && (
                  <a
                    href="/admin-panel/events"
                    className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700"
                  >
                    <Calendar className="h-4 w-4" />
                    Approve {stats.events.pending} pending events
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
