import { NextFunction, Request, Response } from "express";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText, stepCountIs, tool, type ModelMessage } from "ai";
import { z } from "zod";
import { MENU_CATALOG } from "../data/menu-catalog";
import { env } from "../config/env";
import { ApiError } from "../middlewares/error";
import { agentChatSchema, createOrderSchema } from "../validation/order.schemas";
import { buildOrderLines, createOrderRecord, toOrderResponse } from "../services/order.service"
import { formatCentsUsd } from "../data/menu-catalog";

const aiProvider = env.openaiApiKey ? createOpenAI({ apiKey: env.openaiApiKey }) : null;

const systemPrompt = `You are a concise, friendly ordering assistant for "homefood", a family kitchen with pickup and local delivery.
- Help guests choose dishes, explain portions briefly, and gather pickup vs delivery preference.
- Always use tools: call get_menu when the user asks what is available or you need dish IDs. Use preview_order to show totals before committing.
- Only call submit_order after the user explicitly confirms the full cart AND contact details (name, email, phone). If anything is missing, ask.
- Dish IDs look like d1, d2, … d10. Never invent dish IDs.
- Keep replies short (2–5 sentences) unless listing items.`;

const buildTools = (req: Request) => {
  const getMenu = tool({
    description: "Return the full menu with dish id, name, price, and description.",
    inputSchema: z.object({}),
    execute: async () => ({
      dishes: MENU_CATALOG.map((d) => ({
        id: d.id,
        name: d.name,
        price: d.price,
        description: d.description
      }))
    })
  });

  const previewOrder = tool({
    description: "Compute subtotal and line items for a draft cart (no database write).",
    inputSchema: z.object({
      items: z
        .array(z.object({ dishId: z.string(), quantity: z.number().int().min(1).max(99) }))
        .min(1)
    }),
    execute: async ({ items }) => {
      const { lines, subtotalCents } = buildOrderLines(items);
      return {
        subtotal: formatCentsUsd(subtotalCents),
        subtotalCents,
        lines: lines.map((l) => ({
          dishId: l.dishId,
          name: l.name,
          quantity: l.quantity,
          lineTotal: formatCentsUsd(l.lineTotalCents)
        }))
      };
    }
  });

  const submitOrder = tool({
    description:
      "Persist the order after customer confirmation. Requires name, email, phone, pickup|delivery, optional notes, and items with valid dishId and quantity.",
    inputSchema: createOrderSchema,
    execute: async (input) => {
      const doc = await createOrderRecord(input, {
        userId: req.user?.userId,
        source: "agent"
      });
      return { order: toOrderResponse(doc) };
    }
  });

  return { get_menu: getMenu, preview_order: previewOrder, submit_order: submitOrder };
};

const extractSubmittedOrder = (result: {
  steps: Array<{ staticToolResults: Array<{ toolName: string; output: unknown }> }>;
}) => {
  let last: ReturnType<typeof toOrderResponse> | null = null;
  for (const step of result.steps) {
    for (const tr of step.staticToolResults) {
      if (tr.toolName === "submit_order" && tr.output && typeof tr.output === "object" && "order" in tr.output) {
        const o = (tr.output as { order: ReturnType<typeof toOrderResponse> }).order;
        if (o?.id) last = o;
      }
    }
  }
  return last;
};

export const postAgentChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!aiProvider) {
    next(
      new ApiError(
        503,
        "AI assistant is not configured. Set OPENAI_API_KEY on the server.",
        "AI_DISABLED"
      )
    );
    return void 0;
  }

  const parsed = agentChatSchema.safeParse(req.body);
  if (!parsed.success) {
    next(new ApiError(400, "Invalid chat payload", "VALIDATION_ERROR", parsed.error.flatten()));
    return void 0;
  }

  const messages: ModelMessage[] = parsed.data.messages.map((m) => ({
    role: m.role,
    content: m.content
  }));

  const tools = buildTools(req);

  try {
    const result = await generateText({
      model: aiProvider(env.aiModel),
      system: systemPrompt,
      messages,
      tools,
      stopWhen: stepCountIs(12),
      temperature: 0.4,
      maxOutputTokens: 900
    });

    const order = extractSubmittedOrder(result);

    res.json({
      success: true,
      data: {
        reply: result.text,
        order,
        usage: result.totalUsage
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI request failed";
    next(new ApiError(502, message, "AI_UPSTREAM", error));
  }
};
