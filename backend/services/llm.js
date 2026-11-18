// backend/services/llm.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const GEMINI_MODEL = 'gemini-3.5-flash-lite';

/**
 * Single-turn chat call to Gemini API
 * Strictly takes a single prompt string, returns reply string.
 * No memory, no streaming, no task access.
 */
export const generateReply = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
  }

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error('Message prompt cannot be blank');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt.trim() }],
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.error?.message || 'Failed to generate response from AI';
    throw new Error(errorMsg);
  }

  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!reply) {
    throw new Error('No reply received from AI');
  }

  return reply;
};
