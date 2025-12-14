import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getPendingEvents, approveEvent, rejectEvent, Event } from "../../lib/adminApi";
import { CheckCircle, XCircle, Calendar as CalendarIcon, Toggle, Plus } from "lucide-react";
import api from "../../lib/api";

const EventApprovals = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [hostingEnabled, setHostingEnabled] = useState(true);
  const [togglingHosting, setTogglingHosting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    event_time: "",
    location: "",
    event_type: "other",
    registration_link: "",
    max_participants: "",
    contact_email: "",
    contact_phone: "",
    contact_website: "",
    creator_name: "",
    creator_email: "",
  });

  useEffect(() => {
    fetchEvents();
    fetchHostingStatus();
  }, []);

  const fetchHostingStatus = async () => {
    try {
      const response = await api.get("/admin/events/settings/hosting-status");
      if (response.data.success) {
        setHostingEnabled(response.data.data.enabled);
      }
    } catch (err) {
      console.error("Failed to fetch hosting status:", err);
    }
  };

  const toggleHosting = async () => {
    setTogglingHosting(true);
    try {
      const newStatus = !hostingEnabled;
      await api.post("/admin/events/settings/toggle-hosting", {
        enabled: newStatus
      });
      setHostingEnabled(newStatus);
      alert(`Event hosting ${newStatus ? "enabled" : "disabled"}`);
    } catch (err) {
      console.error("Failed to toggle hosting:", err);
      alert("Failed to toggle event hosting");
    } finally {
      setTogglingHosting(false);
    }
  };

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

  const handleCreateEvent = async () => {
    if (!createFormData.title || !createFormData.description || !createFormData.event_date || 
        !createFormData.event_time || !createFormData.location || !createFormData.creator_name || 
        !createFormData.creator_email) {
      alert("Please fill all required fields");
      return;
    }

    setCreatingEvent(true);
    try {
      await api.post("/admin/events/create", {
        ...createFormData,
        max_participants: createFormData.max_participants ? parseInt(createFormData.max_participants) : null,
        contact_info: {
          email: createFormData.contact_email,
          phone: createFormData.contact_phone,
          website: createFormData.contact_website,
        }
      });
      
      alert("Event created successfully!");
      setShowCreateModal(false);
      setCreateFormData({
        title: "",
        description: "",
        event_date: "",
        event_time: "",
        location: "",
        event_type: "other",
        registration_link: "",
        max_participants: "",
        contact_email: "",
        contact_phone: "",
        contact_website: "",
        creator_name: "",
        creator_email: "",
      });
    } catch (err) {
      console.error("Failed to create event:", err);
      alert(err.response?.data?.message || "Failed to create event");
    } finally {
      setCreatingEvent(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Approvals</h1>
            <p className="text-gray-600 mt-2">{events.length} pending event{events.length !== 1 && "s"}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Create Event
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
            <span className="text-sm font-medium text-gray-700">
              Allow Alumni to Host Events
            </span>
            <button
              onClick={toggleHosting}
              disabled={togglingHosting}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                hostingEnabled ? "bg-green-600" : "bg-gray-300"
              } ${togglingHosting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  hostingEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-xs font-medium ${hostingEnabled ? "text-green-600" : "text-gray-500"}`}>
              {hostingEnabled ? "ON" : "OFF"}
            </span>
          </div>
        </div>
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

        {/* Create Event Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full m-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-semibold mb-6">Create New Event</h3>
              
              <div className="space-y-4">
                {/* Event Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                    <input
                      type="text"
                      value={createFormData.title}
                      onChange={(e) => setCreateFormData({...createFormData, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      placeholder="Enter event title"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      value={createFormData.description}
                      onChange={(e) => setCreateFormData({...createFormData, description: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2 min-h-[100px]"
                      placeholder="Event description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
                    <input
                      type="date"
                      value={createFormData.event_date}
                      onChange={(e) => setCreateFormData({...createFormData, event_date: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Time *</label>
                    <input
                      type="time"
                      value={createFormData.event_time}
                      onChange={(e) => setCreateFormData({...createFormData, event_time: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <input
                      type="text"
                      value={createFormData.location}
                      onChange={(e) => setCreateFormData({...createFormData, location: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      placeholder="Event location or online link"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                    <select
                      value={createFormData.event_type}
                      onChange={(e) => setCreateFormData({...createFormData, event_type: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2"
                    >
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="networking">Networking</option>
                      <option value="social">Social</option>
                      <option value="career">Career</option>
                      <option value="sports">Sports</option>
                      <option value="cultural">Cultural</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                    <input
                      type="number"
                      value={createFormData.max_participants}
                      onChange={(e) => setCreateFormData({...createFormData, max_participants: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      placeholder="Leave empty for unlimited"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration Link</label>
                    <input
                      type="text"
                      value={createFormData.registration_link}
                      onChange={(e) => setCreateFormData({...createFormData, registration_link: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Host Information */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-lg font-semibold mb-3">Host Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Host Name *</label>
                      <input
                        type="text"
                        value={createFormData.creator_name}
                        onChange={(e) => setCreateFormData({...createFormData, creator_name: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-2"
                        placeholder="Alumni name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Host Email *</label>
                      <input
                        type="email"
                        value={createFormData.creator_email}
                        onChange={(e) => setCreateFormData({...createFormData, creator_email: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-2"
                        placeholder="alumni@email.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-lg font-semibold mb-3">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                      <input
                        type="email"
                        value={createFormData.contact_email}
                        onChange={(e) => setCreateFormData({...createFormData, contact_email: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-2"
                        placeholder="contact@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        value={createFormData.contact_phone}
                        onChange={(e) => setCreateFormData({...createFormData, contact_phone: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-2"
                        placeholder="+91 1234567890"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <input
                        type="text"
                        value={createFormData.contact_website}
                        onChange={(e) => setCreateFormData({...createFormData, contact_website: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg p-2"
                        placeholder="https://website.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowCreateModal(false)}
                  disabled={creatingEvent}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEvent}
                  disabled={creatingEvent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {creatingEvent ? "Creating..." : "Create Event"}
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
