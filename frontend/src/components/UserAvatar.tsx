import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BASE_URL } from '@/lib/constants';

interface UserAvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-24 h-24 text-3xl',
};

const UserAvatar = ({ src, name, size = 'md', className = '' }: UserAvatarProps) => {
  // Get initials from name
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate consistent color based on name
  const getColorFromName = (fullName: string) => {
    const colors = [
      'from-[#800000] to-[#600000]', // Maroon
      'from-[#8B0000] to-[#660000]', // Dark red
      'from-[#900000] to-[#700000]', // Deep red
      'from-[#7A0000] to-[#5A0000]', // Wine
      'from-[#A00000] to-[#800000]', // Crimson
    ];
    
    // Simple hash function to get consistent color
    const hash = fullName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const initials = getInitials(name);
  const gradient = getColorFromName(name);
  const imageUrl = src ? `${BASE_URL}${src}` : undefined;

  return (
    <Avatar className={`${sizeClasses[size]} border-2 border-white shadow-md ${className}`}>
      <AvatarImage src={imageUrl} alt={name} crossOrigin="anonymous" />
      <AvatarFallback className={`bg-gradient-to-br ${gradient} text-white font-semibold`}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
