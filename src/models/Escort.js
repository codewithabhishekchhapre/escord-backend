const mongoose = require("mongoose");
const escortSchema = new mongoose.Schema(
  {
    uniqueId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    height: { type: String, required: true },
    chest: { type: String, required: true },
    contact_number: { type: String, required: true },
    whatsapp_number: { type: String, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    bio: { type: String, required: true },
    weight: { type: String, required: true },
    profile_photo: { type: String, required: true },
    images: { type: [String] },
    videos: { type: [String] },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    services: { type: [String], required: true },  // Store as an array of strings
    rates: [{                  // Correct definition of rates as an array of objects
      hours: { type: String, required: true },    // You may change this to `Number` if you want hours as a number
      rate: { type: String, required: true }      // Change to `Number` if the rate should be a number
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Escort", escortSchema);
