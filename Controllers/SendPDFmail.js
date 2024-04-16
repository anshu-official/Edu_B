const transporter = require("../utilities/mailSend");

exports.sendPDFmail = async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    const attachment = req.file;

    // Check if a file is attached
    // if (!attachment) {
    //   return res.status(400).json({ message: "No file attached" });
    // }

    const mailOptions = {
      from: "Edu Craft",
      to: to,
      subject: subject,
      text: message,
      // attachments: [
      //   { filename: attachment.originalname, content: attachment.buffer },
      // ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send email" });
      } else {
        console.log("Email sent:", info.response);
        res.status(200).json({ message: "Email sent successfully" });
      }
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
};
