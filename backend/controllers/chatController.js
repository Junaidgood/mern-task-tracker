import { runTaskAgent } from '../services/agent.js';

// @desc    Send a message to AI Agent and receive reply + tool call logs
// @route   POST /api/chat
// @access  Private (Protected)
export const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const { reply, toolCalls } = await runTaskAgent(req.session.userId, message.trim());

    res.status(200).json({ reply, toolCalls });
  } catch (error) {
    next(error);
  }
};
