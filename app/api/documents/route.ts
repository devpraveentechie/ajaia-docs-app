import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import {
  documents,
  documentShares,
} from "@/db/schema";

const createDocumentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1)
    .max(255),

  content: z
    .string()
    .max(500_000)
    .default(""),
});
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const ownedDocuments = await db
      .select()
      .from(documents)
      .where(eq(documents.ownerId, user.id))
      .orderBy(desc(documents.updatedAt));

    const sharedDocuments = await db
      .select({
        id: documents.id,
        title: documents.title,
        content: documents.content,
        ownerId: documents.ownerId,
        createdAt: documents.createdAt,
        updatedAt: documents.updatedAt,
        permission: documentShares.permission,
      })
      .from(documentShares)
      .innerJoin(
        documents,
        eq(documentShares.documentId, documents.id),
      )
      .where(eq(documentShares.userId, user.id))
      .orderBy(desc(documents.updatedAt));
/*
for large scale we would use 
SELECT ...
FROM documents d
LEFT JOIN document_shares ds
  ON d.id = ds.document_id
WHERE
  d.owner_id = ?
  OR ds.user_id = ?
*/
    return NextResponse.json({
      owned: ownedDocuments,
      shared: sharedDocuments,
    });
  } catch (error) {
    console.error("Failed to fetch documents:", error);

    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const result = createDocumentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const [document] = await db
      .insert(documents)
      .values({
        title: result.data.title,
        content: result.data.content,
        ownerId: user.id,
      })
      .returning();

    return NextResponse.json(
      document,
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create document:", error);

    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 },
    );
  }
}