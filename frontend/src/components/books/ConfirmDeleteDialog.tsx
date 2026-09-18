"use client";

import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Modal } from "@/components/ui/Modal";
import type { Book } from "@/types/book";

interface ConfirmDeleteDialogProps {
  book: Book;
  isDeleting: boolean;
  serverError: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteDialog({
  book,
  isDeleting,
  serverError,
  onConfirm,
  onCancel,
}: ConfirmDeleteDialogProps) {
  return (
    <Modal title="Delete book" onClose={onCancel}>
      <p className="mt-3 text-sm text-text-secondary">
        Are you sure you want to delete{" "}
        <span className="font-medium text-text">{book.title}</span>? This cannot
        be undone.
      </p>

      {serverError && (
        <div className="mt-4">
          <ErrorBanner>{serverError}</ErrorBanner>
        </div>
      )}

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={isDeleting}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? "Deleting…" : "Delete"}
        </Button>
      </div>
    </Modal>
  );
}
