const { Router } = require("express");
const { generateTest } = require("../Controllers/GenerateTest");
const { generateContent } = require("../Controllers/GenerateContent");
const { signup } = require("../Controllers/SignUp");
const { SendToOne, sendToOne } = require("../Controllers/SendToOne");
const router = Router();

router.get("/", (req, res) => {
  res.send("<h1>Backend of Edu Craft running at 5000</h1>");
});

//login, signup
router.post("/signup", signup);

//Generate
router.post("/generate-test", generateTest);
router.post("/generate-content", generateContent);

//Download PDFS
router.get("/downloadTest-pdf", async (req, res) => {
  res.download("test.pdf");
});
router.get("/downloadContent-pdf", async (req, res) => {
  res.download("content.pdf");
});

// router.post("/sendPDFmail", sendPDFmail);
router.post("/sendMail", sendToOne);

module.exports = router;
