import mongoose, { Schema, model } from "mongoose";

const customerSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One customer profile per user
    },

    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    totalBookings: {
      type: Number,
      default: 0,
      min: 0,
    },

    completedBookings: {
      type: Number,
      default: 0,
      min: 0,
    },

    cancelledBookings: {
      type: Number,
      default: 0,
      min: 0,
    },
    activeBookings: {
    type: Number,
    default: 0
},

    totalSpent: {
      type: Number,
      default: 0,
      min: 0,
    },

  },
  {
    timestamps: true,
  }
);

// ---------- Indexes ----------



// Admin Dashboard
customerSchema.index({ totalSpent: -1 });
customerSchema.index({ totalBookings: -1 });

// Latest Customers
customerSchema.index({ createdAt: -1 });

const customer = mongoose.model("customer", customerSchema);

export default customer