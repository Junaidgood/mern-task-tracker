import axiosClient from '../api/axiosClient';

/**
 * Chat Service
 * Handles communication with backend /api/chat endpoint
 */

// Send a message (with optional in-session history) to AI chat endpoint
export const sendChatMessage = async (message, history = []) => {
  const res = await axiosClient.post('/chat', { message, history });
  return res.data; // returns { reply, toolCalls }
};

