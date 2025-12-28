import { GoogleGenerativeAI } from "@google/generative-ai";

// create Gemini client
const genAI = new GoogleGenerativeAI("");

// choose model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Summarize a single article using Gemini
 */
const summarizeArticle = async ({ title, content }) => {
  try {
    const prompt = `
You are a news summarizer.

Article Title:
${title}

Article Content:
${content?.slice(0, 4000)}

TASK:
- Write a concise summary in 40–60 words
- Provide exactly 3 bullet points

FORMAT:
Summary:
<text>

Bullets:
- point 1
- point 2
- point 3
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Parse the response
    const summaryMatch = text.match(/Summary:\s*(.+?)(?=\n\n|\nBullets:|$)/s);
    const bulletsMatch = text.match(/Bullets:\s*((?:- .+\n?)*)/s);
    
    const summary = summaryMatch ? summaryMatch[1].trim() : `This article discusses ${title} and highlights key developments.`;
    const bulletsText = bulletsMatch ? bulletsMatch[1] : "";
    const bullets = bulletsText.split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(2).trim())
      .filter(bullet => bullet.length > 0);

    return {
      summary,
      bullets: bullets.length >= 3 ? bullets.slice(0, 3) : [
        "Covers a recent technology-related update",
        "Explains why the news is important", 
        "Mentions possible future impact"
      ],
      model: "gemini-1.5-flash"
    };
  } catch (error) {
    console.error("Gemini summarization failed:", error.message);
    // Fallback to mock response
    return {
      summary: `This article discusses ${title} and highlights key developments in the technology space.`,
      bullets: [
        "Covers a recent technology-related update",
        "Explains why the news is important",
        "Mentions possible future impact"
      ],
      model: "fallback-mock"
    };
  }
};

export default summarizeArticle;

