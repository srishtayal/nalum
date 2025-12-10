const express = require("express");
const router = express.Router();
const verificationTokens = require("../../controllers/verificationToken.controller.js");
const mailer = require("../../mail/transporter.js");


router.post("/" , async (req , res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }
    // ? Create verification token
  const tokenResponse = await verificationTokens.create(email);

  if (tokenResponse.error) {
    return res.status(500).json(tokenResponse);
  }

  const verificationLink = `http://localhost:8080/verify-account?email=${email}&token=${tokenResponse.data.token}`;

  const mailResponse = await mailer.sendMail(
    email,
    "Verify Your Account",
    `Click the following link to verify your account: ${verificationLink}`,
    `<p>Click the following link to verify your account: <a href="${verificationLink}">${verificationLink}</a></p>`
  );

  return res
    .status(mailResponse.error ? 500 : 200)
    .json(
      mailResponse.error
        ? mailResponse
        : { error: false, message: "Verification link sent to email." }
    );
});

module.exports = router;