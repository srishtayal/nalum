"use client"

import Header from "@/components/dashboard/headerafterlogin"
import FeatureCards from "@/components/dashboard/feature-cards"
import ActivitySection from "@/components/dashboard/activity-section"
import EventsCalendar from "@/components/dashboard/events-calendar"
import { useState } from "react"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold">Welcome, Alex!</h1>
            <span className="bg-red-900/80 text-red-200 px-3 py-1 rounded text-sm font-medium">Student</span>
          </div>
          <p className="text-gray-400">Here's what's happening in your community today.</p>
        </div>

        {/* Feature Cards */}
        <FeatureCards />

        {/* Activity and Calendar */}
        <div className="grid grid-cols-3 gap-8 mt-12">
          {/* Activity Section */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold text-white mb-6">Activity Feed</h2>
            <ActivitySection />
          </div>

          {/* Events Calendar */}
          <div>
            <EventsCalendar />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-center gap-6 mb-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition">
              About
            </a>
            <a href="#" className="hover:text-white transition">
              Contact
            </a>
            <a href="#" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition">
              Help
            </a>
          </div>
          <div className="text-center text-sm text-gray-500">© 2023 Nalum. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
