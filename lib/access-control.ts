export type Permission = "READ" | "EDIT";

export function canEditDocumentAccess(
  isOwner: boolean,
  permission?: Permission,
) {
  if (isOwner) {
    return true;
  }

  return permission === "EDIT";
}