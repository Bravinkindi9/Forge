import { generateObject, generateText as sdkGenerateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { z } from "zod";

// The only file in Forge that knows which AI provider is in use.
// Every other module calls generateText/generateStructured and stays
// provider-agnostic — swapping providers means changing this file only.

let model: ReturnType<ReturnType<typeof createGoogleGenerativeAI>> | null = null;

function getModel() {
  if (model) return model;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set. Copy .env.example to .env.local and fill it in.");
  }

  const google = createGoogleGenerativeAI({ apiKey });
  model = google("gemini-2.5-flash-lite");
  return model;
}

export async function generateText(prompt: string): Promise<string> {
  const { text } = await sdkGenerateText({ model: getModel(), prompt });
  return text;
}

export async function generateStructured<T>(prompt: string, schema: z.ZodType<T>): Promise<T> {
  const { object } = await generateObject({ model: getModel(), schema, prompt });
  return object;
}
