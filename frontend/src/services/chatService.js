import axiosClient from '../api/axiosClient';

/**
 * Chat Service
 * Handles communication with backend /api/chat endpoint
 */

// Send a single message to AI chat endpoint
export const sendChatMessage = async (message) => {
  const res = await axiosClient.post('/chat', { message });
  return res.data; // returns { reply: "..." }
};

