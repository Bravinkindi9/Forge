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

export function draftPrompt(params: {
  summary: string | null;
  questions: string[];
  answers: string[];
  additionalThoughts: string | null;
}): string {
  const { summary, questions, answers, additionalThoughts } = params;

  const reflection = questions
    .map((question, i) => `Q: ${question}\nA: ${answers[i]}`)
    .join("\n\n");

  const context = [
    summary ? `Summary of the source material:\n${summary}` : null,
    `The person's reflection:\n${reflection}`,
    additionalThoughts ? `Additional thoughts they wanted to add:\n${additionalThoughts}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  return `${VOICE_GUIDELINES}

Using only the reflection below, write ONE LinkedIn post draft in the person's voice.
Do not invent facts or opinions that aren't grounded in their answers.
This is a starting draft they will edit themselves, not a final polished post.
Return only the post text — no title, no preamble, no explanation.

${context}`;
}
