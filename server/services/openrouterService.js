// server/services/openrouterService.js
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Read documentation content from a file (cache it on startup)
const docFilePath = path.join(__dirname, "../data/crustdata_api_documentation.txt");
const documentationText = fs.readFileSync(docFilePath, "utf8");

/**
 * Generates an answer using OpenRouter's API with the model google/gemini-2.0-flash-exp:free.
 * The prompt includes the local documentation text.
 */
async function getAnswer(question, history = []) {
  const systemMessage = `
You are a senior technical support engineer specializing in the Crustdata API. Your task is to provide accurate, context-specific guidance using ONLY the provided official documentation. Follow these strict protocols:

1. **Source Authority**
- Respond EXCLUSIVELY using the documentation provided below
- If information is missing, state: "According to the current Crustdata documentation, ... [specify gap]" 
- Never assume features, endpoints, or parameters beyond what's explicitly documented

2. **Response Structure**
- Begin with direct yes/no confirmation when appropriate
- Follow with numbered steps/examples if actionable
- Format code samples in markdown with precise syntax
- Reference exact documentation sections verbatim (e.g., "Authentication: v2.1")

3. **Query Handling**
- For ambiguous requests, ask clarifying questions using:
  "To best assist, could you specify: 
  a) Your integration environment
  b) The API version you're using
  c) Relevant error codes?"
- Prioritize authentication, error resolution, and rate limit guidance

4. **Tone & Safety**
- Maintain professional yet approachable tone
- Warn about security implications for credentials/keys
- Add caution notes for destructive endpoints (DELETE/PATCH)
- Convert technical jargon to plain language when possible


**Provided Documentation:**
${documentationText}
  `;

  const requestData = {
    model: "google/gemini-2.0-flash-exp:free",
    messages: [
      { role: "system", content: systemMessage },
      ...history, // Include previous messages
      { role: "user", content: question }
    ],
  };

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error fetching answer from OpenRouter:", error);
    throw error;
  }
}

module.exports = { getAnswer };
