const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-2.5-flash-lite";

/**
 * Creates a prompt with contextual information.
 */
function buildMusePrompt(payload) {
  const {
    message,
    bride = {},
    vendors = [],
    history = [],
  } = payload;

  return `
You are Muse, the AI wedding planning assistant for CelebrateIT.

Your personality:
- Friendly
- Professional
- Helpful
- Warm
- Knowledgeable about weddings in South Africa.

Bride Profile:
${JSON.stringify(bride, null, 2)}

Available Vendors:
${JSON.stringify(vendors, null, 2)}

Conversation History:
${JSON.stringify(history, null, 2)}

Bride's Message:
${message}

Instructions:

- Reply naturally.
- Be concise.
- If recommending vendors, only recommend from the provided vendor list.
- Never invent vendor information.
- If you don't know something, say so.
`;
}

async function chatWithMuse(payload) {
  const prompt = buildMusePrompt(payload);

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  return {
    text: response.text,
    meta: {
      provider: "gemini",
      model: MODEL,
    },
  };
}

/*
    Placeholder functions
    (We'll implement these later)
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