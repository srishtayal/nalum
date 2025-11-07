export default function FeatureCards() {
  const cards = [
    {
      id: 1,
      title: "Update Profile",
      subtitle: "Keep your info current",
      color: "from-orange-400 to-orange-600",
      image: "/dashboardpublic/profile-card-design.jpg",
    },
    {
      id: 2,
      title: "Mentorship",
      subtitle: "Find a mentor",
      color: "from-gray-200 to-gray-300",
      hasBadge: true,
      image: "/dashboardpublic/mentorship-card-design.jpg",
    },
    {
      id: 3,
      title: "Post a Job",
      subtitle: "Share opportunities",
      color: "from-gray-100 to-gray-200",
      image: "/dashboardpublic/job-posting-card-design.jpg",
    },
    {
      id: 4,
      title: "Give Back",
      subtitle: "Support the community",
      color: "from-teal-500 to-teal-600",
      image: "/dashboardpublic/giveback-card-design.jpg",
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.id} className="rounded-lg overflow-hidden hover:opacity-90 transition cursor-pointer group">
          {/* Card Image */}
          <div className="relative h-24 bg-gray-800 overflow-hidden mb-3 rounded-lg">
            <img src={card.image || "/placeholder.svg"} alt={card.title} className="w-full h-full object-cover" />
            {card.hasBadge && <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />}
          </div>

          {/* Card Content */}
          <div>
            <h3 className="font-semibold text-white text-sm">{card.title}</h3>
            <p className="text-xs text-gray-400">{card.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
