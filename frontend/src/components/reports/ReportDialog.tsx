import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/lib/api";

interface ReportDialogProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  onReportSubmitted?: () => void;
}

const REPORT_REASONS = [
  "Spam",
  "Inappropriate Content",
  "Harassment or Hate Speech",
  "Misinformation",
  "Violence or Dangerous Content",
  "Copyright Violation",
  "Other",
];

const ReportDialog: React.FC<ReportDialogProps> = ({
  postId,
  isOpen,
  onClose,
  onReportSubmitted,
}) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason || !description) {
      toast.error("Please provide both reason and description");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post(`/reports/post/${postId}`, {
        reason,
        description,
      });

      toast.success("Post reported");
      onReportSubmitted?.();
      setReason("");
      setDescription("");
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setReason("");
      setDescription("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-slate-950 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Report Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Reason
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="" className="bg-slate-900">
                Select a reason
              </option>
              {REPORT_REASONS.map((r) => (
                <option key={r} value={r} className="bg-slate-900">
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              disabled={isSubmitting}
              placeholder="Please provide detailed information about why you're reporting this post..."
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 resize-none focus-visible:ring-blue-500/50"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !reason.trim() || !description.trim()}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isSubmitting ? "Reporting..." : "Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
