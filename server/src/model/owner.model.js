import mongoose, { model, Schema } from "mongoose";

// owner profile
const ownerSchema = new mongoose.Schema({
    user :{
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
        unique : true ,
        index : true
    },
      // Business Information
    businessName: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

  drivingLicense: {
    number: {
        type: String,
        default: ""
    },
    document: {
        type: String,
        default: ""
    },
    submittedAt: Date
},

    bio: {
      type: String,
      default: "",
      maxlength: 500,
      trim: true,
    },

    // Verification
    verificationStatus: {
      type: String,
      enum: ["notSubmitted","pending", "approved", "rejected"],
      default: "notSubmitted",
      index: true,
    },


    verifiedAt: Date,

    // Dashboard Statistics
    totalCars: {
      type: Number,
      default: 0,
      min: 0,
    },

    activeCars: {
      type: Number,
      default: 0,
      min: 0,
    },

    inactiveCars: {
      type: Number,
      default: 0,
      min: 0,
    },

    activeBookings: {
    type: Number,
    default: 0
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

    totalRevenue: {
      type: Number,
      default: 0,
      min: 0,
    },

    monthlyRevenue: {
      type: Number,
      default: 0,
      min: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

},{timestamps : true})

const Owner = model("owner" , ownerSchema);

export default Owner

