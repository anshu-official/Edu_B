const GenerateContentPDF = require("../utilities/GenerateContentPDF");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyA0Ku1y1pYAD61cBh1Hgdo2wzGFqw8Uryc");

exports.generateContent = async (req, res) => {
  try {
    const { Topic, Tone, Audience, Keywords, Purpose, OtherDetails } = req.body;

    // Generate questions using Gemini
    const resContent = await GeminiResponse(
      Topic,
      Tone,
      Audience,
      Keywords,
      Purpose,
      OtherDetails
    );

    // Generate PDF document
    const pdfFilePath = "content.pdf";
    await GenerateContentPDF(pdfFilePath, resContent, Topic);
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

async function GeminiResponse(
  Topic,
  Tone,
  Audience,
  Keywords,
  Purpose,
  OtherDetails
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Topic: ${Topic}\nTone or Style: ${Tone}\nAudience: ${Audience}\nKeywords: ${Keywords}\nPurpose: ${Purpose}\nOther Details: ${OtherDetails}\n Generate article on it.`;
    const generationConfig = {
      maxOutputTokens: 100,
      temperature: 0.7,
    };
    const result = await model.generateContent(prompt, generationConfig);
    let response = result.response;
    response = response.text();
    const clearResponse = response.replace(/\*/g, "");
    return clearResponse; // Await is not needed here as it's handled in the calling function
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Error generating questions");
  }
}
