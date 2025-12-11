import { Badge } from "@/components/ui/badge";
import { GraduationCap, MapPin } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import { ConnectionButton } from "@/components/ui/ConnectionButton";
import type { AlumniProfile } from "@/hooks/useAlumniDirectory";

interface AlumniCardProps {
  alumni: AlumniProfile;
  onConnect: (userId: string) => void;
  onClick: () => void;
}

export const AlumniCard = ({ alumni, onConnect, onClick }: AlumniCardProps) => {
  return (
    <div
      onClick={onClick}
      className="group rounded-xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 cursor-pointer p-6 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30"
    >
      {/* Avatar and Name Section */}
      <div className="flex items-start gap-4 mb-4">
        <UserAvatar
          src={alumni.profile_picture}
          name={alumni.user.name}
          size="lg"
          className="ring-2 ring-white/10 group-hover:ring-blue-500/40 transition-all"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-white truncate group-hover:text-blue-300 transition-colors">
            {alumni.user.name}
          </h3>
          {alumni.current_role && alumni.current_company && (
            <p className="text-sm text-gray-400 truncate">
              {alumni.current_role} at {alumni.current_company}
            </p>
          )}
        </div>
      </div>

      {/* Education and Location Section */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <GraduationCap className="h-4 w-4 text-blue-400" />
          <span>
            {alumni.branch} • {alumni.batch}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <MapPin className="h-4 w-4 text-blue-400" />
          <span>{alumni.campus}</span>
        </div>
      </div>

      {/* Skills Section */}
      {alumni.skills && alumni.skills.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {alumni.skills.slice(0, 3).map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-white/5 text-gray-300 border border-white/5"
              >
                {skill}
              </Badge>
            ))}
            {alumni.skills.length > 3 && (
              <Badge
                variant="secondary"
                className="text-xs bg-white/5 text-gray-300 border border-white/5"
              >
                +{alumni.skills.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Connection Button */}
      <ConnectionButton
        status={alumni.connectionStatus}
        userId={alumni.user._id}
        onConnect={onConnect}
        size="sm"
        fullWidth
      />
    </div>
  );
};
