export type ExtractedArticle = {
  title: string | null;
  content: string;
};

const MARKDOWN_MARKER = "Markdown Content:";

export async function extractArticle(url: string): Promise<ExtractedArticle> {
  let response: Response;
  try {
    response = await fetch(`https://r.jina.ai/${url}`, {
      headers: { Accept: "text/plain" },
    });
  } catch {
    throw new Error("Could not reach the extraction service. Please try again.");
  }

  if (!response.ok) {
    const body = await response.text();
    const message = parseErrorMessage(body);
    throw new Error(message ?? `Failed to extract content from that URL (status ${response.status}).`);
  }

  const raw = await response.text();
  return parseJinaOutput(raw);
}

const MAX_ERROR_MESSAGE_LENGTH = 300;

export function parseErrorMessage(body: string): string | null {
  try {
    const parsed = JSON.parse(body) as { message?: string };
    if (parsed.message) return parsed.message;
  } catch {
    // Jina returns plain text errors when Accept: text/plain is set.
  }

  const trimmed = body.trim();
  return trimmed && trimmed.length <= MAX_ERROR_MESSAGE_LENGTH ? trimmed : null;
}

export function parseJinaOutput(raw: string): ExtractedArticle {
  const titleMatch = raw.match(/^Title:\s*(.+)$/m);
  const markerIndex = raw.indexOf(MARKDOWN_MARKER);
  const content = markerIndex >= 0 ? raw.slice(markerIndex + MARKDOWN_MARKER.length).trim() : raw.trim();

  return {
    title: titleMatch ? titleMatch[1].trim() : null,
    content,
  };
}
