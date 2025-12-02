import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  generateVerificationCodes,
  getAllVerificationCodes,
  getCodeStatistics,
  deleteExpiredCodes,
  VerificationCodeType,
  CodeStats,
} from "@/lib/adminApi";
import { Copy, Trash2, Plus, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

const CodeManagement = () => {
  const [codes, setCodes] = useState<VerificationCodeType[]>([]);
  const [stats, setStats] = useState<CodeStats>({ total: 0, active: 0, used: 0, expired: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateCount, setGenerateCount] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "used" | "expired">("active");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0);

  const fetchCodes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAllVerificationCodes({
        page,
        limit: 20,
        status: statusFilter,
      });
      setCodes(response.data);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to fetch codes");
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter]);

  const fetchStats = async () => {
    try {
      const response = await getCodeStatistics();
      setStats(response.stats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  useEffect(() => {
    fetchCodes();
    fetchStats();
  }, [fetchCodes]);

  // Rate limit countdown
  useEffect(() => {
    if (rateLimitCountdown > 0) {
      const timer = setTimeout(() => setRateLimitCountdown(rateLimitCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [rateLimitCountdown]);

  const handleGenerateCodes = async () => {
    if (generateCount < 1 || generateCount > 5) {
      toast.error("You can only generate 1-5 codes at a time");
      return;
    }

    try {
      setIsGenerating(true);
      const response = await generateVerificationCodes(generateCount);
      toast.success(response.message);
      
      // Start 60 second countdown
      setRateLimitCountdown(60);
      
      // Refresh data
      fetchCodes();
      fetchStats();
      setGenerateCount(1);
    } catch (error) {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      if (err.response?.status === 429) {
        toast.error("Rate limit exceeded! Please wait before generating more codes.");
        setRateLimitCountdown(60);
      } else {
        toast.error(err.response?.data?.message || "Failed to generate codes");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const handleCleanupExpired = async () => {
    if (!confirm("Are you sure you want to delete all expired codes?")) return;

    try {
      const response = await deleteExpiredCodes();
      toast.success(response.message);
      fetchCodes();
      fetchStats();
    } catch (error) {
      toast.error((error as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to delete expired codes");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const getStatusBadge = (code: VerificationCodeType) => {
    if (code.is_used) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle size={12} /> Used
        </span>
      );
    }
    if (isExpired(code.expires_at)) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 flex items-center gap-1">
          <XCircle size={12} /> Expired
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center gap-1">
        <Clock size={12} /> Active
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Verification Codes</h1>
            <p className="text-sm text-gray-600 mt-1">
              Generate 10-digit codes for alumni verification (7-day expiry)
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="text-sm text-gray-600">Total Codes</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-blue-200">
            <div className="text-sm text-blue-600">Active</div>
            <div className="text-2xl font-bold text-blue-900">{stats.active}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-green-200">
            <div className="text-sm text-green-600">Used</div>
            <div className="text-2xl font-bold text-green-900">{stats.used}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-red-200">
            <div className="text-sm text-red-600">Expired</div>
            <div className="text-2xl font-bold text-red-900">{stats.expired}</div>
          </div>
        </div>

        {/* Generate Codes Section */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Generate New Codes</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1 max-w-xs">
              <label htmlFor="generate-count" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Codes (1-5)
              </label>
              <input
                id="generate-count"
                type="number"
                min="1"
                max="5"
                value={generateCount}
                onChange={(e) => setGenerateCount(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isGenerating || rateLimitCountdown > 0}
                placeholder="Enter count"
              />
            </div>
            <button
              onClick={handleGenerateCodes}
              disabled={isGenerating || rateLimitCountdown > 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Generating...
                </>
              ) : rateLimitCountdown > 0 ? (
                <>
                  <Clock size={16} />
                  Wait {rateLimitCountdown}s
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Generate
                </>
              )}
            </button>
          </div>
          {rateLimitCountdown > 0 && (
            <p className="mt-2 text-sm text-amber-600">
              ⚠️ Rate limit: Maximum 5 codes per minute. Please wait {rateLimitCountdown} seconds.
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {(["all", "active", "used", "expired"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setStatusFilter(filter);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg capitalize ${
                  statusFilter === filter
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <button
            onClick={handleCleanupExpired}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <Trash2 size={16} />
            Cleanup Expired
          </button>
        </div>

        {/* Codes Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading codes...</div>
          ) : codes.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No codes found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Generated By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Used By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Expires At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {codes.map((code) => (
                    <tr key={code._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-mono font-semibold text-lg">{code.code}</span>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(code)}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{code.generated_by?.name}</div>
                          <div className="text-gray-500">{code.generated_by?.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {code.used_by ? (
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{code.used_by.name}</div>
                            <div className="text-gray-500">{code.used_by.email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(code.expires_at)}
                      </td>
                      <td className="px-6 py-4">
                        {!code.is_used && !isExpired(code.expires_at) && (
                          <button
                            onClick={() => handleCopyCode(code.code)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <Copy size={16} />
                            Copy
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CodeManagement;
