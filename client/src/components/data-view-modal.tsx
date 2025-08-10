import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";
import type { ExcelDataEntry } from "@shared/schema";

interface DataViewModalProps {
  entry: ExcelDataEntry;
  onClose: () => void;
  onDownload: () => void;
}

export function DataViewModal({ entry, onClose, onDownload }: DataViewModalProps) {
  const data = entry.data as any[];
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900">Data Details</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="mb-4">
            <h4 className="font-semibold text-slate-700">Entry Information</h4>
            <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
              <div>
                <span className="font-medium">Month/Year:</span>{' '}
                {entry.month.charAt(0).toUpperCase() + entry.month.slice(1)} {entry.year}
              </div>
              <div>
                <span className="font-medium">File Name:</span> {entry.fileName || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Records:</span> {entry.recordCount}
              </div>
              <div>
                <span className="font-medium">Status:</span> {entry.status}
              </div>
            </div>
          </div>
          
          {data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100">
                    {headers.map((header, index) => (
                      <th
                        key={index}
                        className="border border-slate-300 px-4 py-2 text-left font-semibold"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 20).map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      {headers.map((header, headerIndex) => (
                        <td
                          key={headerIndex}
                          className="border border-slate-300 px-4 py-2"
                        >
                          {row[header] || ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {data.length > 20 && (
                    <tr>
                      <td
                        colSpan={headers.length}
                        className="border border-slate-300 px-4 py-2 text-center text-slate-500 italic"
                      >
                        ... and {data.length - 20} more rows
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              No data available for this entry.
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-3 p-6 border-t border-slate-200">
          <Button
            onClick={onDownload}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            onClick={onClose}
            variant="secondary"
            className="bg-slate-500 hover:bg-slate-600 text-white"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
