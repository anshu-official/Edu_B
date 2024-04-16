const generateTestPDF = require("../utilities/GenerateTestPDF");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyA0Ku1y1pYAD61cBh1Hgdo2wzGFqw8Uryc");
exports.generateTest = async (req, res) => {
  try {
    const { subject, topic, numberOfQuestions, optionalDetails } = req.body;

    // Validate input
    if (subject && topic && numberOfQuestions && optionalDetails) {
      return res.json({
        success: false,
        message: "Fill the missing fields",
      });
    }

    // Generate questions using Gemini
    const questions = await generateQuestions(
      subject,
      topic,
      numberOfQuestions,
      optionalDetails
    );

    // Generate test content
    const testContent = generateTestContent(
      subject,
      topic,
      numberOfQuestions,
      optionalDetails,
      questions
    );

    // Generate PDF document
    const pdfFilePath = "test.pdf";
    generateTestPDF(pdfFilePath, testContent);

    res.json({
      success: true,
      message: "Test generated successfully",
      pdfFilePath: pdfFilePath, // Send the path to the generated PDF to the client
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      success: false,
      error: "An error occurred while generating the test.",
    });
  }
};
async function generateQuestions(
  subject,
  topic,
  numberOfQuestions,
  optionalDetails
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Generate ${numberOfQuestions} questions related to the subject "${subject}", under the topic "${topic}" with optionals details like ${optionalDetails}.`;
    const generationConfig = {
      maxOutputTokens: 100,
      temperature: 0.7,
    };
    const result = await model.generateContent(prompt, generationConfig);
    const response = result.response;
    const text = response.text();
    return text.split("\n").filter((question) => question.trim() !== "");
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Error generating questions");
  }
}
function generateTestContent(
  subject,
  topic,
  numberOfQuestions,
  optionalDetails,
  questions
) {
  let testContent = `Test Paper\n\n`;
  testContent += `Subject: ${subject}\n`;
  testContent += `Topic: ${topic}\n`;
  testContent += `Number of Questions: ${numberOfQuestions}\n`;
  testContent += `Optional Details: ${optionalDetails}\n\n`;
  testContent += `Questions:\n\n`;

  questions.forEach((question, index) => {
    testContent += `${question}\n\n`;
  });

  return testContent;
}
