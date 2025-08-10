import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import type { ExcelDataEntry } from "@shared/schema";

interface DeleteConfirmModalProps {
  entry: ExcelDataEntry;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteConfirmModal({ entry, onClose, onConfirm, isDeleting }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-slate-900 mb-2">Delete Data Entry</h3>
            <p className="text-sm text-slate-500 mb-2">
              Are you sure you want to delete the data entry for{' '}
              <strong>
                {entry.month.charAt(0).toUpperCase() + entry.month.slice(1)} {entry.year}
              </strong>
              ?
            </p>
            <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
            <Button
              onClick={onClose}
              disabled={isDeleting}
              variant="secondary"
              className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-700 font-medium"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
