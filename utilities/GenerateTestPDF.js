const pdf = require("pdfkit");
const fs = require("fs");

function generateTestPDF(filePath, content) {
  const doc = new pdf();
  doc.pipe(fs.createWriteStream(filePath));
  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .text("Test Paper", { align: "center" })
    .moveDown();
  doc.font("Helvetica").fontSize(12).text(content);
  doc.end();
}
module.exports = generateTestPDF;
