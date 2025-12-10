const express = require("express");
const router = express.Router();
const newsletterController = require("../../controllers/admin/newsletter.controller");
const { protectAdmin } = require("../../middleware/adminAuth");

// All routes are protected (admin only)
router.post(
  "/upload",
  protectAdmin,
  newsletterController.uploadMiddleware,
  newsletterController.uploadNewsletter
);
router.get("/all", protectAdmin, newsletterController.getAllNewsletters);
router.delete("/:newsletterId", protectAdmin, newsletterController.deleteNewsletter);
router.post("/:newsletterId/view", newsletterController.trackView);
router.post("/:newsletterId/download", newsletterController.trackDownload);

module.exports = router;
