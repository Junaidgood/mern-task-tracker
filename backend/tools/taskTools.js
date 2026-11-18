import { tool } from 'langchain';
import { z } from 'zod';
import { listTasks, createTask, updateTask, deleteTask } from '../services/taskService.js';

/**
 * Wraps existing task CRUD functions as LangChain tools for a specific logged-in user.
 * Returns structured JSON (including { success: false, error }) instead of throwing raw exceptions.
 */
export const createTaskTools = (userId, { allowDelete = false } = {}) => {
  // 1. List Tasks Tool
  const listTasksTool = tool(
    async ({ page, limit }) => {
      try {
        const result = await listTasks(userId, { page: page || 1, limit: limit || 50 });
        return JSON.stringify({
          success: true,
          totalTasks: result.totalTasks,
          tasks: result.tasks.map((t) => ({
            id: t._id.toString(),
            title: t.title,
            completed: t.completed,
            createdAt: t.createdAt,
          })),
        });
      } catch (err) {
        return JSON.stringify({ success: false, error: err.message });
      }
    },
    {
      name: 'list_tasks',
      description:
        'Fetch the logged-in user tasks from the database. Always call this first when you need to view tasks, find task IDs, check which tasks are pending/completed, or before updating/deleting tasks by name.',
      schema: z.object({
        page: z.number().optional().describe('Page number (default 1)'),
        limit: z.number().optional().describe('Max tasks to fetch (default 50)'),
      }),
    }
  );

  // 2. Create Task Tool
  const createTaskTool = tool(
    async ({ title }) => {
      try {
        const task = await createTask(userId, title);
        return JSON.stringify({
          success: true,
          task: { id: task._id.toString(), title: task.title, completed: task.completed },
        });
      } catch (err) {
        return JSON.stringify({ success: false, error: err.message });
      }
    },
    {
      name: 'create_task',
      description: 'Create a new task for the logged-in user with the given title.',
      schema: z.object({
        title: z.string().describe('The title/name of the task to create'),
      }),
    }
  );

  // 3. Update Task Tool
  const updateTaskTool = tool(
    async ({ taskId, title, completed }) => {
      try {
        const task = await updateTask(userId, taskId, { title, completed });
        return JSON.stringify({
          success: true,
          task: { id: task._id.toString(), title: task.title, completed: task.completed },
        });
      } catch (err) {
        return JSON.stringify({ success: false, error: err.message });
      }
    },
    {
      name: 'update_task',
      description:
        'Update an existing task title or mark it completed/pending using its exact taskId. Call list_tasks first if you do not have the taskId.',
      schema: z.object({
        taskId: z.string().describe('The MongoDB ID of the task to update'),
        title: z.string().optional().describe('New title for the task'),
        completed: z.boolean().optional().describe('Set true to mark done, false to mark pending'),
      }),
    }
  );

  // 4. Delete Task Tool (Protected by confirmation guardrail)
  const deleteTaskTool = tool(
    async ({ taskId, confirmed }) => {
      try {
        if (!allowDelete || confirmed !== true) {
          return JSON.stringify({
            success: false,
            requiresConfirmation: true,
            error:
              'Confirmation guardrail: Deletion is blocked until you ask the user "Are you sure you want to delete <task title(s)>?" and they explicitly confirm in a follow-up message.',
          });
        }
        const res = await deleteTask(userId, taskId);
        return JSON.stringify({ success: true, deletedId: res.deletedId, title: res.title });
      } catch (err) {
        return JSON.stringify({ success: false, error: err.message });
      }
    },
    {
      name: 'delete_task',
      description:
        'Permanently delete a task using its exact taskId. Call list_tasks first if you do not have the taskId. IMPORTANT: Never call this tool until you have asked the user "Are you sure you want to delete ...?" and received their explicit confirmation.',
      schema: z.object({
        taskId: z.string().describe('The MongoDB ID of the task to delete'),
        confirmed: z
          .boolean()
          .optional()
          .describe('Set to true ONLY after the user explicitly confirmed deletion in a follow-up message'),
      }),
    }
  );

  return [listTasksTool, createTaskTool, updateTaskTool, deleteTaskTool];
};

