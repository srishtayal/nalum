import { Facebook, Twitter, Instagram, Linkedin, Heart, MessageCircle, Share2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Demo posts - replace with API data later
const demoPosts = [
  {
    id: 1,
    author: 'Rahul Sharma',
    username: '@rahulsharma',
    avatar: 'RS',
    platform: 'instagram',
    content: 'Proud to be an NSUT alumnus! From the classrooms of Dwarka to leading tech innovations at Google. Forever grateful for the foundation NSUT provided. #TrueNALUM',
    image: '/homeGallery/Om (2).JPG', // Added image
    likes: 234,
    comments: 45,
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    author: 'Priya Verma',
    username: '@priyav',
    avatar: 'PV',
    platform: 'twitter',
    content: 'Just received my PhD from MIT! None of this would be possible without the incredible faculty and environment at NSUT. Thank you for believing in us! #TrueNALUM #NSUTAlumni',
    image: null,
    likes: 567,
    comments: 89,
    timestamp: '5 hours ago',
  },
  {
    id: 3,
    author: 'Arjun Patel',
    username: '@arjunpatel',
    avatar: 'AP',
    platform: 'linkedin',
    content: 'Celebrating 10 years since graduation! NSUT taught me not just engineering, but leadership, innovation, and perseverance. Now mentoring the next generation of engineers. #TrueNALUM',
    image: '/homeGallery/Om (36).JPG', // Added image
    likes: 412,
    comments: 67,
    timestamp: '1 day ago',
  },
  {
    id: 4,
    author: 'Sneha Gupta',
    username: '@snehagupta',
    avatar: 'SG',
    platform: 'instagram',
    content: 'Started my own EdTech startup! NSUT was where my entrepreneurial journey began. Shoutout to all my professors and friends who supported this dream. #TrueNALUM #Startup',
    image: null,
    likes: 891,
    comments: 123,
    timestamp: '2 days ago',
  },
  {
    id: 5,
    author: 'Vikram Singh',
    username: '@vikramsingh',
    avatar: 'VS',
    platform: 'facebook',
    content: 'Back at campus after 5 years! The memories, the friendships, the late-night study sessions - NSUT will always be home. Once a NSUTian, always a NSUTian! #TrueNALUM',
    image: '/homeGallery/Om (50).JPG', // Added image
    likes: 654,
    comments: 98,
    timestamp: '3 days ago',
  },
];

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'instagram':
      return Instagram;
    case 'twitter':
      return Twitter;
    case 'linkedin':
      return Linkedin;
    case 'facebook':
      return Facebook;
    default:
      return Instagram;
  }
};

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case 'instagram':
      return 'from-purple-600 to-pink-600';
    case 'twitter':
      return 'from-blue-400 to-blue-600';
    case 'linkedin':
      return 'from-blue-600 to-blue-800';
    case 'facebook':
      return 'from-blue-500 to-blue-700';
    default:
      return 'from-gray-600 to-gray-800';
  }
};

const SocialMediaSection = () => {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <div className="relative py-12 md:py-20 bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23800000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-block mb-3">
            <span className="text-nsut-maroon text-xs md:text-sm font-semibold tracking-wider uppercase">
              Community Stories
            </span>
          </div>
          <h2 className="text-2xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Be <span className="text-transparent bg-clip-text bg-gradient-to-r from-nsut-maroon to-red-600">#TrueNALUM</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Share your journey, inspire others, and stay connected with the NSUT alumni community
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {demoPosts.map((post) => {
            const PlatformIcon = getPlatformIcon(post.platform);
            const platformGradient = getPlatformColor(post.platform);

            return (
              <div
                key={post.id}
                className="group bg-white rounded-xl border-2 border-gray-100 hover:border-nsut-maroon/30 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Post Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nsut-maroon to-red-700 flex items-center justify-center text-white font-bold text-sm">
                      {post.avatar}
                    </div>

                    {/* Author info */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{post.author}</h4>
                      <p className="text-xs text-gray-500">{post.username} • {post.timestamp}</p>
                    </div>

                    {/* Platform icon */}
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${platformGradient}`}>
                      <PlatformIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="flex-grow">
                  {/* Image if exists */}
                  {post.image && (
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={post.image}
                        alt={`Post by ${post.author}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Gradient overlay for better text readability if needed */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}

                  {/* Text content */}
                  <div className="p-4">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                </div>

                {/* Post Footer */}
                <div className="p-4 pt-0 border-t border-gray-50 mt-auto">
                  <div className="flex items-center gap-4 text-gray-500 text-sm">
                    <div className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-blue-500 transition-colors cursor-pointer">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-green-500 transition-colors cursor-pointer ml-auto">
                      <Share2 className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Social Links & CTA */}
        <div className="text-center">
          {/* Social Icons */}
          <div className="flex justify-center gap-4 mb-8">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="group p-3 rounded-full bg-gray-100 hover:bg-nsut-maroon transition-all duration-300 hover:scale-110"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            variant="outline"
            className="border-2 border-nsut-maroon text-nsut-maroon hover:bg-nsut-maroon hover:text-white font-semibold px-8"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Follow NSUT Alumni on Social Media
          </Button>

          {/* Hashtag reminder */}
          <p className="mt-6 text-sm text-gray-500">
            Share your story with <span className="font-semibold text-nsut-maroon">#TrueNALUM</span> to be featured here
          </p>

          {/* Demo disclaimer */}
          <p className="mt-3 text-xs text-gray-400 italic">
            * Posts shown above are demo examples. Real alumni posts will be displayed here soon!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaSection;
