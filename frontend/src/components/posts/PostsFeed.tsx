import { useEffect, useState } from "react";
import api from "@/lib/api";
import PostCard from "./PostCard";
import { Loader2, AlertCircle, PenSquare } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
}

interface PostsFeedProps {
  refreshTrigger?: number;
}

const PostsFeed = ({ refreshTrigger = 0 }: PostsFeedProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await api.get("/posts?page=1&limit=10");
        setPosts(data.data.posts);
      } catch (err: any) {
        console.error("Error fetching posts:", err);
        setError(err.response?.data?.message || "Failed to load posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-xl p-6 h-64 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="bg-red-900/20 border-red-900/50">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl flex flex-col">
        <div className="max-h-[600px] overflow-y-auto p-6 min-h-[400px] flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
              <PenSquare className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                No posts yet
              </h3>
              <p className="text-gray-400">Start sharing with the community!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostsFeed;
