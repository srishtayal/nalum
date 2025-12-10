const express = require("express");
const router = express.Router();
const axios = require("axios");
const multer = require("multer");
const FormData = require("form-data");

const upload = multer();
router.post("/parse", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    const microservice_URL = process.env.MICROSERVICE_URL;
    if (!microservice_URL) {
      return res.status(500).send("Microservice URL not configured.");
    }

    const response = await axios.post(microservice_URL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    console.log("Response from microservice:", response.data);
    return res.json(response.data); 
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error."); 
  }
});

module.exports = router;
