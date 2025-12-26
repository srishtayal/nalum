const mailConfig = require("../config/mail.config");

exports.sendMail = async (recipient, subject, text, html) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": mailConfig.SMTP_PASS,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: mailConfig.FROM_NAME,
          email: mailConfig.FROM_EMAIL,
        },
        to: [
          {
            email: recipient,
          },
        ],
        subject: subject,
        htmlContent: html,
        textContent: text,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Brevo API error:", errorData);
      throw new Error(`Brevo API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    console.log("Email sent successfully:", result.messageId);
    return { error: false, messageId: result.messageId };
  } catch (error) {
    console.error("Mailer error:", error);
    return { error: true, message: error.message };
  }
};