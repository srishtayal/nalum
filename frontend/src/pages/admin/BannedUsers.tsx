import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getBannedUsers, unbanUser, BannedUser } from "../../lib/adminApi";
import { UserX, Shield } from "lucide-react";

const BannedUsers = () => {
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBannedUsers();
  }, []);

  const fetchBannedUsers = async () => {
    try {
      const response = await getBannedUsers();
      if (response.success) {
        setBannedUsers(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch banned users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnban = async (userId: string) => {
    if (!confirm("Are you sure you want to unban this user?")) {
      return;
    }

    try {
      await unbanUser(userId);
      setBannedUsers(bannedUsers.filter((u) => u.user_id !== userId));
      alert("User unbanned successfully");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to unban user");
    }
  };

  const getTimeRemaining = (expiresAt: string | null) => {
    if (!expiresAt) return "Permanent";
    
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return "Expired";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banned Users</h1>
          <p className="text-gray-600 mt-2">{bannedUsers.length} active ban{bannedUsers.length !== 1 && "s"}</p>
        </div>

        {bannedUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Shield className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No banned users</h3>
            <p className="text-gray-600">All users are in good standing.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bannedUsers.map((ban) => (
              <div key={ban._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <UserX className="text-red-600" size={24} />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{ban.user_name}</h3>
                        <p className="text-sm text-gray-600">{ban.user_email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Reason</p>
                        <p className="font-medium">{ban.reason}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="font-medium capitalize">{ban.duration}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Banned By</p>
                        <p className="font-medium">{ban.banned_by_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Ban Date</p>
                        <p className="font-medium">{new Date(ban.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <p className="font-medium">
                          {ban.is_active ? (
                            <span className="text-red-600">{getTimeRemaining(ban.ban_expires_at)}</span>
                          ) : (
                            <span className="text-gray-500">Inactive</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUnban(ban.user_id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Shield size={18} />
                    <span>Unban</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BannedUsers;
