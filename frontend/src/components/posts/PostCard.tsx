import { formatDistanceToNow } from "date-fns";
import { Clock, Edit, Trash2 } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import { BASE_URL } from "@/lib/constants";
import { useProfile } from "@/context/ProfileContext";

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

interface PostCardProps {
  post: Post;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
}

const PostCard = ({ post, onEdit, onDelete }: PostCardProps) => {
  const { profile } = useProfile();
  const isAuthor = profile?.user?._id === post.userId._id;

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith("http")) return imagePath;
    return `${BASE_URL}/uploads/posts/${imagePath}`;
  };

  return (
    <div className="relative bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/10 transition duration-200">
      {isAuthor && (
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => onEdit?.(post)}
            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-full transition-colors"
            title="Edit Post"
          >
            <Edit className="w-4 h-4" />
          </button>
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
          src={undefined} // Profile picture would need to be populated from userId if available in the model
          name={post.userId.name}
          size="md"
        />
        <div>
          <h3 className="text-white font-semibold">{post.userId.name}</h3>
          <div className="flex items-center text-xs text-gray-400 gap-1">
            <Clock className="h-3 w-3" />
            <span>
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-white">{post.title}</h2>
        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="mt-4 flex gap-2">
          {post.images.map((image, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-lg border border-white/10 group ${
                post.images.length === 1 ? "w-full" : "w-1/2"
              }`}
            >
              <img
                src={getImageUrl(image)}
                alt={`Post attachment ${index + 1}`}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostCard;
