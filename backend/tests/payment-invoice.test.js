import test from "node:test";
import assert from "node:assert/strict";
import { generateInvoicePdf } from "../src/services/payment.service.js";

test("generateInvoicePdf should create a valid invoice PDF", async () => {
  const pdf = await generateInvoicePdf({
    invoiceNumber: "INV-2026-1234",
    student: { fullName: "Alice Johnson" },
    course: { title: "React Mastery" },
    amount: 1500,
    paymentMethod: "eSewa",
    transactionId: "ESEWA-TEST-123",
    paymentStatus: "Paid",
    paidAt: new Date("2026-01-15T00:00:00.000Z"),
  });

  assert.ok(Buffer.isBuffer(pdf));
  assert.ok(pdf.length > 200);
  assert.match(pdf.toString("latin1"), /%PDF/);
});
