import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Eye, Trash2, RefreshCw, FileSpreadsheet, Database, Calendar, Save, HardDrive } from "lucide-react";
import { DataViewModal } from "@/components/data-view-modal";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { ExcelDataEntry } from "@shared/schema";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [selectedEntry, setSelectedEntry] = useState<ExcelDataEntry | null>(null);
  const [showDataModal, setShowDataModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch Excel data
  const { data: excelData = [], isLoading: isLoadingData } = useQuery<ExcelDataEntry[]>({
    queryKey: ["/api/excel-data"],
    enabled: isAuthenticated,
  });

  // Fetch stats
  const { data: stats } = useQuery<{
    totalFiles: number;
    totalRecords: number;
    thisMonth: number;
  }>({
    queryKey: ["/api/excel-data/stats"],
    enabled: isAuthenticated,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/excel-data/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/excel-data"] });
      queryClient.invalidateQueries({ queryKey: ["/api/excel-data/stats"] });
      toast({
        title: "Success",
        description: "Data entry deleted successfully.",
      });
      setShowDeleteModal(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete data entry.",
        variant: "destructive",
      });
    },
  });

  const handleDownload = async (id: string) => {
    try {
      const response = await fetch(`/api/excel-data/${id}/download`, {
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `excel_data_${id}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download file.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadAll = () => {
    // For simplicity, we'll download each file individually
    // In a real application, you might want to create a zip file
    excelData.forEach((entry, index: number) => {
      setTimeout(() => handleDownload(entry.id), index * 500);
    });
  };

  const handleCreateBackup = async () => {
    try {
      await apiRequest('POST', '/api/backup/create');
      toast({
        title: "Success",
        description: "Database backup created successfully.",
      });
    } catch (error: any) {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create backup.",
        variant: "destructive",
      });
    }
  };

  const handleViewData = (entry: ExcelDataEntry) => {
    setSelectedEntry(entry);
    setShowDataModal(true);
  };

  const handleDeleteEntry = (entry: ExcelDataEntry) => {
    setSelectedEntry(entry);
    setShowDeleteModal(true);
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const getMonthYearDisplay = (month: string, year: number) => {
    const monthName = month.charAt(0).toUpperCase() + month.slice(1);
    return `${monthName} ${year}`;
  };

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-slate-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-slate-900">CHEAP & BEST Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-600">
                Welcome, {(user as any)?.firstName || (user as any)?.email || 'Administrator'}
              </span>
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/api/logout'}
                className="text-slate-500 hover:text-slate-700"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h2>
          <p className="text-primary-100">Manage your Excel data efficiently and securely</p>
          <div className="mt-4 flex items-center space-x-2 text-primary-100">
            <HardDrive className="w-5 h-5" />
            <span className="text-sm">Database: Permanent Neon PostgreSQL Storage</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Total Files</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {stats?.totalFiles || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Database className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Data Records</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {stats?.totalRecords || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">This Month</p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {stats?.thisMonth || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Management */}
        <Card className="shadow-lg">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h3 className="text-lg font-semibold text-slate-900">Data Management</h3>
              <div className="flex flex-wrap space-x-2 mt-4 sm:mt-0">
                <Button
                  onClick={handleDownloadAll}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
                <Button
                  onClick={handleCreateBackup}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Create Backup
                </Button>
                <Button
                  onClick={() => {
                    queryClient.invalidateQueries({ queryKey: ["/api/excel-data"] });
                    queryClient.invalidateQueries({ queryKey: ["/api/excel-data/stats"] });
                  }}
                  className="bg-primary-600 hover:bg-primary-700 text-white"
                  size="sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Month/Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">File Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Records</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {excelData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      No data entries found. Users can submit Excel data from the main page.
                    </td>
                  </tr>
                ) : (
                  excelData.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {formatDate(entry.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {getMonthYearDisplay(entry.month, entry.year)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {entry.fileName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {entry.recordCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            entry.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewData(entry)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(entry.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEntry(entry)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* Modals */}
      {showDataModal && selectedEntry && (
        <DataViewModal
          entry={selectedEntry}
          onClose={() => {
            setShowDataModal(false);
            setSelectedEntry(null);
          }}
          onDownload={() => handleDownload(selectedEntry.id)}
        />
      )}

      {showDeleteModal && selectedEntry && (
        <DeleteConfirmModal
          entry={selectedEntry}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedEntry(null);
          }}
          onConfirm={() => deleteMutation.mutate(selectedEntry.id)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
