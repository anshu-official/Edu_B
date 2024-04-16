const pdf = require("pdfkit");
const fs = require("fs");

async function GenerateContentPDF(filePath, content, topic) {
  return new Promise((resolve, reject) => {
    const doc = new pdf();
    doc.pipe(fs.createWriteStream(filePath));

    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .text(`${topic}`, { align: "center" })
      .moveDown();
    doc.font("Helvetica").fontSize(12).text(content);

    doc.end();
    doc.on("end", () => {
      resolve();
    });
    doc.on("error", (err) => {
      reject(err);
    });
  });
}

module.exports = GenerateContentPDF;
