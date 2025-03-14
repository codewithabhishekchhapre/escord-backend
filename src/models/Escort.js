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
    country: { type: String, required: true },  // ✅ Added country
    state: { type: String, required: true },    // ✅ Added state
    city: { type: String, required: true },     // ✅ Added city
    bio: { type: String, required: true },
    weight: { type: String, required: true },
    profile_photo: { type: String, required: true },
    images: { type: [String] },
    videos: { type: [String] },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Escort", escortSchema);
