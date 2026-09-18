"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Modal } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/TextField";
import type { BookInput } from "@/types/book";

interface BookFormModalProps {
  mode: "create" | "edit";
  initialValues: BookInput;
  isSaving: boolean;
  serverError: string | null;
  onSubmit: (values: BookInput) => void;
  onCancel: () => void;
}

// Client validation is off so empty fields reach the API (assignment).
// Uncomment to mirror [NotBlank] in the form if this grows.
//
// type Errors = Partial<Record<"title" | "author", string>>;
//
// function validate({ title, author }: BookInput): Errors {
//   const errors: Errors = {};
//   if (!title.trim()) errors.title = "Title is required.";
//   if (!author.trim()) errors.author = "Author is required.";
//   return errors;
// }

export function BookFormModal({
  mode,
  initialValues,
  isSaving,
  serverError,
  onSubmit,
  onCancel,
}: BookFormModalProps) {
  const [values, setValues] = useState(initialValues);
  // const [errors, setErrors] = useState<Errors>({});
  // const [hasSubmitted, setHasSubmitted] = useState(false);

  function setField<K extends keyof BookInput>(field: K, value: BookInput[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    // if (hasSubmitted) setErrors(validate(next));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    // setHasSubmitted(true);
    // const nextErrors = validate(values);
    // setErrors(nextErrors);
    // if (Object.keys(nextErrors).length === 0) onSubmit(values);
    onSubmit(values);
  }

  return (
    <Modal
      title={mode === "create" ? "Add book" : "Edit book"}
      onClose={onCancel}
    >
      <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-4">
        {serverError && <ErrorBanner>{serverError}</ErrorBanner>}

        <TextField
          id="title"
          label="Title"
          required
          autoFocus
          placeholder="e.g. Doktor Glas"
          value={values.title}
          // error={errors.title}
          onChange={(event) => setField("title", event.target.value)}
        />

        <TextField
          id="author"
          label="Author"
          required
          placeholder="e.g. Hjalmar Söderberg"
          value={values.author}
          // error={errors.author}
          onChange={(event) => setField("author", event.target.value)}
        />

        <TextField
          id="publishedDate"
          type="date"
          label="Publication date"
          hint="Optional."
          value={values.publishedDate ?? ""}
          onChange={(event) =>
            setField("publishedDate", event.target.value || null)
          }
        />

        <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving
              ? "Saving…"
              : mode === "create"
                ? "Add"
                : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
