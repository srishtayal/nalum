import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getPendingEvents, approveEvent, rejectEvent, Event } from "../../lib/adminApi";
import { CheckCircle, XCircle, Calendar as CalendarIcon } from "lucide-react";

const EventApprovals = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await getPendingEvents(1, 50);
      if (response.success) {
        setEvents(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (eventId: string) => {
    try {
      await approveEvent(eventId);
      setEvents(events.filter((e) => e._id !== eventId));
      alert("Event approved!");
    } catch (err) {
      const error = err as Error;
      alert(err.response?.data?.message || "Failed to approve");
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedEvent || !rejectReason.trim()) {
      alert("Please provide a reason");
      return;
    }

    try {
      await rejectEvent(selectedEvent._id, rejectReason);
      setEvents(events.filter((e) => e._id !== selectedEvent._id));
      setShowRejectModal(false);
      setRejectReason("");
      alert("Event rejected");
    } catch (err) {
      const error = err as Error;
      alert(err.response?.data?.message || "Failed to reject");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Approvals</h1>
          <p className="text-gray-600 mt-2">{events.length} pending event{events.length !== 1 && "s"}</p>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <CalendarIcon className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending events</h3>
            <p className="text-gray-600">All events have been processed.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {events.map((event) => (
              <div key={event._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Date & Time</p>
                        <p className="font-medium">
                          {new Date(event.event_date).toLocaleDateString()} at {event.event_time}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="font-medium">{event.location}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Event Type</p>
                        <p className="font-medium capitalize">{event.event_type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Created By</p>
                        <p className="font-medium">{event.creator_name}</p>
                        <p className="text-xs text-gray-500">{event.creator_email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleApprove(event._id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <CheckCircle size={18} />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowRejectModal(true);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <XCircle size={18} />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Reject Event</h3>
              <p className="text-sm text-gray-600 mb-4">
                Provide a reason for rejecting "{selectedEvent.title}":
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px]"
                placeholder="Enter reason..."
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectSubmit}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default EventApprovals;
