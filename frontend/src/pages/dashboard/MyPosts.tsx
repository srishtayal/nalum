import { useState, useEffect } from "react";
import { useProfile } from "@/context/ProfileContext";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import PostCard from "@/components/posts/PostCard";
import EditPostModal from "@/components/posts/EditPostModal";
import { Loader2, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

interface Post {
  _id: string;
  title: string;
  content: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  images: string[];
  createdAt: string;
  updatedAt: string;
}

const MyPosts = () => {
  const { profile } = useProfile();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (user?.role === "alumni") {
      fetchMyPosts();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchMyPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/posts");
      const allPosts = data.data.posts;
      const myPosts = allPosts.filter(
        (post: Post) => post.userId._id === profile?.user?._id
      );
      setPosts(myPosts);
    } catch (err: any) {
      console.error("Error fetching posts:", err);
      setError(err.response?.data?.message || "Failed to load your posts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
      toast.success("Post deleted successfully");
    } catch (err: any) {
      console.error("Error deleting post:", err);
      toast.error(err.response?.data?.message || "Failed to delete post");
    }
  };

  if (user?.role === "student") {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">My Posts</h1>
        </div>

        <Alert className="bg-blue-900/20 border-blue-900/50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Coming Soon</AlertTitle>
          <AlertDescription>
            Post management will be available for students in future.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">My Posts</h1>
        </div>

        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-6 h-64 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">My Posts</h1>
        </div>

        <Alert
          variant="destructive"
          className="bg-red-900/20 border-red-900/50"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">My Posts</h1>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl flex flex-col">
          <div className="max-h-[600px] overflow-y-auto p-6 min-h-[400px] flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                <FileText className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  No posts yet
                </h3>
                <p className="text-gray-400">
                  You haven't created any posts yet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">My Posts</h1>
        <p className="text-gray-400">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <EditPostModal
        open={isEditModalOpen}
        post={selectedPost}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPost(null);
        }}
        onPostUpdated={fetchMyPosts}
      />
    </div>
  );
};

export default MyPosts;
