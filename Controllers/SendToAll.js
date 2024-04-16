const readline = require("readline");
const transporter = require("../utilities/mailSend");
const User = require("../models/User");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

exports.SendToAll = async (pdfPath) => {
  try {
    const getStudentEmails = async () => {
      try {
        // Perform database query to get emails
        const emails = await User.find(
          { role: "Student" },
          { email: 1, _id: 0 }
        );

        return emails.map((student) => student.email);
      } catch (error) {
        console.error("Error retrieving student emails:", error);
        return [];
      }
    };

    const studentEmails = await getStudentEmails();

    const mailOptions = {
      from: "Edu Craft",
      to: studentEmails.join(","),
      subject: "Document Sent by Edu Craft",
      text: "Go through document properly",
      attachments: [{ filename: "document.pdf", path: pdfPath }],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    console.error("Error sending email to students:", error);
  }
};

// Prompt user to choose PDF file
rl.question("Enter the path to the PDF file: ", (pdfPath) => {
  // Call the function to send email to all students with the chosen PDF file
  exports.SendToAll(pdfPath);

  // Close the readline interface
  rl.close();
});
