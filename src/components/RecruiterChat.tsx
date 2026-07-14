import { useId, useRef, useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const MAX_INPUT_LENGTH = 500;

export function RecruiterChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'rate-limited'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const panelId = useId();
  const abortRef = useRef<AbortController | null>(null);

  const sendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const question = input.trim().slice(0, MAX_INPUT_LENGTH);
    if (!question || status === 'loading') return;

    const nextMessages: Message[] = [...messages, { role: 'user', content: question }];
    setMessages(nextMessages);
    setInput('');
    setStatus('loading');
    setErrorMessage('');

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
        signal: controller.signal,
      });

      if (res.status === 429) {
        setStatus('rate-limited');
        setErrorMessage(
          "You've sent a few questions in a row — please wait a minute before asking another.",
        );
        return;
      }
      if (!res.ok || !res.body) {
        setStatus('error');
        setErrorMessage('Something went wrong reaching the assistant. Please try again shortly.');
        return;
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: full };
          return updated;
        });
      }
      setStatus('idle');
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setStatus('error');
      setErrorMessage('Something went wrong reaching the assistant. Please try again shortly.');
    }
  };

  return (
    <section aria-labelledby="chat-heading" className="mb-18">
      <div className="flex items-baseline justify-between mb-6">
        <h2
          id="chat-heading"
          className="text-xs tracking-[0.12em] uppercase text-accent font-normal"
        >
          06 — Ask About My Work
        </h2>
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full flex items-center justify-between text-left border border-ink/16 rounded-sm px-6 py-4 bg-card cursor-pointer hover:border-accent/50"
      >
        <span className="font-serif text-lg">Ask a question about my experience</span>
        <span className="text-ink/50 text-sm" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div
          id={panelId}
          className="border border-t-0 border-ink/16 rounded-b-sm px-6 py-6 bg-card"
        >
          <p className="text-sm text-ink/60 mb-5">
            Answers are grounded in my CV and case studies above — ask about specific roles, skills,
            or projects.
          </p>

          {messages.length > 0 && (
            <ol className="list-none m-0 p-0 mb-5 flex flex-col gap-4" aria-live="polite">
              {messages.map((m, i) => (
                <li key={i}>
                  <div className="text-xs tracking-[0.06em] uppercase text-ink/45 mb-1">
                    {m.role === 'user' ? 'You' : 'Assistant'}
                  </div>
                  <p className="text-[15px] leading-[1.6] text-ink/90 m-0 whitespace-pre-wrap">
                    {m.content || (status === 'loading' && i === messages.length - 1 ? '…' : '')}
                  </p>
                </li>
              ))}
            </ol>
          )}

          {(status === 'error' || status === 'rate-limited') && (
            <p role="alert" className="text-sm text-ink/70 mb-4 italic">
              {errorMessage}
            </p>
          )}

          <form onSubmit={sendQuestion} className="flex gap-3">
            <label htmlFor={`${panelId}-input`} className="sr-only">
              Ask a question about Bidish's experience
            </label>
            <input
              id={`${panelId}-input`}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_LENGTH))}
              maxLength={MAX_INPUT_LENGTH}
              placeholder="e.g. What's his experience with design systems?"
              disabled={status === 'loading'}
              className="flex-1 border border-ink/20 rounded-sm px-4 py-2.5 text-sm bg-bg text-ink placeholder:text-ink/40 focus:outline-none focus-visible:border-accent"
            />
            <button
              type="submit"
              disabled={status === 'loading' || !input.trim()}
              className="text-[13px] tracking-[0.04em] px-4 py-2.5 border border-ink/20 rounded-sm bg-transparent cursor-pointer hover:border-accent/50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Asking…' : 'Ask'}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
