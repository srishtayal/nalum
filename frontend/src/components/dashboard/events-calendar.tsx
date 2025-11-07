"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function EventsCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2023, 10, 1)) // November 2023

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const month = currentDate.toLocaleString("default", { month: "long", year: "numeric" })
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  const calendarDays = []
  // Empty cells for days before month starts
  for (let i = 0; i < firstDayOfMonth(currentDate); i++) {
    calendarDays.push(null)
  }
  // Days of month
  for (let i = 1; i <= daysInMonth(currentDate); i++) {
    calendarDays.push(i)
  }

  const eventDates = [9, 18] // Example event dates
  const selectedDate = 18 // Highlighted date

  return (
    <div className="bg-zinc-800 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-white text-lg">Upcoming Events</h3>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button className="p-1 hover:bg-gray-700 rounded transition">
          <ChevronLeft size={20} className="text-gray-400" />
        </button>
        <span className="text-sm font-medium text-white">{month}</span>
        <button className="p-1 hover:bg-gray-700 rounded transition">
          <ChevronRight size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Calendar */}
      <div className="space-y-2">
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {days.map((day) => (
            <div key={day} className="text-center text-xs text-gray-500 font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, idx) => (
            <div
              key={idx}
              className={`aspect-square flex items-center justify-center text-xs rounded transition ${
                day === null
                  ? ""
                  : day === selectedDate
                    ? "bg-red-500 text-white font-semibold"
                    : eventDates.includes(day)
                      ? "bg-red-600/30 text-red-300"
                      : "text-gray-400 hover:bg-gray-700"
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* View Full Calendar Link */}
      <button className="mt-6 w-full text-center text-sm text-red-400 hover:text-red-300 transition font-medium py-2">
        View Full Calendar
      </button>
    </div>
  )
}
