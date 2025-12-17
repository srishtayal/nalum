import { useState, useRef, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Clock, Edit, Trash2, AlertCircle, RefreshCw } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import { BASE_URL } from "@/lib/constants";
import { useProfile } from "@/context/ProfileContext";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  status?: string;
  rejection_reason?: string;
}

interface PostCardProps {
  post: Post;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  showStatus?: boolean;
  showRejectionReason?: boolean;
}

const PostCard = ({
  post,
  onEdit,
  onDelete,
  showStatus,
  showRejectionReason,
}: PostCardProps) => {
  const { profile } = useProfile();
  const isAuthor = profile?.user?._id === post.userId._id;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && !isExpanded) {
      setIsTruncated(
        contentRef.current.scrollHeight > contentRef.current.clientHeight
      );
    }
  }, [post.content, isExpanded]);

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith("http")) return imagePath;
    return `${BASE_URL}/uploads/posts/${imagePath}`;
  };

  const getStatusBadge = () => {
    if (!showStatus || !post.status) return null;

    const statusConfig = {
      pending: {
        color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        text: "Pending Review",
      },
      approved: {
        color: "bg-green-500/20 text-green-400 border-green-500/30",
        text: "Approved",
      },
      rejected: {
        color: "bg-red-500/20 text-red-400 border-red-500/30",
        text: "Rejected",
      },
    };

    const config = statusConfig[post.status as keyof typeof statusConfig];
    if (!config) return null;

    return <Badge className={`${config.color} border`}>{config.text}</Badge>;
  };

  return (
    <div className="relative bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/10 transition duration-200">
      {isAuthor && (
        <div className="absolute top-4 right-4 flex gap-2">
          {post.status === "rejected" ? (
            <button
              onClick={() => onEdit?.(post)}
              className="px-3 py-1.5 text-sm font-medium text-green-400 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg transition-colors flex items-center gap-1.5"
              title="Reapply Post"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reapply
            </button>
          ) : (
            <button
              onClick={() => onEdit?.(post)}
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-full transition-colors"
              title="Edit Post"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete?.(post._id)}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
            title="Delete Post"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <UserAvatar
          src={post.userId.profile_picture}
          name={post.userId.name}
          size="md"
        />
        <div>
          <h3 className="text-white font-semibold">{post.userId.name}</h3>
          <div className="flex items-center text-xs text-gray-400 gap-1">
            <Clock className="h-3 w-3" />
            <span>
              updated{" "}
              {formatDistanceToNow(new Date(post.updatedAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white">{post.title}</h2>
          {getStatusBadge()}
        </div>
        {showRejectionReason &&
          post.status === "rejected" &&
          post.rejection_reason && (
            <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                <span className="font-semibold">Rejection Reason:</span>{" "}
                {post.rejection_reason}
              </AlertDescription>
            </Alert>
          )}
        <div>
          <div
            ref={contentRef}
            className={`text-gray-300 whitespace-pre-wrap leading-relaxed ${
              !isExpanded ? "line-clamp-4" : ""
            }`}
          >
            {post.content}
          </div>
          {isTruncated && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer transition-colors inline mt-1"
            >
              ...more
            </button>
          )}
          {isExpanded && isTruncated && (
            <button
              onClick={() => setIsExpanded(false)}
              className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer transition-colors mt-2 block"
            >
              see less
            </button>
          )}
        </div>
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="mt-4 flex flex-col gap-4">
          {post.images.map((image, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg border border-white/10 group w-full"
            >
              <img
                src={getImageUrl(image)}
                alt={`Post attachment ${index + 1}`}
                className="w-full h-auto max-h-[800px] object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;
