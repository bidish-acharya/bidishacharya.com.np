import type { EducationEntry } from '../../content/lib/types';

export function Education({ education }: { education: EducationEntry[] }) {
  return (
    <section aria-labelledby="education-heading" className="mb-22">
      <h2
        id="education-heading"
        className="text-xs tracking-[0.12em] uppercase text-accent mb-6 font-normal"
      >
        05 — Education
      </h2>
      <ol className="list-none m-0 p-0">
        {education.map((ed) => (
          <li key={ed.degree} className="py-4.5 border-b border-ink/10">
            <div className="flex justify-between items-baseline gap-4 mb-1">
              <div className="text-base font-semibold">{ed.degree}</div>
              <div className="font-mono text-xs text-ink/50 whitespace-nowrap">{ed.dates}</div>
            </div>
            <div className="text-sm italic text-ink/65 mb-1.5">{ed.school}</div>
            {ed.extra && <p className="text-sm leading-[1.6] text-ink/80 m-0">{ed.extra}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}
