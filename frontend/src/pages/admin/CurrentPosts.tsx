import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  FileText,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  User,
} from "lucide-react";
import api from "../../lib/api";
import { BASE_URL } from "../../lib/constants";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { toast } from "sonner";

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
  likes?: number;
}

const CurrentPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Edit Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    content: "",
  });
  const [updating, setUpdating] = useState(false);

  // Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      filterPosts();
    }, 500);

    return () => clearTimeout(timer);
  }, [posts, searchTerm, statusFilter]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/admin/posts/all", {
        params: {
          page: 1,
          limit: 100,
        },
      });
      if (response.data.success) {
        setPosts(response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];

    // Filter by search term (title or author)
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.userId.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((post) => post.status === statusFilter);
    }

    setFilteredPosts(filtered);
  };

  const handleEditClick = (post: Post) => {
    setSelectedPost(post);
    setEditFormData({
      title: post.title,
      content: post.content,
    });
    setEditDialogOpen(true);
  };

  const handleUpdatePost = async () => {
    if (!selectedPost) return;

    if (!editFormData.title.trim() || !editFormData.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setUpdating(true);
    try {
      const response = await api.put(`/admin/posts/${selectedPost._id}`, {
        title: editFormData.title,
        content: editFormData.content,
      });

      if (response.data.success) {
        toast.success("Post updated successfully!");
        setEditDialogOpen(false);
        setSelectedPost(null);
        fetchPosts();
      }
    } catch (err) {
      console.error("Failed to update post:", err);
      toast.error(err.response?.data?.message || "Failed to update post");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = (post: Post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;

    setDeleting(true);
    try {
      const response = await api.delete(`/admin/posts/${postToDelete._id}`);
      if (response.data.success) {
        toast.success("Post deleted successfully!");
        setDeleteDialogOpen(false);
        setPostToDelete(null);
        fetchPosts();
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
      toast.error(err.response?.data?.message || "Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
      approved: "bg-green-500/20 text-green-600 border-green-500/30",
      rejected: "bg-red-500/20 text-red-600 border-red-500/30",
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith("http")) return imagePath;
    return `${BASE_URL}/uploads/posts/${imagePath}`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Current Posts</h1>
            <p className="text-gray-600 mt-2">
              {filteredPosts.length} post{filteredPosts.length !== 1 && "s"}{" "}
              found
            </p>
          </div>
          <Button
            onClick={fetchPosts}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search" className="flex items-center gap-2 mb-2">
                <Search size={16} />
                Search
              </Label>
              <Input
                id="search"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label
                htmlFor="status-filter"
                className="flex items-center gap-2 mb-2"
              >
                <Filter size={16} />
                Status
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Posts List */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <RefreshCw
              className="mx-auto text-gray-400 mb-4 animate-spin"
              size={48}
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Loading posts...
            </h3>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No posts found
            </h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Post Image */}
                  {post.images && post.images.length > 0 && (
                    <div className="flex-shrink-0">
                      <div className="w-40 h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={getImageUrl(post.images[0])}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement!.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                                <svg class="text-gray-400" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                  <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                              </div>
                            `;
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Post Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {post.title}
                        </h3>
                        <div className="flex gap-2 mt-1">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(
                              post.status
                            )}`}
                          >
                            {post.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditClick(post)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                        >
                          <Edit size={16} className="mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(post)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
                        >
                          <Trash2 size={16} className="mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {truncateContent(post.content)}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Author:</span>{" "}
                        <span className="font-medium">{post.userId.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>{" "}
                        <span className="font-medium">{post.userId.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Created:</span>{" "}
                        <span className="font-medium">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Likes:</span>{" "}
                        <span className="font-medium">{post.likes || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
              <DialogDescription>
                Update the post title and content
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* Title */}
              <div>
                <Label htmlFor="edit-title">Post Title *</Label>
                <Input
                  id="edit-title"
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                  placeholder="Enter post title"
                />
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="edit-content">Content *</Label>
                <Textarea
                  id="edit-content"
                  value={editFormData.content}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      content: e.target.value,
                    })
                  }
                  className="min-h-[200px]"
                  placeholder="Enter post content"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  onClick={() => setEditDialogOpen(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700"
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleUpdatePost}
                  disabled={updating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {updating ? "Updating..." : "Update Post"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Post</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{postToDelete?.title}"? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-4">
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700"
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default CurrentPosts;
