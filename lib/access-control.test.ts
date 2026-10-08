import { describe, expect, it } from "vitest";
import { canEditDocumentAccess } from "@/lib/access-control";

describe("canEditDocumentAccess", () => {
  it("allows the document owner to edit", () => {
    expect(
      canEditDocumentAccess(true),
    ).toBe(true);
  });

  it("allows a shared user with EDIT permission", () => {
    expect(
      canEditDocumentAccess(false, "EDIT"),
    ).toBe(true);
  });

  it("denies a shared user with READ permission", () => {
    expect(
      canEditDocumentAccess(false, "READ"),
    ).toBe(false);
  });

  it("denies an unshared user", () => {
    expect(
      canEditDocumentAccess(false),
    ).toBe(false);
  });
});