import { Button } from "./button";
import { UserPlus } from "lucide-react";

interface ConnectionButtonProps {
  status?: string;
  userId: string;
  onConnect: (userId: string) => void;
  size?: "sm" | "default" | "lg";
  fullWidth?: boolean;
}

export const ConnectionButton = ({
  status = "not_connected",
  userId,
  onConnect,
  size = "sm",
  fullWidth = true,
}: ConnectionButtonProps) => {
  const baseClasses = fullWidth ? "w-full" : "";

  if (status === "accepted") {
    return (
      <Button
        size={size}
        variant="ghost"
        disabled
        className={`${baseClasses} text-green-400 bg-green-500/10`}
      >
        Connected
      </Button>
    );
  }

  if (status === "pending") {
    return (
      <Button
        size={size}
        variant="ghost"
        disabled
        className={`${baseClasses} text-amber-400 bg-amber-500/10`}
      >
        Pending
      </Button>
    );
  }

  // Default: Connect button
  return (
    <Button
      size={size}
      onClick={(e) => {
        e.stopPropagation();
        onConnect(userId);
      }}
      className={`${baseClasses} bg-indigo-600 hover:bg-indigo-700 text-white`}
    >
      <UserPlus className="h-3 w-3 mr-1" />
      Connect
    </Button>
  );
};
