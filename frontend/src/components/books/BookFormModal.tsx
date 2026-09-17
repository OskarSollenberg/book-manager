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

type Errors = Partial<Record<"title" | "author", string>>;

/** Mirrors the backend rule: title and author are required, date is not. */
function validate({ title, author }: BookInput): Errors {
  const errors: Errors = {};

  if (!title.trim()) errors.title = "Titel är obligatoriskt.";
  if (!author.trim()) errors.author = "Författare är obligatoriskt.";

  return errors;
}

export function BookFormModal({
  mode,
  initialValues,
  isSaving,
  serverError,
  onSubmit,
  onCancel,
}: BookFormModalProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  function setField<K extends keyof BookInput>(field: K, value: BookInput[K]) {
    const next = { ...values, [field]: value };

    setValues(next);
    // Only re-validate live once they've tried to submit, so the form doesn't
    // shout at someone who is still typing their first field.
    if (hasSubmitted) setErrors(validate(next));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setHasSubmitted(true);

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) onSubmit(values);
  }

  return (
    <Modal
      title={mode === "create" ? "Lägg till bok" : "Redigera bok"}
      onClose={onCancel}
    >
      <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-4">
        {serverError && <ErrorBanner>{serverError}</ErrorBanner>}

        <TextField
          id="title"
          label="Titel"
          required
          autoFocus
          placeholder="t.ex. Doktor Glas"
          value={values.title}
          error={errors.title}
          onChange={(event) => setField("title", event.target.value)}
        />

        <TextField
          id="author"
          label="Författare"
          required
          placeholder="t.ex. Hjalmar Söderberg"
          value={values.author}
          error={errors.author}
          onChange={(event) => setField("author", event.target.value)}
        />

        <TextField
          id="publishedDate"
          type="date"
          label="Publiceringsdatum"
          hint="Valfritt."
          value={values.publishedDate ?? ""}
          onChange={(event) =>
            setField("publishedDate", event.target.value || null)
          }
        />

        <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
            Avbryt
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving
              ? "Sparar…"
              : mode === "create"
                ? "Lägg till"
                : "Spara ändringar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
