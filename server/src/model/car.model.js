import mongoose from "mongoose"

const carSchema = new mongoose.Schema({
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true ,
        index : true
    },
      title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    model: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
      index: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Sedan",
        "SUV",
        "Hatchback",
        "Luxury",
        "Sports",
        "Convertible",
        "Pickup",
        "Van",
        "Electric",
      ],
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1500,
    },

    images: {
      type: [String],
      required: true,
      validate: {
        validator: function (value) {
          return value.length > 0;
        },
        message: "At least one image is required.",
      },
    },

    rentPerDay: {
      type: Number,
      required: true,
      min: 1,
      index: true,
    },

    transmission: {
      type: String,
      required: true,
      enum: ["Automatic", "Manual"],
    },

    fuelType: {
      type: String,
      required: true,
      enum: [
        "Petrol",
        "Diesel",
        "Electric",
        "Hybrid",
        "CNG",
      ],
    },

    seat: {
      type: Number,
      required: true,
      min: 2,
      max: 20,
    },

    location: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
      index: true,
    },


    
  
} ,{
    timestamps : true,
    versionKey : false
});

carSchema.index({
  category: 1,
  brand: 1,
  rentPerDay: 1,
});

carSchema.index({
  location: 1,
  category: 1,
});


const carModel = mongoose.model("Car", carSchema);

export default carModel;