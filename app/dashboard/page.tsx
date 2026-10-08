"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import UserSwitcher from "@/components/UserSwitcher";
import FileUploader from "@/components/FileUploader";

type Document = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
};

type SharedDocument = Document & {
  permission: string;
};

type DocumentsResponse = {
  owned: Document[];
  shared: SharedDocument[];
};

export default function DashboardPage() {
  const [documents, setDocuments] =
    useState<DocumentsResponse>({
      owned: [],
      shared: [],
    });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const response = await fetch("/api/documents");

      if (!response.ok) {
        throw new Error("Failed to load documents");
      }

      const data = await response.json();

      setDocuments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function createDocument() {
    const response = await fetch("/api/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Untitled Document",
        content: "<p></p>",
      }),
    });

    if (!response.ok) {
      alert("Failed to create document");
      return;
    }

    const document = await response.json();

    window.location.href =
      `/documents/${document.id}`;
  }

  if (loading) {
    return (
      <main className="p-8">
        Loading documents...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold">
              Ajaia Docs
            </h1>

            <p className="text-sm text-gray-500">
              Your documents
            </p>
          </div>
          <button
            onClick={createDocument}
            className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
          >
            <Plus size={16} />
            New Document
          </button>
          <FileUploader />
          <UserSwitcher />
        </div>
        
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <section>
          <h2 className="mb-4 text-lg font-semibold">
            My Documents
          </h2>

          {documents.owned.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {documents.owned.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold">
            Shared With Me
          </h2>

          {documents.shared.length === 0 ? (
            <p className="text-sm text-gray-500">
              No shared documents yet.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {documents.shared.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function DocumentCard({
  document,
}: {
  document: Document;
}) {
  return (
    <Link
      href={`/documents/${document.id}`}
      className="block rounded-lg border bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <FileText
        size={28}
        className="mb-4"
      />

      <h3 className="font-medium">
        {document.title}
      </h3>

      <p className="mt-2 text-xs text-gray-500">
        Updated{" "}
        {new Date(
          document.updatedAt,
        ).toLocaleString()}
      </p>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed bg-white p-10 text-center">
      <FileText
        size={40}
        className="mx-auto mb-4 text-gray-400"
      />

      <p className="text-gray-600">
        No documents yet.
      </p>

      <p className="mt-1 text-sm text-gray-400">
        Create your first document.
      </p>
    </div>
  );
}