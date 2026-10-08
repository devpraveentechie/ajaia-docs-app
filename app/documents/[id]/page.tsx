"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import DocumentEditor from "@/components/DocumentEditor";
import ShareDialog from "@/components/ShareDialog";

type DocumentData = {
  id: string;
  title: string;
  content: string;
  editable: boolean;
};

export default function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [document, setDocument] =
    useState<DocumentData | null>(null);

  const [title, setTitle] = useState("");
const [showShareDialog, setShowShareDialog] =
  useState(false);
  const [content, setContent] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  useEffect(() => {
    async function loadDocument() {
      const { id } = await params;

      const response = await fetch(
        `/api/documents/${id}`,
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setDocument(data);
      setTitle(data.title);
      setContent(data.content);
    }

    loadDocument();
  }, [params]);

  async function saveDocument() {
    if (!document) {
      return;
    }

    setSaving(true);
    setSaved(false);

    try {
      const response = await fetch(
        `/api/documents/${document.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "Failed to save document",
        );
      }

      setSaved(true);
    } catch (error) {
      console.error(error);
      alert("Failed to save document");
    } finally {
      setSaving(false);
    }
  }

  if (!document) {
    return (
      <main className="p-8">
        Loading document...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-black"
          >
            ← Documents
          </Link>

          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-sm text-green-600">
                Saved
              </span>
            )}

            {document.editable && (
              <>
    <button
      onClick={saveDocument}
      disabled={saving}
      className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
    >
      {saving ? "Saving..." : "Save"}
    </button>

    <button
      onClick={() =>
        setShowShareDialog(true)
      }
      className="rounded-md border px-4 py-2 text-sm"
    >
      Share
    </button>
  </>
              
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <input
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          disabled={!document.editable}
          className="mb-6 w-full bg-transparent text-3xl font-semibold outline-none"
          placeholder="Untitled Document"
        />

        <DocumentEditor
        content={content}
        onChange={setContent}
        editable={document.editable}
        />
      </div>
      {showShareDialog && (
        <ShareDialog
            documentId={document.id}
            onClose={() =>
            setShowShareDialog(false)
            }
        />
        )}
    </main>
  );
}