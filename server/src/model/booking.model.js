import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
      required: true,
      index: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "owner",
      required: true,
      index: true,
    },

    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
      index: true,
    },

    pickupDate: {
      type: Date,
      required: true,
      index: true,
    },

    returnDate: {
      type: Date,
      required: true,
    },

    totalDays: {
      type: Number,
      required: true,
      min: 1,
    },

    rentPerDay: {
      type: Number,
      required: true,
      min: 1,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "active",
        "completed",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "refunded"],
      default: "unpaid",
      index: true,
    },

    transactionId: {
      type: String,
      default: "",
      trim: true,
    },

    paymentMethod: {
      type: String,
      default: "",
    },

    cancelledBy: {
      type: String,
      enum: ["customer", "owner", "admin", ""],
      default: "",
    },

    cancelledReason: {
      type: String,
      default: "",
    },

    completedAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

bookingSchema.index({
  customer: 1,
  createdAt: -1,
});

bookingSchema.index({
  owner: 1,
  createdAt: -1,
});

bookingSchema.index({
  car: 1,
  status: 1,
});

bookingSchema.index({
  pickupDate: 1,
  returnDate: 1,
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;