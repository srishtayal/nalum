import { Badge } from "@/components/ui/badge";

interface OnlineStatusProps {
  isOnline: boolean;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export const OnlineStatus = ({ isOnline, showText = true, size = "md" }: OnlineStatusProps) => {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  if (showText) {
    return (
      <Badge variant={isOnline ? "default" : "secondary"} className="gap-1">
        <span className={`${sizeClasses[size]} rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}`} />
        {isOnline ? "Online" : "Offline"}
      </Badge>
    );
  }

  return (
    <span
      className={`${sizeClasses[size]} rounded-full ${
        isOnline ? "bg-green-500" : "bg-gray-400"
      } ring-2 ring-white`}
    />
  );
};
