import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const InputSchema = z.object({
  lessonTitle: z.string().min(1).max(200),
  section: z.string().max(200).optional(),
  messages: z.array(MessageSchema).min(1).max(20),
});

export const askTutor = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      return { reply: "The AI tutor is not configured right now. Please try again later." };
    }

    const system = `You are a friendly financial education tutor for NafaIQ, a Pakistan Stock Exchange app. The user is currently reading a lesson about "${data.lessonTitle}"${
      data.section ? ` (currently in the "${data.section}" section)` : ""
    }. Keep answers concise (under 150 words), use simple language, and give Pakistan-specific examples where possible (use stocks like HBL, ENGRO, KSE-100). If asked about a topic unrelated to finance, politely redirect.`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
          "Lovable-API-Key": key,
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "system", content: system }, ...data.messages],
        }),
      });

      if (res.status === 429) {
        return {
          reply: "I'm getting a lot of questions right now — please wait a moment and try again.",
        };
      }
      if (res.status === 402) {
        return { reply: "The AI tutor has run out of credits for now. Please try again later." };
      }
      if (!res.ok) {
        return { reply: "Sorry, I couldn't reach the AI tutor just now. Please try again." };
      }

      const json = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const reply = json.choices?.[0]?.message?.content?.trim();
      return { reply: reply || "I'm not sure how to answer that — could you rephrase?" };
    } catch {
      return { reply: "Sorry, something went wrong reaching the AI tutor. Please try again." };
    }
  });
