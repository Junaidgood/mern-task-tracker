import { generateReply } from '../services/llm.js';

// @desc    Send a message to AI and receive a reply
// @route   POST /api/chat
// @access  Private (Protected)
export const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    // 1. Validation: check if message exists and is not blank
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // 2. Call LLM service with the single message
    const reply = await generateReply(message.trim());

    // 3. Return the reply
    res.status(200).json({ reply });
  } catch (error) {
    next(error);
  }
};

