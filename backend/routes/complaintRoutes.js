import express from "express";
import multer from "multer";
import Complaint from "../models/Complaint.js";
import { uploadImage } from "../utils/cloudinaryUpload.js";
import { analyzeRoadIssue } from "../utils/geminiVision.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// store uploaded file temporarily in memory, then push to Cloudinary
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

// POST /api/complaints  (citizen creates a new report)
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { description, lat, lng, address, district, isAnonymous } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // 1. Upload image to Cloudinary
    const imageUrl = await uploadImage(req.file.path);

    // 2. Run Gemini Vision analysis
    const aiResult = await analyzeRoadIssue(imageUrl, description);

    // 3. Save complaint with both user + AI data
    const complaint = await Complaint.create({
      user: req.user.id,
      imageUrl,
      userDescription: description,
      location: { lat, lng, address, district },
      aiCategory: aiResult.category,
      aiSeverity: aiResult.severity,
      aiDescription: aiResult.description,
      aiConfidenceNote: aiResult.note,
      isAnonymous: isAnonymous === "true",
    });

    res.status(201).json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/complaints  (all complaints - for map view, filterable)
router.get("/", async (req, res) => {
  try {
    const { district, severity, status } = req.query;
    const filter = {};
    if (district) filter["location.district"] = district;
    if (severity) filter.aiSeverity = severity;
    if (status) filter.status = status;

    const complaints = await Complaint.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/complaints/mine  (logged-in user's own complaints)
router.get("/mine", protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/complaints/:id/status  (admin updates status)
router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
