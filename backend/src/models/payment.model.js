import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },

        enrollment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Enrollment",
            default: null,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        paymentMethod: {
            type: String,
            enum: [
                "eSewa",
                "Khalti",
                "Stripe",
                "PayPal",
                "Cash",
            ],
            required: true,
        },

        transactionId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed", "Refunded"],
            default: "Pending",
        },

        paymentType: {
            type: String,
            enum: ["Full", "Installment"],
            default: "Full",
        },

        installmentNumber: {
            type: Number,
            default: 1,
            min: 1,
        },

        invoiceNumber: {
            type: String,
            default: "",
            trim: true,
        },

        paidAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model("Payment", paymentSchema);