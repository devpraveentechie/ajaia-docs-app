import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import {z} from 'zod';
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { documents } from "@/db/schema";
import {
  canReadDocument,
  canEditDocument,
} from "@/lib/permission";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};
const updateDocumentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .optional(),

  content: z
    .string()
    .max(500_000)
    .optional(),
});

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    const [document] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    const allowed = await canReadDocument(
      user.id,
      id,
    );

    if (!allowed) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    const editable = await canEditDocument(
      user.id,
      id,
    );

    return NextResponse.json({
      ...document,
      editable,
    });
  } catch (error) {
    console.error("Failed to fetch document:", error);

    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    const allowed = await canEditDocument(
      user.id,
      id,
    );

    if (!allowed) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    const body = await request.json();

    const result =
      updateDocumentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 },
      );
    }

    const [updatedDocument] = await db
      .update(documents)
      .set({
        ...result.data,
        updatedAt: new Date(),
      })
      .where(eq(documents.id, id))
      .returning();

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error("Failed to update document:", error);

    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 },
    );
  }
}