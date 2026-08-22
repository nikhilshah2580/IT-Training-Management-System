import test from "node:test";
import assert from "node:assert/strict";
import { generateCertificatePdf } from "../src/services/certificate.service.js";

test("generateCertificatePdf should create a valid PDF buffer", async () => {
  const pdf = await generateCertificatePdf({
    certificateNumber: "SIP-2026-ABC123",
    verificationCode: "VERIFY123",
    student: { fullName: "Alice Johnson" },
    course: { title: "React Mastery" },
    issuedBy: { fullName: "Admin Team" },
    issueDate: new Date("2026-01-15T00:00:00.000Z"),
    completionDate: new Date("2026-01-15T00:00:00.000Z"),
    grade: 96,
  });

  assert.ok(Buffer.isBuffer(pdf));
  assert.ok(pdf.length > 200);
  assert.match(pdf.toString("latin1"), /%PDF/);
});
