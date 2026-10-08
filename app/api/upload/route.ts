import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { documents } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function textToHtml(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => {
      const escaped = escapeHtml(line.trim());

      return escaped
        ? `<p>${escaped}</p>`
        : "<p><br></p>";
    })
    .join("");
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 },
      );
    }

    const fileName = file.name;
    const extension = fileName
      .split(".")
      .pop()
      ?.toLowerCase();

    if (!extension || !["txt", "md"].includes(extension)) {
      return NextResponse.json(
        { error: "Only .txt and .md files are supported" },
        { status: 400 },
      );
    }

    const MAX_FILE_SIZE = 1024 * 1024;

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must be less than 1 MB" },
        { status: 400 },
      );
    }

    const text = await file.text();

    const title = fileName.replace(/\.(txt|md)$/i, "");

    const [document] = await db
      .insert(documents)
      .values({
        title: title || "Imported Document",
        content: textToHtml(text),
        ownerId: user.id,
      })
      .returning();

    return NextResponse.json(
      { document },
      { status: 201 },
    );
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      { error: "Failed to import file" },
      { status: 500 },
    );
  }
}