import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  MapPin,
  GraduationCap,
  BadgeIcon,
  ArrowLeft,
  UserCheck,
  UserX,
  XCircle,
} from "lucide-react";
import api from "@/lib/api";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface ConnectionRequest {
  _id: string;
  requester: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  recipient: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  status: string;
  requestMessage?: string;
  createdAt: string;
}

interface UserProfile {
  batch?: string;
  branch?: string;
  campus?: string;
  profile_picture?: string;
}

const ConnectionRequests = () => {
  const navigate = useNavigate();
  const [receivedRequests, setReceivedRequests] = useState<ConnectionRequest[]>(
    []
  );
  const [sentRequests, setSentRequests] = useState<ConnectionRequest[]>([]);
  const [receivedProfiles, setReceivedProfiles] = useState<
    Record<string, UserProfile>
  >({});
  const [sentProfiles, setSentProfiles] = useState<Record<string, UserProfile>>(
    {}
  );
  const [isLoadingReceived, setIsLoadingReceived] = useState(false);
  const [isLoadingSent, setIsLoadingSent] = useState(false);
  const [activeTab, setActiveTab] = useState("received");

  const fetchReceivedRequests = useCallback(async () => {
    setIsLoadingReceived(true);
    try {
      const { data } = await api.get("/chat/connections/pending");
      const requests = data?.data || [];
      setReceivedRequests(requests);

      // Fetch profiles for each requester
      const profiles: Record<string, UserProfile> = {};
      for (const request of requests) {
        try {
          const profileRes = await api.get(`/profile/${request.requester._id}`);
          profiles[request.requester._id] = profileRes.data?.profile || {};
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        }
      }
      setReceivedProfiles(profiles);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "Failed to load received requests"
      );
    } finally {
      setIsLoadingReceived(false);
    }
  }, []);

  const fetchSentRequests = useCallback(async () => {
    setIsLoadingSent(true);
    try {
      const { data } = await api.get("/chat/connections/sent");
      const requests = data?.data || [];
      setSentRequests(requests);

      // Extract profile data from recipientProfile field
      const profiles: Record<string, UserProfile> = {};
      for (const request of requests) {
        if (request.recipientProfile) {
          profiles[request.recipient._id] = {
            batch: request.recipientProfile.batch,
            branch: request.recipientProfile.branch,
            campus: request.recipientProfile.campus,
            profile_picture: request.recipientProfile.profile_picture,
          };
        }
      }
      setSentProfiles(profiles);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "Failed to load sent requests"
      );
    } finally {
      setIsLoadingSent(false);
    }
  }, []);

  useEffect(() => {
    fetchReceivedRequests();
    fetchSentRequests();
  }, [fetchReceivedRequests, fetchSentRequests]);

  const handleAccept = async (connectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.post("/chat/connections/respond", {
        connectionId,
        action: "accept",
      });
      toast.success("Connection request accepted!");
      fetchReceivedRequests();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to accept request");
    }
  };

  const handleReject = async (connectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.post("/chat/connections/respond", {
        connectionId,
        action: "reject",
      });
      toast.success("Connection request rejected");
      fetchReceivedRequests();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to reject request");
    }
  };

  const handleCancel = async (recipientId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/chat/connections/cancel/${recipientId}`);
      toast.success("Connection request cancelled");
      fetchSentRequests();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to cancel request");
    }
  };

  const renderReceivedRequests = () => {
    if (isLoadingReceived) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-400">Loading requests...</span>
        </div>
      );
    }

    if (receivedRequests.length === 0) {
      return (
        <div className="text-center py-12">
          <UserCheck className="h-16 w-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">No connection requests</p>
          <p className="text-gray-500 text-sm mt-2">
            When alumni send you connection requests, they'll appear here
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {receivedRequests.map((request) => {
          const profile = receivedProfiles[request.requester._id] || {};
          return (
            <Card
              key={request._id}
              className="p-4 bg-white/5 border-white/10 hover:border-blue-500/30 cursor-pointer transition-all hover:-translate-y-1"
              onClick={() =>
                navigate(`/dashboard/profile/${request.requester._id}`)
              }
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <UserAvatar
                  name={request.requester.name}
                  src={profile.profile_picture}
                  size="lg"
                />
                <div className="space-y-1 w-full">
                  <h3 className="font-semibold text-white truncate">
                    {request.requester.name}
                  </h3>
                  {profile.batch && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                      <GraduationCap className="h-4 w-4" />
                      <span>{profile.batch}</span>
                    </div>
                  )}
                  {profile.branch && (
                    <Badge variant="secondary" className="text-xs">
                      <BadgeIcon className="h-3 w-3 mr-1" />
                      {profile.branch}
                    </Badge>
                  )}
                  {profile.campus && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.campus}</span>
                    </div>
                  )}
                </div>
                {request.requestMessage && (
                  <p className="text-sm text-gray-400 italic line-clamp-2">
                    "{request.requestMessage}"
                  </p>
                )}
                <div className="flex gap-2 w-full pt-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={(e) => handleAccept(request._id, e)}
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={(e) => handleReject(request._id, e)}
                  >
                    <UserX className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderSentRequests = () => {
    if (isLoadingSent) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-400">Loading requests...</span>
        </div>
      );
    }

    if (sentRequests.length === 0) {
      return (
        <div className="text-center py-12">
          <UserCheck className="h-16 w-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">No pending requests</p>
          <p className="text-gray-500 text-sm mt-2">
            Connection requests you send will appear here
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sentRequests.map((request) => {
          const profile = sentProfiles[request.recipient._id] || {};
          return (
            <Card
              key={request._id}
              className="p-4 bg-white/5 border-white/10 hover:border-blue-500/30 cursor-pointer transition-all hover:-translate-y-1"
              onClick={() =>
                navigate(`/dashboard/profile/${request.recipient._id}`)
              }
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <UserAvatar
                  name={request.recipient.name}
                  src={profile.profile_picture}
                  size="lg"
                />
                <div className="space-y-1 w-full">
                  <h3 className="font-semibold text-white truncate">
                    {request.recipient.name}
                  </h3>
                  {profile.batch && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                      <GraduationCap className="h-4 w-4" />
                      <span>{profile.batch}</span>
                    </div>
                  )}
                  {profile.branch && (
                    <Badge variant="secondary" className="text-xs">
                      <BadgeIcon className="h-3 w-3 mr-1" />
                      {profile.branch}
                    </Badge>
                  )}
                  {profile.campus && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.campus}</span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Sent {new Date(request.createdAt).toLocaleDateString()}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={(e) => handleCancel(request.recipient._id, e)}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Cancel Request
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="mb-4 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-white mb-2">
          Connection Requests
        </h1>
        <p className="text-gray-400">Manage your pending connection requests</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="received" className="relative">
            Received
            {receivedRequests.length > 0 && (
              <Badge
                variant="destructive"
                className="ml-2 px-1.5 py-0.5 text-xs min-w-[20px] h-5"
              >
                {receivedRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent" className="relative">
            Sent
            {sentRequests.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 px-1.5 py-0.5 text-xs min-w-[20px] h-5"
              >
                {sentRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="mt-6">
          {renderReceivedRequests()}
        </TabsContent>

        <TabsContent value="sent" className="mt-6">
          {renderSentRequests()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConnectionRequests;
