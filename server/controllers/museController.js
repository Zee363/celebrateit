const geminiService = require("../services/gemini");

exports.generateReply = async (req, res) => {
  try {
    const { message, bride, vendors, history } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Missing required field: message",
      });
    }

    const payload = {
      message,
      bride,
      vendors,
      history,
    };

const result = await geminiService.chatWithMuse(payload);

    return res.json(result);

} catch (err) {
  console.error("========== MUSE ERROR ==========");
  console.error("Message:", err.message);
  console.error("Status:", err.status);
  console.error("Stack:", err.stack);
  console.error("Full Error:", err);

  return res.status(500).json({
    error: err.message,
    status: err.status,
  });
}
};