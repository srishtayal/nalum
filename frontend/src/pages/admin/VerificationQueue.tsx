import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  getVerificationQueue,
  approveVerification,
  rejectVerification,
  VerificationQueueItem,
} from "../../lib/adminApi";
import { CheckCircle, XCircle, User } from "lucide-react";

const VerificationQueue = () => {
  const [queue, setQueue] = useState<VerificationQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<VerificationQueueItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const fetchQueue = async () => {
    console.log("[VerificationQueue] Starting to fetch queue...");
    try {
      const response = await getVerificationQueue(1, 50);
      console.log("[VerificationQueue] API Response:", response);
      if (response.success) {
        console.log("[VerificationQueue] Queue data:", response.data);
        console.log("[VerificationQueue] Queue length:", response.data.length);
        setQueue(response.data);
      } else {
        console.error("[VerificationQueue] Response not successful:", response);
      }
    } catch (err: any) {
      console.error("[VerificationQueue] Failed to fetch queue:", err);
      console.error("[VerificationQueue] Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
    } finally {
      setIsLoading(false);
      console.log("[VerificationQueue] Loading complete");
    }
  };

  useEffect(() => {
    console.log("[VerificationQueue] Component mounted");
    fetchQueue();
  }, []);

  const handleApprove = async (userId: string) => {
    setActionLoading(userId);
    try {
      await approveVerification(userId);
      setQueue(queue.filter((item) => item.user._id !== userId));
      alert("User approved successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to approve");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectClick = (item: VerificationQueueItem) => {
    setSelectedItem(item);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedItem || !rejectReason.trim()) {
      alert("Please provide a reason");
      return;
    }

    setActionLoading(selectedItem.user._id);
    try {
      await rejectVerification(selectedItem.user._id, rejectReason);
      setQueue(queue.filter((item) => item.user._id !== selectedItem.user._id));
      setShowRejectModal(false);
      setRejectReason("");
      alert("Verification rejected");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to reject");
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    console.log("[VerificationQueue] Rendering loading state");
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  console.log("[VerificationQueue] Rendering with queue:", queue);
  console.log("[VerificationQueue] Queue length:", queue.length);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Verification Queue</h1>
          <p className="text-gray-600 mt-2">
            {queue.length} pending verification{queue.length !== 1 && "s"}
          </p>
        </div>

        {queue.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <User className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No pending verifications
            </h3>
            <p className="text-gray-600">All verification requests have been processed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {queue.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.user.name}
                    </h3>
                    <p className="text-sm text-gray-600">{item.user.email}</p>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Provided Name</p>
                        <p className="font-medium">{item.details_provided.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Batch</p>
                        <p className="font-medium">{item.details_provided.batch}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Branch</p>
                        <p className="font-medium">{item.details_provided.branch}</p>
                      </div>
                      {item.details_provided.roll_no && (
                        <div>
                          <p className="text-xs text-gray-500">Roll No</p>
                          <p className="font-medium">{item.details_provided.roll_no}</p>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-4">
                      Submitted: {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleApprove(item.user._id)}
                      disabled={actionLoading === item.user._id}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                    >
                      <CheckCircle size={18} />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleRejectClick(item)}
                      disabled={actionLoading === item.user._id}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                    >
                      <XCircle size={18} />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Reject Verification</h3>
              <p className="text-sm text-gray-600 mb-4">
                Provide a reason for rejecting {selectedItem?.user.name}'s verification:
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px]"
                placeholder="Enter reason..."
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectSubmit}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default VerificationQueue;
