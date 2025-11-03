"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"
import { useRef } from "react"

export default function ActivitySection() {
  const [activeTab, setActiveTab] = useState("All Activity")
  const scrollContainerRef = useRef(null)

  const tabs = ["All Activity", "Jobs and Internships", "Opportunities", "Forums"]

  const activities = [
    {
      id: 1,
      type: "news",
      avatar: "/dashboardpublic/university-avatar.jpg",
      title: "University News",
      time: "2 hours ago",
      postTitle: "Annual Alumni Gala Announced",
      content: "Join us for a night of celebration and networking on December 5th. Early bird tickets available now.",
      image: "/dashboardpublic/alumni-gala-event.jpg",
      hasView: true,
    },
    {
      id: 2,
      type: "post",
      avatar: "/dashboardpublic/sarah-chen-avatar.jpg",
      name: "Sarah Chen",
      subtitle: "posted in 'Engineering Alumni'",
      time: "1 day ago",
      postTitle: "Hiring: Junior Software Engineer",
      content:
        "My team at Innovate Inc. is looking for a recent grad passionate about front-end development. Feel free to reach out!",
      hasComment: true,
    },
  ]

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div>
      {/* Tabs - Horizontal Scrollable */}
      <div className="relative flex items-center gap-2 mb-6">
        <div className="flex gap-1 overflow-x-auto flex-1 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded transition ${
                activeTab === tab
                  ? "text-white bg-red-500/20 border-b-2 border-red-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition">
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gray-700 flex-shrink-0 overflow-hidden">
                <img
                    src={activity.avatar || "/placeholder.svg"}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {activity.title}
                      {activity.name && <span className="ml-2">{activity.name}</span>}
                    </p>
                    {activity.subtitle && <p className="text-xs text-gray-500">{activity.subtitle}</p>}
                    <p className="text-xs text-gray-600 mt-1">{activity.time}</p>
                  </div>

                  {/* Thumbnail */}
                  {activity.image && (
                    <div className="w-20 h-20 rounded flex-shrink-0 overflow-hidden">
                      <img
                        src={activity.image || "/placeholder.svg"}
                        alt="Activity"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Post Title and Content */}
                <h3 className="font-semibold text-white text-sm mb-2">{activity.postTitle}</h3>
                <p className="text-sm text-gray-400 mb-3">{activity.content}</p>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  {activity.hasView && (
                    <button className="text-sm text-red-400 hover:text-red-300 transition">View →</button>
                  )}
                  {activity.hasComment && (
                    <button className="flex items-center gap-1 text-gray-400 hover:text-white transition text-sm">
                      <MessageCircle size={16} />
                      Comment
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
