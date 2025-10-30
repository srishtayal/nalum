const Newsletter = require("../../models/admin/newsletter.model");
const { logAdminActivity } = require("../../middleware/adminAuth");
const multer = require("multer");
const path = require("path");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/newsletters/"); // Create this directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      "newsletter-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

// Upload middleware
exports.uploadMiddleware = upload.single("newsletter");

// Upload newsletter
exports.uploadNewsletter = async (req, res) => {
  try {
    const { title, description, published_date } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Newsletter PDF file is required",
      });
    }

    // Create newsletter record
    const newsletter = await Newsletter.create({
      title,
      description: description || "",
      file_url: `/uploads/newsletters/${req.file.filename}`,
      file_name: req.file.originalname,
      file_size: req.file.size,
      uploaded_by: req.admin.email,
      published_date: published_date || new Date(),
      is_active: true,
    });

    // Log activity
    await logAdminActivity(
      req.admin.email,
      "upload_newsletter",
      "newsletter",
      newsletter._id,
      {
        title,
        file_name: req.file.originalname,
        file_size: req.file.size,
      },
      req.ip
    );

    res.status(201).json({
      success: true,
      message: "Newsletter uploaded successfully",
      data: newsletter,
    });
  } catch (error) {
    console.error("Error uploading newsletter:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while uploading newsletter",
    });
  }
};

// Get all newsletters
exports.getAllNewsletters = async (req, res) => {
  try {
    const { page = 1, limit = 10, is_active } = req.query;

    const query = {};
    if (is_active !== undefined) query.is_active = is_active === "true";

    const newsletters = await Newsletter.find(query)
      .sort({ published_date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Newsletter.countDocuments(query);

    res.status(200).json({
      success: true,
      data: newsletters,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching newsletters:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching newsletters",
    });
  }
};

// Delete newsletter
exports.deleteNewsletter = async (req, res) => {
  try {
    const { newsletterId } = req.params;

    const newsletter = await Newsletter.findById(newsletterId);
    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: "Newsletter not found",
      });
    }

    // Soft delete - mark as inactive
    newsletter.is_active = false;
    await newsletter.save();

    // Log activity
    await logAdminActivity(
      req.admin.email,
      "delete_newsletter",
      "newsletter",
      newsletterId,
      {
        title: newsletter.title,
      },
      req.ip
    );

    res.status(200).json({
      success: true,
      message: "Newsletter deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting newsletter:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting newsletter",
    });
  }
};

// Track newsletter view
exports.trackView = async (req, res) => {
  try {
    const { newsletterId } = req.params;

    await Newsletter.findByIdAndUpdate(newsletterId, {
      $inc: { view_count: 1 },
    });

    res.status(200).json({
      success: true,
      message: "View tracked",
    });
  } catch (error) {
    console.error("Error tracking view:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred",
    });
  }
};

// Track newsletter download
exports.trackDownload = async (req, res) => {
  try {
    const { newsletterId } = req.params;

    await Newsletter.findByIdAndUpdate(newsletterId, {
      $inc: { download_count: 1 },
    });

    res.status(200).json({
      success: true,
      message: "Download tracked",
    });
  } catch (error) {
    console.error("Error tracking download:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred",
    });
  }
};
