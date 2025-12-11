import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, User, Calendar, Mail, GraduationCap, Clock } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";

interface VerificationQueueItem {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  };
  details_provided: {
    name: string;
    roll_no?: string;
    batch: string;
    branch: string;
  };
  createdAt: string;
}

const VerificationQueue = () => {
  const [queue, setQueue] = useState<VerificationQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<VerificationQueueItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  
  const fetchQueue = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/verification/queue`,
        { withCredentials: true }
      );
      setQueue(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch queue:", err);
      toast.error("Failed to load verification queue");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleApprove = async (userId: string) => {
    setActionLoading(userId);
    try {
      await axios.post(
        `${BASE_URL}/admin/verification/approve/${userId}`,
        {},
        { withCredentials: true }
      );
      toast.success("User verification approved!", {
        style: {
          background: "#10B981",
          color: "white",
        },
      });
      fetchQueue();
    } catch (err) {
      console.error("Failed to approve:", err);
      toast.error("Failed to approve verification");
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
      toast.error("Please provide a reason");
      return;
    }

    setActionLoading(selectedItem.user._id);
    try {
      await axios.post(
        `${BASE_URL}/admin/verification/reject/${selectedItem.user._id}`,
        { reason: rejectReason },
        { withCredentials: true }
      );
      toast.success("Verification rejected");
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedItem(null);
      fetchQueue();
    } catch (err) {
      console.error("Failed to reject:", err);
      toast.error("Failed to reject verification");
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Verification Queue</h1>
          <p className="text-gray-600 mt-2">
            {queue.length} pending verification{queue.length !== 1 && "s"}
          </p>
        </div>

        {/* Queue List */}
        {queue.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No pending verifications
              </h3>
              <p className="text-gray-600">All verification requests have been processed.</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {queue.map((item) => (
              <Card key={item._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-6">
                    {/* User Info */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {item.user.name}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {item.user.role}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          {item.user.email}
                        </div>
                      </div>

                      {/* Provided Details */}
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <h4 className="font-medium text-sm text-gray-700 mb-3">
                          Verification Details
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                              <User className="h-3 w-3" />
                              Name Provided
                            </div>
                            <p className="font-medium text-sm">{item.details_provided.name}</p>
                          </div>
                          {item.details_provided.roll_no && (
                            <div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                <GraduationCap className="h-3 w-3" />
                                Roll Number
                              </div>
                              <p className="font-medium text-sm">{item.details_provided.roll_no}</p>
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                              <Calendar className="h-3 w-3" />
                              Batch
                            </div>
                            <p className="font-medium text-sm">{item.details_provided.batch}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                              <GraduationCap className="h-3 w-3" />
                              Branch
                            </div>
                            <p className="font-medium text-sm">{item.details_provided.branch}</p>
                          </div>
                        </div>
                      </div>

                      {/* Timestamp */}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        Submitted: {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleApprove(item.user._id)}
                        disabled={actionLoading === item.user._id}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleRejectClick(item)}
                        disabled={actionLoading === item.user._id}
                        variant="destructive"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Reject Modal */}
        <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Verification</DialogTitle>
              <DialogDescription>
                Provide a reason for rejecting {selectedItem?.user.name}'s verification request.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                rows={4}
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedItem(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim() || !!actionLoading}
              >
                Reject Verification
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default VerificationQueue;
