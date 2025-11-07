"use client"

import { Bell } from "lucide-react"

export default function Header() {
  return (
    <header className="border-b border-gray-800 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Logo and Actions */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center font-bold text-white text-lg">
              ✱
            </div>
            <span className="text-xl font-bold text-white">Nalum</span>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <button
              className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white relative"
              title="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold hover:opacity-90 transition"
              title="Profile"
            >
              A
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
