import { db } from "@/lib/db";
import {
  documents,
  documentShares,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { canEditDocumentAccess } from "./access-control";

export async function canReadDocument(
  userId: string,
  documentId: string,
) {
  const document = await db
    .select()
    .from(documents)
    .where(eq(documents.id, documentId))
    .limit(1);

  if (!document[0]) {
    return false;
  }

  // Owner always has read access.
  if (document[0].ownerId === userId) {
    return true;
  }

  // Check whether document was shared with the user.
  const share = await db
    .select()
    .from(documentShares)
    .where(
      and(
        eq(documentShares.documentId, documentId),
        eq(documentShares.userId, userId),
      ),
    )
    .limit(1);

  return share.length > 0;
}

export async function canEditDocument(
  userId: string,
  documentId: string,
) {
  const document = await db
    .select()
    .from(documents)
    .where(eq(documents.id, documentId))
    .limit(1);

  if (!document[0]) {
    return false;
  }

  // Owner can always edit.
  const isOwner = document[0].ownerId === userId;

if (isOwner) {
  return canEditDocumentAccess(true);
}

const share = await db
  .select()
  .from(documentShares)
  .where(
    and(
      eq(documentShares.documentId, documentId),
      eq(documentShares.userId, userId),
    ),
  )
  .limit(1);

return canEditDocumentAccess(
  false,
  share[0]?.permission as "READ" | "EDIT" | undefined,
);
  return share.length > 0;
}