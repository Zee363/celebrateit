const { GoogleGenAI } = require("@google/genai");

const buildMusePrompt = require("../prompts/muse");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-3.6-flash";

async function chatWithMuse(payload) {
  try {
    const prompt = buildMusePrompt(payload);

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    return {
      text: response.text,
      meta: {
        provider: "Google Gemini",
        model: MODEL,
      },
    };
  } catch (err) {
    console.error("Gemini Error:", err);
    throw err;
  }
}

/*
Placeholder AI features
*/

async function draftVendorReply() {
  throw new Error("Not implemented");
}

async function recommendVendors() {
  throw new Error("Not implemented");
}

async function generateWeddingChecklist() {
  throw new Error("Not implemented");
}

async function planWeddingTimeline() {
  throw new Error("Not implemented");
}

module.exports = {
  chatWithMuse,
  draftVendorReply,
  recommendVendors,
  generateWeddingChecklist,
  planWeddingTimeline,
};