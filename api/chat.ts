import { buildSystemPrompt } from './_lib/systemPrompt';
import { isRateLimited } from './_lib/rateLimit';

export const config = { runtime: 'edge' };

const GROQ_MODEL = 'llama-3.3-70b-versatile';
const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_MESSAGES = 12;
// Strips ASCII control characters (except newline/tab, which are harmless in a question).
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = new RegExp('[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]', 'g');

interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return jsonError('Method not allowed', 405);
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    return jsonError('Too many requests. Please wait a minute before trying again.', 429);
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('GROQ_API_KEY is not configured');
    return jsonError('Chat is temporarily unavailable.', 500);
  }

  let body: { messages?: IncomingMessage[] };
  try {
    body = await req.json();
  } catch {
    return jsonError('Invalid request body.', 400);
  }

  const rawMessages = Array.isArray(body.messages) ? body.messages : [];
  if (rawMessages.length === 0) {
    return jsonError('No message provided.', 400);
  }

  const sanitized = rawMessages
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({
      role: m.role,
      content: m.content.replace(CONTROL_CHARS, '').slice(0, MAX_MESSAGE_LENGTH),
    }))
    .slice(-MAX_HISTORY_MESSAGES);

  const lastMessage = sanitized[sanitized.length - 1];
  if (!lastMessage || lastMessage.role !== 'user' || !lastMessage.content.trim()) {
    return jsonError('No question provided.', 400);
  }

  const groqMessages = [{ role: 'system', content: buildSystemPrompt() }, ...sanitized];

  let groqResponse: Response;
  try {
    groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: groqMessages,
        stream: true,
        temperature: 0.3,
        max_tokens: 500,
      }),
    });
  } catch (err) {
    console.error('Groq request failed', err);
    return jsonError('The assistant is temporarily unavailable. Please try again shortly.', 502);
  }

  if (!groqResponse.ok || !groqResponse.body) {
    console.error('Groq responded with an error status', groqResponse.status);
    return jsonError('The assistant is temporarily unavailable. Please try again shortly.', 502);
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = groqResponse.body!.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buffer = '';

      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const data = trimmed.slice(5).trim();
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (typeof delta === 'string' && delta.length > 0) {
                controller.enqueue(encoder.encode(delta));
              }
            } catch {
              // Ignore malformed SSE chunks rather than failing the whole stream.
            }
          }
        }
        controller.close();
      } catch (err) {
        console.error('Error while streaming Groq response', err);
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
