const geminiService = require('../services/gemini');

exports.generateReply = async (req, res) => {
  try {
    const { message, bride, vendors, history } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing required field: message' });
    }

    const payload = { message, bride, vendors, history };
const result = await geminiService.chatWithMuse(payload);

    // Expect service to return { text, meta }
    return res.json(result);
  } catch (err) {
    console.error('Error generating muse reply:', err);
    return res.status(500).json({ error: 'Failed to generate reply' });
  }
};
