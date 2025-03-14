const express = require("express");
const router = express.Router();
const escortController = require("../controllers/escortController");
const { uploadSingle, uploadMultiple,uploadFields  } = require("../utils/multer");
const { accessTokenVerify, authorizeRoles } = require("../middleware/authMiddleware");

// Register a new escort
router.post(
  "/register",
  uploadFields,
  escortController.registerEscort
);

// Check escort registration status by uniqueId
router.get("/status/:uniqueId", escortController.checkEscortStatus);

// Filter escorts
router.get("/filter", escortController.filterEscorts);

router.get(
  "/all",
  accessTokenVerify,
  authorizeRoles("admin"),
  escortController.getAllEscorts
);
// Update Escort Status (Admin Only)
router.put("/:id/status", accessTokenVerify, authorizeRoles("admin"), escortController.updateEscortStatus);


module.exports = router;
