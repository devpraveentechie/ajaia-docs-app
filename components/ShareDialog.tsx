"use client";

import { useState } from "react";

type ShareDialogProps = {
  documentId: string;
  onClose: () => void;
};

export default function ShareDialog({
  documentId,
  onClose,
}: ShareDialogProps) {
  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function handleShare() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/share",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            documentId,
            email,
            permission: "EDIT",
          }),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.error ||
            "Failed to share document",
        );

        return;
      }

      setMessage(
        "Document shared successfully",
      );

      setEmail("");
    } catch {
      setMessage(
        "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Share Document
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        <label className="mb-2 block text-sm font-medium">
          Email address
        </label>

        <input
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          placeholder="Kumar@ajaia.com"
          className="mb-4 w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
        />

        <p className="mb-4 text-xs text-gray-500">
          The recipient will have edit access.
        </p>

        {message && (
          <p className="mb-4 text-sm">
            {message}
          </p>
        )}

        <button
          onClick={handleShare}
          disabled={
            loading || !email
          }
          className="w-full rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {loading
            ? "Sharing..."
            : "Share"}
        </button>
      </div>
    </div>
  );
}