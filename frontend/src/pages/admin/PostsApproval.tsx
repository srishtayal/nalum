import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  FileText,
  User,
  Mail,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import api from "../../lib/api";
import { BASE_URL } from "../../lib/constants";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

interface Post {
  _id: string;
  title: string;
  content: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    profile_picture?: string;
  };
  images: string[];
  createdAt: string;
  updatedAt: string;
  status: string;
}

const PostsApproval = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchPosts();
    }, 10000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get("/admin/posts/pending");
      if (response.data.success) {
        setPosts(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch pending posts:", err);
      toast.error("Failed to load pending posts");
    } finally {
      setIsLoading(false);
    }
  };

  // Manual refresh function
  const handleRefresh = async () => {
    setIsLoading(true);
    await fetchPosts();
  };

  const handleApprove = async (postId: string) => {
    try {
      const response = await api.put(`/admin/posts/${postId}/approve`);
      if (response.data.success) {
        setPosts(posts.filter((p) => p._id !== postId));
        toast.success("Post approved successfully!");
      }
    } catch (err) {
      console.error("Failed to approve post:", err);
      toast.error(err.response?.data?.message || "Failed to approve post");
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedPost || !rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.put(
        `/admin/posts/${selectedPost._id}/reject`,
        {
          reason: rejectReason,
        }
      );
      if (response.data.success) {
        setPosts(posts.filter((p) => p._id !== selectedPost._id));
        setShowRejectModal(false);
        setRejectReason("");
        setSelectedPost(null);
        toast.success("Post rejected successfully");
      }
    } catch (err) {
      console.error("Failed to reject post:", err);
      toast.error(err.response?.data?.message || "Failed to reject post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith("http")) return imagePath;
    return `${BASE_URL}/uploads/posts/${imagePath}`;
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (isLoading && posts.length === 0) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Post Approvals
              </h1>
              <Skeleton className="h-4 w-48 mt-2" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Post Approvals</h1>
            <p className="text-gray-600 mt-2">
              {posts.length} pending post{posts.length !== 1 && "s"}
              <span className="text-xs text-gray-500 ml-2">
                • Auto-refreshes every 10s
              </span>
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Refresh now"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No pending posts
            </h3>
            <p className="text-gray-600">All posts have been processed.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="flex gap-6 p-6">
                  {/* Post Images Preview */}
                  {post.images && post.images.length > 0 && (
                    <div className="flex-shrink-0">
                      <div className="w-64 h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={getImageUrl(post.images[0])}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement!.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                                <svg class="text-gray-400" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                  <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                              </div>
                            `;
                          }}
                        />
                        {post.images.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <ImageIcon size={12} />+{post.images.length - 1}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Post Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {truncateContent(post.content)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => handleApprove(post._id)}
                          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm min-w-[140px]"
                        >
                          <CheckCircle size={18} />
                          <span className="font-medium">Approve</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPost(post);
                            setShowRejectModal(true);
                          }}
                          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm min-w-[140px]"
                        >
                          <XCircle size={18} />
                          <span className="font-medium">Reject</span>
                        </button>
                      </div>
                    </div>

                    {/* Author Information */}
                    <div className="border-t pt-3 mt-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Author Information
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-2">
                          <User className="text-gray-400 mt-0.5" size={18} />
                          <div>
                            <p className="text-xs text-gray-500">Name</p>
                            <p className="font-medium text-sm">
                              {post.userId.name}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Mail className="text-gray-400 mt-0.5" size={18} />
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <a
                              href={`mailto:${post.userId.email}`}
                              className="font-medium text-sm text-blue-600 hover:underline"
                            >
                              {post.userId.email}
                            </a>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Calendar
                            className="text-gray-400 mt-0.5"
                            size={18}
                          />
                          <div>
                            <p className="text-xs text-gray-500">Created</p>
                            <p className="font-medium text-sm">
                              {new Date(post.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </div>

                        {post.images && post.images.length > 0 && (
                          <div className="flex items-start gap-2">
                            <ImageIcon
                              className="text-gray-400 mt-0.5"
                              size={18}
                            />
                            <div>
                              <p className="text-xs text-gray-500">Images</p>
                              <p className="font-medium text-sm">
                                {post.images.length} image
                                {post.images.length !== 1 && "s"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Post</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this post. This will be
              visible to the author.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectModal(false);
                setRejectReason("");
                setSelectedPost(null);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectSubmit}
              disabled={isSubmitting || !rejectReason.trim()}
            >
              {isSubmitting ? "Rejecting..." : "Reject Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default PostsApproval;
