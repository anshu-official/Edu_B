const { transporter } = require("../config/transporter");

exports.sendToOne = async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    const mailOptions = {
      from: "hopesalive15000@gmail.com",
      to: to,
      subject: subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    return res.json({
      success: true,
      message: "Email Sent Successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
};
