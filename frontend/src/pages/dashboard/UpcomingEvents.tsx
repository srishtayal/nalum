import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Calendar, MapPin, Clock, Heart } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

interface Event {
  _id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  event_type: string;
  likes: number;
  image_url?: string;
}

const UpcomingEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get("/events/most-liked?limit=5");
        setEvents(data?.data || []);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to load events"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md flex items-center gap-3 text-gray-200">
        <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
        <span>Loading events...</span>
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md text-gray-300">
        No upcoming events available.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md w-full max-w-xs ml-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Top Events</h3>
        <button
          onClick={() => navigate("/dashboard/events")}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          View All →
        </button>
      </div>

      <div className="flex flex-col space-y-3 max-h-96 overflow-y-auto pr-2">
        {events.map((event, index) => (
          <div
            key={event._id}
            onClick={() => navigate("/dashboard/events")}
            className="group relative cursor-pointer rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-4 shadow-md transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5"
          >
            {/* Event Type Badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-1 text-xs font-semibold rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {event.event_type}
              </span>
            </div>

            {/* Title */}
            <h4 className="text-base font-bold text-white mb-3 line-clamp-2 leading-snug group-hover:text-blue-300 transition-colors">
              {event.title}
            </h4>

            {/* Event Details */}
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Calendar className="h-3.5 w-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-gray-300 leading-tight">{formatDate(event.event_date)}</span>
              </div>
              
              {event.event_time && (
                <div className="flex items-start gap-2">
                  <Clock className="h-3.5 w-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-gray-300 leading-tight">{formatTime(event.event_time)}</span>
                </div>
              )}
              
              {event.location && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-gray-300 leading-tight line-clamp-1">{event.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
