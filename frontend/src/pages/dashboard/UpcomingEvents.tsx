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
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md w-full max-w-xs ml-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">Upcoming Events</h3>
      </div>

      <div className="flex flex-col space-y-1 max-h-96 overflow-y-auto pr-2">
        {events.map((event) => (
          <div
            key={event._id}
            onClick={() => navigate("/dashboard/events")}
            className="w-full cursor-pointer rounded-xl border border-white/10 bg-white/5 p-2.5 shadow-md transition hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-blue-500/10"
          >
            <div className="mb-2">
              <p className="text-white font-semibold leading-tight line-clamp-2 mb-1">
                {event.title}
              </p>
              <div className="flex items-center gap-1 text-xs text-blue-400">
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30">
                  {event.event_type}
                </span>
              </div>
            </div>

            <div className="space-y-1 text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-emerald-400" />
                <span className="line-clamp-1">{formatDate(event.event_date)}</span>
              </div>
              {event.event_time && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-purple-400" />
                  <span className="line-clamp-1">{formatTime(event.event_time)}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-orange-400" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
              <Heart className="h-3 w-3 text-red-400 fill-red-400" />
              <span>{event.likes || 0} {event.likes === 1 ? 'like' : 'likes'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
