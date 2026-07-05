import { z } from "zod";

// Shared tone instructions so summary/question/draft prompts stay consistent
// without duplicating the same paragraph across builders. Edit here to
// retune voice across the whole app.
export const VOICE_GUIDELINES = `Write in a natural, first-person, conversational voice.
Avoid corporate buzzwords, hashtags, emojis, and generic LinkedIn cliches
("I'm thrilled to announce...", "Let that sink in.", "Agree?").
Sound like a specific person thinking out loud, not a content template.`;

export function summaryPrompt(articleContent: string): string {
  return `Summarize the following article in 2-3 neutral, factual sentences.
Do not add opinions or commentary — just what the article says.

Article:
"""
${articleContent}
"""`;
}

export const questionsSchema = z.object({
  questions: z.array(z.string()).length(3),
});

export function questionsPrompt(content: string): string {
  return `A person is reflecting on the following material before writing a LinkedIn post about it.
Generate exactly three thoughtful, specific questions that help them find their own angle and opinion.
Avoid generic questions ("What are your thoughts?"). Each question should point at something concrete in the material.

Material:
"""
${content}
"""`;
}
