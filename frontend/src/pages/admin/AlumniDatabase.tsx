import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Database, Search, Loader2, UserCheck, XCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { AxiosError } from "axios";
import { BRANCHES } from "@/constants/branches";
import AdminLayout from "@/components/admin/AdminLayout";

interface VerificationMatch {
  name: string;
  roll_no: string;
  batch: string;
  branch: string;
  similarity?: number;
}

interface AlumniRecord {
  name: string;
  roll_no: string;
  batch: string;
  branch: string;
}

interface ApiErrorResponse {
  message?: string;
}

const AlumniDatabase = () => {
  const { accessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Search state
  const [searchName, setSearchName] = useState("");
  const [searchRollNo, setSearchRollNo] = useState("");
  const [searchBatch, setSearchBatch] = useState("");
  const [searchBranch, setSearchBranch] = useState("");
  const [matches, setMatches] = useState<VerificationMatch[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Database view state
  const [allAlumni, setAllAlumni] = useState<AlumniRecord[]>([]);
  const [isLoadingAlumni, setIsLoadingAlumni] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(50);
  const [batches, setBatches] = useState<string[]>([]);
  const [isLoadingBatches, setIsLoadingBatches] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);

  // Fetch batches on mount
  useEffect(() => {
    fetchBatches();
  }, []);

  // Fetch alumni when batch or page changes
  useEffect(() => {
    if (selectedBatch) {
      fetchAlumniByBatch();
    }
  }, [currentPage, selectedBatch]);

  const fetchBatches = async () => {
    setIsLoadingBatches(true);
    try {
      const response = await api.get("/admin/alumni-database/batches", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.success) {
        setBatches(response.data.batches || []);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.message || "Failed to fetch batches";
      toast.error(message);
    } finally {
      setIsLoadingBatches(false);
    }
  };

  const fetchAlumniByBatch = async () => {
    if (!selectedBatch) return;
    
    setIsLoadingAlumni(true);
    try {
      const offset = (currentPage - 1) * limit;
      const response = await api.get(`/admin/alumni-database/batch/${selectedBatch}`, {
        params: { limit, offset },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.success) {
        setAllAlumni(response.data.data || []);
        setTotalRecords(response.data.total || 0);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.message || "Failed to fetch alumni records";
      toast.error(message);
    } finally {
      setIsLoadingAlumni(false);
    }
  };

  const handleBatchSelect = (batch: string) => {
    setSelectedBatch(batch);
    setCurrentPage(1);
  };

  const handleBackToBatches = () => {
    setSelectedBatch(null);
    setAllAlumni([]);
    setCurrentPage(1);
  };

  const handleDatabaseSearch = async () => {
    if (!searchName.trim() && !searchRollNo.trim() && !searchBatch.trim() && !searchBranch) {
      toast.error("Please enter at least one search criteria");
      return;
    }

    setIsLoading(true);
    setMatches([]);
    setHasSearched(false);

    try {
      const response = await api.post(
        "/admin/alumni-database/search",
        {
          name: searchName,
          roll_no: searchRollNo,
          batch: searchBatch,
          branch: searchBranch,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        const foundMatches = response.data.matches || [];
        setMatches(foundMatches);
        setHasSearched(true);
        
        if (foundMatches.length > 0) {
          toast.success(`Found ${foundMatches.length} match(es) in the database`);
        } else {
          toast.info("No matches found in the database");
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.message || "Database search failed";
      toast.error(message);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchName("");
    setSearchRollNo("");
    setSearchBatch("");
    setSearchBranch("");
    setMatches([]);
    setHasSearched(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Database className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Alumni Database
            </h1>
          </div>
          <p className="text-gray-600">
            Search or browse the college alumni database
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger value="search">Search Alumni</TabsTrigger>
            <TabsTrigger value="database">Database View</TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search" className="mt-6 space-y-6">{/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Search Criteria
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Enter one or more fields to search. You can search by any single field or combine multiple fields.
          </p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="search-name">Full Name</Label>
              <Input
                id="search-name"
                placeholder="Search by name (e.g., John, Smith)"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Partial matches will be shown</p>
            </div>

            <div>
              <Label htmlFor="search-roll">Roll Number</Label>
              <Input
                id="search-roll"
                placeholder="Search by roll number (e.g., 2020, 123)"
                value={searchRollNo}
                onChange={(e) => setSearchRollNo(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Partial matches will be shown</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="search-batch">Batch/Year</Label>
                <Input
                  id="search-batch"
                  placeholder="Search by year (e.g., 2020)"
                  value={searchBatch}
                  onChange={(e) => setSearchBatch(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Exact year match</p>
              </div>

              <div>
                <Label htmlFor="search-branch">Branch</Label>
                <Select value={searchBranch} onValueChange={setSearchBranch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">Partial matches will be shown</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Search Tip:</strong> You can search using any single field or combine multiple fields. 
                For example: search just by name "John", or by year "2020", or combine name "John" + branch "CSE".
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleDatabaseSearch}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching Database...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Database
                  </>
                )}
              </Button>
              <Button
                onClick={handleClearSearch}
                variant="outline"
                disabled={isLoading}
                className="flex-1"
              >
                Clear Search
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        {hasSearched && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Search Results
            </h2>

            {matches.length === 0 ? (
              <div className="text-center py-12">
                <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  No records found matching your search criteria
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Try adjusting your search terms or using different criteria
                </p>
              </div>
            ) : (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-green-800 font-medium">
                    <UserCheck className="inline h-4 w-4 mr-2" />
                    Found {matches.length} record(s) in the alumni database
                  </p>
                </div>

                <div className="space-y-4">
                  {matches.map((match, index) => (
                    <div
                      key={index}
                      className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {match.name}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500 font-medium">
                                Roll No:
                              </span>
                              <span className="ml-2 text-gray-900">
                                {match.roll_no}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 font-medium">
                                Branch:
                              </span>
                              <span className="ml-2 text-gray-900">
                                {match.branch}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 font-medium">
                                Batch:
                              </span>
                              <span className="ml-2 text-gray-900">
                                {match.batch}
                              </span>
                            </div>
                          </div>
                        </div>
                        {match.similarity !== undefined && match.similarity > 0 && (
                          <span className="ml-4 text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                            {(match.similarity * 100).toFixed(0)}% match
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-3">ℹ️ About this Tool</h4>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              • This tool searches the official alumni database maintained by the college
            </p>
            <p>
              • You can search using any single field or combine multiple fields for more specific results
            </p>
            <p>
              • Name, roll number, and branch searches support partial matches (e.g., searching "John" will find "John Doe", "Johnny", etc.)
            </p>
            <p>
              • Batch/year requires exact match (e.g., "2020")
            </p>
            <p>
              • Use this to verify alumni details when reviewing manual verification requests
            </p>
            <p>
              • The database may not include the most recent graduates - allow time for records to be updated
            </p>
          </div>
        </div>
          </TabsContent>

          {/* Database View Tab */}
          <TabsContent value="database" className="mt-6 space-y-6">
            {!selectedBatch ? (
              /* Batch Selection View */
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Select Batch/Year
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Choose a batch to view alumni records from that year
                </p>

                {isLoadingBatches ? (
                  <div className="flex justify-center items-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : batches.length === 0 ? (
                  <div className="text-center py-12">
                    <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No batches found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {batches.map((batch) => (
                      <button
                        key={batch}
                        onClick={() => handleBatchSelect(batch)}
                        className="p-6 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-400 rounded-lg transition-all duration-200 flex flex-col items-center justify-center group"
                      >
                        <span className="text-3xl font-bold text-blue-600 group-hover:text-blue-700">
                          {batch}
                        </span>
                        <span className="text-xs text-gray-600 mt-2">Click to view</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Alumni Table View */
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Alumni Records - Batch {selectedBatch}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Showing {allAlumni.length} of {totalRecords} records
                      </p>
                    </div>
                    <Button
                      onClick={handleBackToBatches}
                      variant="outline"
                      size="sm"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Back to Batches
                    </Button>
                  </div>
                </div>

              {isLoadingAlumni ? (
                <div className="flex justify-center items-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : allAlumni.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No records found</p>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Name</TableHead>
                        <TableHead className="w-[20%]">Roll Number</TableHead>
                        <TableHead className="w-[20%]">Branch</TableHead>
                        <TableHead className="w-[20%]">Batch</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allAlumni.map((alumni, index) => (
                        <TableRow key={`${alumni.roll_no}-${index}`}>
                          <TableCell className="font-medium">{alumni.name}</TableCell>
                          <TableCell>{alumni.roll_no}</TableCell>
                          <TableCell>{alumni.branch}</TableCell>
                          <TableCell>{alumni.batch}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {Math.ceil(totalRecords / limit)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1 || isLoadingAlumni}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                        First
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1 || isLoadingAlumni}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={currentPage >= Math.ceil(totalRecords / limit) || isLoadingAlumni}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.ceil(totalRecords / limit))}
                        disabled={currentPage >= Math.ceil(totalRecords / limit) || isLoadingAlumni}
                      >
                        Last
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AlumniDatabase;
