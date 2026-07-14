export function Summary({ summary }: { summary: string }) {
  return (
    <section aria-labelledby="profile-heading" className="mb-18">
      <h2
        id="profile-heading"
        className="text-xs tracking-[0.12em] uppercase text-accent mb-4 font-normal"
      >
        01 — Profile
      </h2>
      <p className="font-serif text-[22px] leading-[1.55] text-ink/92 m-0">{summary}</p>
    </section>
  );
}
