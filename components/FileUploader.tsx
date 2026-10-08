"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FileUploader() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      router.push(`/documents/${data.document.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Upload failed",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor="file-upload"
        className="inline-flex cursor-pointer items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
      >
        {uploading ? "Importing..." : "Import .txt / .md"}
      </label>

      <input
        id="file-upload"
        type="file"
        accept=".txt,.md,text/plain,text/markdown"
        onChange={handleUpload}
        disabled={uploading}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}