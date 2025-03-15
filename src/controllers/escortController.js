const Escort = require("../models/Escort");
const { v4: uuidv4 } = require("uuid"); // Generate a unique ID for each escort

const BASE_URL = "https://yourdomain.com"; // Change this to your actual domain

// Function to generate a custom unique ID
const generateUniqueId = (name) => {
  const sanitized_name = name.toLowerCase().replace(/\s+/g, "-"); // Convert name to lowercase & replace spaces with "-"
  
  // Generate a random 4-letter and 4-digit string
  const letters = Math.random().toString(36).substring(2, 6); // Random 4 letters
  const digits = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
  
  return `escort-${sanitized_name}-${letters}${digits}`;
};

// Register a new escort
exports.registerEscort = async (req, res) => {
  try {
    const {
      name,
      age,
      height,
      chest,
      contact_number,
      whatsapp_number,
      location,
      country, // ✅ Added country
      state,   // ✅ Added state
      city,    // ✅ Added city
      bio,
      weight,
    } = req.body;

    if (!req.files || !req.files["profile_photo"]) {
      return res.status(400).json({ message: "Profile photo is required." });
    }

    // Generate a unique ID for the escort
    const uniqueId = generateUniqueId(name);

    // Function to format image URLs with domain & folder structure
    // const formatFileUrl = (filename) => `${BASE_URL}/uploads/${filename}`;
    const formatFileUrl = (filename) => `/uploads/${filename}`;

    // Save profile photo URL
    const profile_photo = formatFileUrl(`images/${req.files["profile_photo"][0].filename}`);

    // Save multiple images URLs
    const images = req.files["images"] ? req.files["images"].map((file) => formatFileUrl(`images/${file.filename}`)) : [];

    // Save multiple video URLs
    const videos = req.files["videos"] ? req.files["videos"].map((file) => formatFileUrl(`videos/${file.filename}`)) : [];

    // Save data in MongoDB
    const escort = new Escort({
      name,
      age,
      height,
      chest,
      contact_number,
      whatsapp_number,
      location,
      country, // ✅ Save country
      state,   // ✅ Save state
      city,    // ✅ Save city
      bio,
      weight,
      profile_photo,
      images,
      videos,
      uniqueId,
    });

    await escort.save();
    res.status(201).json({ message: "Escort registered successfully", uniqueId: escort.uniqueId });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


// / Filter Escorts by Country, State, or City (only approved escorts)
exports.filterEscorts = async (req, res) => {
  try {
    const { country, state, city } = req.query;
    let filter = { status: "approved" };  // Add the filter for approved escorts

    // Add other filters based on the query parameters
    if (country) filter.country = country;
    if (state) filter.state = state;
    if (city) filter.city = city;

    // Find the escorts that match the filter
    const escorts = await Escort.find(filter);

    // If no escorts are found
    if (!escorts.length) {
      return res.status(404).json({ message: "No approved escorts found for the given filter" });
    }

    // Return the filtered escorts
    res.status(200).json({ message: "Filtered approved escorts retrieved successfully", escorts });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


// Check Escort Registration Status
exports.checkEscortStatus = async (req, res) => {
  try {
    const { uniqueId } = req.params;
    
    // Find escort by uniqueId and select required fields
    const escort = await Escort.findOne({ uniqueId }).select(
      "name status bio location contact_number uniqueId profile_photo"
    );

    if (!escort) {
      return res.status(404).json({ message: "Escort not found" });
    }

    res.status(200).json({ 
      message: "Registration status retrieved successfully",
      data: escort 
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


// Get all escort registrations (Admin Only)
exports.getAllEscorts = async (req, res) => {
  try {
    const escorts = await Escort.find();
    
    if (!escorts.length) {
      return res.status(404).json({ message: "No escorts found" });
    }

    res.status(200).json({ escorts });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get all approved escorts
exports.getApprovedEscorts = async (req, res) => {
  try {
    // Find all escorts with status 'approved'
    const escorts = await Escort.find({ status: "approved" });

    if (!escorts.length) {
      return res.status(404).json({ message: "No approved escorts found" });
    }

    res.status(200).json({
      message: "Approved escorts retrieved successfully",
      escorts,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


// Update Escort Status (Admin Only)
exports.updateEscortStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const escort = await Escort.findById(id);
    if (!escort) {
      return res.status(404).json({ message: "Escort not found" });
    }

    escort.status = status;
    await escort.save();

    res.status(200).json({ message: `Escort status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


