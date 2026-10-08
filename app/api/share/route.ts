import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import {
  documents,
  documentShares,
  users,
} from "@/db/schema";

const shareSchema = z.object({
  documentId: z.string().uuid(),
  email: z.string().email(),
  permission: z
    .enum(["EDIT"])
    .default("EDIT"),
});

export async function POST(
  request: NextRequest,
) {
  try {
    const currentUser =
      await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const result =
      shareSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
        },
        { status: 400 },
      );
    }

    const {
      documentId,
      email,
      permission,
    } = result.data;

    // Find document
    const [document] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, documentId))
      .limit(1);

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    // Only owner can share
    if (
      document.ownerId !==
      currentUser.id
    ) {
      return NextResponse.json(
        { error: "Only the owner can share" },
        { status: 403 },
      );
    }

    // Find recipient
    const [recipient] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!recipient) {
      return NextResponse.json(
        {
          error:
            "Recipient user not found",
        },
        { status: 404 },
      );
    }

    // Prevent sharing with yourself
    if (
      recipient.id === currentUser.id
    ) {
      return NextResponse.json(
        {
          error:
            "You cannot share a document with yourself",
        },
        { status: 400 },
      );
    }

    // Check existing share
    const existingShare =
      await db
        .select()
        .from(documentShares)
        .where(
          and(
            eq(
              documentShares.documentId,
              documentId,
            ),
            eq(
              documentShares.userId,
              recipient.id,
            ),
          ),
        )
        .limit(1);

    if (existingShare.length > 0) {
      return NextResponse.json(
        {
          error:
            "Document already shared with this user",
        },
        { status: 409 },
      );
    }

    const [share] = await db
      .insert(documentShares)
      .values({
        documentId,
        userId: recipient.id,
        permission,
      })
      .returning();

    return NextResponse.json(
      share,
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Failed to share document:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to share document",
      },
      { status: 500 },
    );
  }
}