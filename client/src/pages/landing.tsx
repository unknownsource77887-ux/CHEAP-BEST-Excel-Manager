import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Send, Trash2, Shield } from "lucide-react";
import { ExcelPreview } from "@/components/excel-preview";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const months = [
  { value: "january", label: "January" },
  { value: "february", label: "February" },
  { value: "march", label: "March" },
  { value: "april", label: "April" },
  { value: "may", label: "May" },
  { value: "june", label: "June" },
  { value: "july", label: "July" },
  { value: "august", label: "August" },
  { value: "september", label: "September" },
  { value: "october", label: "October" },
  { value: "november", label: "November" },
  { value: "december", label: "December" },
];

export default function Landing() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [pastedData, setPastedData] = useState("");
  const [parsedData, setParsedData] = useState<string[][]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const parseExcelData = (data: string) => {
    if (!data.trim()) {
      setParsedData([]);
      return;
    }

    const rows = data.split('\n').filter(row => row.trim());
    const parsed = rows.map(row => row.split('\t'));
    setParsedData(parsed);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 10MB. Please choose a smaller file.",
        variant: "destructive",
      });
      event.target.value = "";
      return;
    }

    // Check file type
    const allowedTypes = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload only Excel (.xlsx, .xls) or CSV files.",
        variant: "destructive",
      });
      event.target.value = "";
      return;
    }

    if (!selectedMonth || !selectedYear) {
      toast({
        title: "Missing Information",
        description: "Please select month and year before uploading.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('month', selectedMonth);
      formData.append('year', selectedYear);

      console.log(`Uploading file: ${file.name}, size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      console.log('Form data contents:', {
        file: file.name,
        month: selectedMonth,
        year: selectedYear
      });

      // Use fetch directly for file uploads with proper headers
      const response = await fetch('/api/excel-data/upload', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      
      toast({
        title: "Success",
        description: `File "${file.name}" uploaded successfully and sent to admin.`,
      });

      // Reset form
      setSelectedMonth("");
      setSelectedYear("");
      event.target.value = "";
    } catch (error: any) {
      console.error("Upload error:", error);
      let errorMessage = "Failed to upload file. Please try again.";
      
      if (error.message) {
        // Extract the actual error message from the API response
        if (error.message.includes("File too large")) {
          errorMessage = "File is too large. Maximum size is 10MB.";
        } else if (error.message.includes("Invalid file type")) {
          errorMessage = "Invalid file type. Only Excel and CSV files are allowed.";
        } else if (error.message.includes("No file uploaded")) {
          errorMessage = "Please select a valid file to upload.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const sendToAdmin = async () => {
    if (!selectedMonth || !selectedYear || !pastedData.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before sending.",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest('POST', '/api/excel-data', {
        month: selectedMonth,
        year: parseInt(selectedYear),
        fileName: "pasted_data.xlsx",
        data: parsedData,
        recordCount: parsedData.length - 1, // Excluding header
      });

      toast({
        title: "Success",
        description: "Data sent to admin successfully.",
      });

      // Reset form
      clearData();
    } catch (error) {
      toast({
        title: "Send Failed",
        description: "Failed to send data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearData = () => {
    setSelectedMonth("");
    setSelectedYear("");
    setPastedData("");
    setParsedData([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-black text-slate-800 mb-4 tracking-tight">
            CHEAP & BEST
          </h1>
          <p className="text-xl text-slate-600 font-medium">Excel Data Management System</p>
          <p className="text-lg text-slate-500 mt-2">Secure • Efficient • Professional</p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Data Input Section */}
          <Card className="shadow-xl mb-8">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Data Management Portal</h2>
              
              {/* Month and Year Selection */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <Label className="text-sm font-semibold text-slate-700 mb-2">Select Month</Label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-semibold text-slate-700 mb-2">Enter Year</Label>
                  <Input
                    type="number"
                    placeholder="2024"
                    min="2020"
                    max="2030"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  />
                </div>
              </div>

              {/* Excel Data Input */}
              <div className="mb-8">
                <Label className="text-sm font-semibold text-slate-700 mb-2 flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Paste Excel Data
                </Label>
                <p className="text-sm text-slate-500 mb-3">Copy your Excel data and paste it below. The table will automatically recreate the Excel sheet appearance.</p>
                <Textarea
                  placeholder="Paste your Excel data here (Ctrl+V)..."
                  rows={8}
                  value={pastedData}
                  onChange={(e) => {
                    setPastedData(e.target.value);
                    parseExcelData(e.target.value);
                  }}
                  className="resize-none"
                />
              </div>

              {/* Excel Preview */}
              {parsedData.length > 0 && (
                <ExcelPreview data={parsedData} />
              )}

              {/* File Upload */}
              <div className="mb-8">
                <Label className="text-sm font-semibold text-slate-700 mb-2 flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Excel File
                </Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    id="fileUpload"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  <label htmlFor="fileUpload" className={`cursor-pointer ${isUploading ? 'opacity-50' : ''}`}>
                    <Upload className="w-16 h-16 text-slate-400 mb-4 mx-auto" />
                    <p className="text-lg font-medium text-slate-600">
                      {isUploading ? "Uploading..." : "Drop Excel file here or click to upload"}
                    </p>
                    <p className="text-sm text-slate-500">
                      Supports .xlsx, .xls, .csv files (max 10MB)
                    </p>
                    {isUploading && (
                      <div className="mt-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={sendToAdmin}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-6"
                  disabled={isUploading}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send to Admin
                </Button>
                <Button
                  onClick={clearData}
                  variant="secondary"
                  className="flex-1 bg-slate-500 hover:bg-slate-600 text-white font-semibold py-4 px-6"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Access Admin Panel */}
          <div className="text-center">
            <Button
              onClick={() => window.location.href = '/api/login'}
              className="bg-slate-800 hover:bg-slate-900 text-white font-semibold py-4 px-8"
            >
              <Shield className="w-4 h-4 mr-2" />
              Access Admin Panel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
