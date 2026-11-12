import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createAgent } from 'langchain';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { createTaskTools } from '../tools/taskTools.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const GEMINI_MODEL = 'gemini-3.5-flash-lite';

export const runTaskAgent = async (userId, message) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

  const model = new ChatGoogleGenerativeAI({
    model: GEMINI_MODEL,
    apiKey,
  });

  const tools = createTaskTools(userId);

  const agent = createAgent({
    model,
    tools,
    systemPrompt:
      'You are a helpful task management assistant. Use the provided tools to list, create, update, or delete tasks for the user. Never make up task IDs; always call list_tasks first when needed. If a tool returns an error, explain it clearly.',
  });

  const result = await agent.invoke({
    messages: [{ role: 'user', content: message }],
  });

  // Extract tool calls and their outputs from the execution trace
  const toolCalls = [];
  const callArgsById = {};

  for (const msg of result.messages) {
    const type = msg._getType ? msg._getType() : msg.type;
    if (type === 'ai' && Array.isArray(msg.tool_calls)) {
      for (const tc of msg.tool_calls) {
        callArgsById[tc.id] = { name: tc.name, args: tc.args };
      }
    }
    if (type === 'tool') {
      const callInfo = callArgsById[msg.tool_call_id] || { name: msg.name, args: {} };
      let parsedOutput = msg.content;
      try {
        parsedOutput = JSON.parse(msg.content);
      } catch {
        // keep string as is
      }
      const entry = {
        tool: callInfo.name || msg.name,
        args: callInfo.args,
        result: parsedOutput,
      };
      toolCalls.push(entry);
      console.log(`🔧 [Agent Tool Call] ${entry.tool}`, JSON.stringify(entry.args), '->', msg.content);
    }
  }

  // Extract final text reply from last AI message
  const lastMsg = result.messages[result.messages.length - 1];
  let reply = '';
  if (typeof lastMsg?.content === 'string') {
    reply = lastMsg.content;
  } else if (Array.isArray(lastMsg?.content)) {
    reply = lastMsg.content.map((c) => (typeof c === 'string' ? c : c.text || '')).join('');
  }

  return { reply: reply || 'Done.', toolCalls };
};

