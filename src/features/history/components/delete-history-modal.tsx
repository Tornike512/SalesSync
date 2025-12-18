"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";

interface DeleteHistoryModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly isDeleting: boolean;
}

export function DeleteHistoryModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteHistoryModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete All History"
      className="bg-[var(--color-cream)]"
    >
      <div className="space-y-4">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-[var(--color-orange)]/10">
            <AlertTriangle className="size-8 text-[var(--color-orange)]" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center">
          <p className="mb-2 font-medium text-[var(--foreground-100)] text-lg">
            Are you sure you want to delete all history?
          </p>
          <p className="text-[var(--foreground-100)]/70 text-sm">
            This action cannot be undone. All your viewing history will be
            permanently removed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 rounded-lg border-2 border-[var(--foreground-100)] bg-transparent px-4 py-2 font-medium text-[var(--foreground-100)] transition-colors hover:bg-[var(--color-sage)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-lg bg-[var(--color-orange)] px-4 py-2 font-medium text-[var(--color-cream)] transition-colors hover:bg-[var(--color-orange)]/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete All"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
