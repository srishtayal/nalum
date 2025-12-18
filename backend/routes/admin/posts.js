const express = require("express");
const router = express.Router();
const postsController = require("../../controllers/admin/posts.controller");
const { protectAdmin } = require("../../middleware/adminAuth");
const multer = require("../../config/multer.config");

// All routes are protected (admin only)
router.get("/all", protectAdmin, postsController.getAllPosts);
router.get("/pending", protectAdmin, postsController.getPendingPosts);
router.get("/:postId", protectAdmin, postsController.getPostById);
router.put("/:postId/approve", protectAdmin, postsController.approvePost);
router.put("/:postId/reject", protectAdmin, postsController.rejectPost);
router.put(
  "/:postId",
  protectAdmin,
  multer.array("images", 2),
  postsController.updatePost
);
router.delete("/:postId", protectAdmin, postsController.deletePost);

module.exports = router;
