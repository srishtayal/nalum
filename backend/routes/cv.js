const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../config/multer.config");
const { updateCV, deleteCV } = require("../middleware/cv.middleware");
const User = require("../models/user/user.model");

router.get("/", auth.protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.customCV) {
      return res.status(404).send("No CV found.");
    }
    res.set("Content-Type", user.customCV.contentType);
    res.send(user.customCV.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
});

router.put("/", auth.protect, upload.single("custom_cv"), updateCV);

router.delete("/", auth.protect, deleteCV);

module.exports = router;
