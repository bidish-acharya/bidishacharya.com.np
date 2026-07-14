import type { Job } from '../../content/lib/types';

export function ExperienceList({ experience }: { experience: Job[] }) {
  return (
    <section aria-labelledby="experience-heading" className="mb-18">
      <h2
        id="experience-heading"
        className="text-xs tracking-[0.12em] uppercase text-accent mb-6 font-normal"
      >
        03 — Professional Experience
      </h2>
      <ol className="list-none m-0 p-0">
        {experience.map((job) => (
          <li key={`${job.company}-${job.dates}`} className="py-5 border-b border-ink/10">
            <div className="flex justify-between items-baseline gap-4 mb-1">
              <div className="text-[17px] font-semibold">{job.role}</div>
              <div className="font-mono text-xs text-ink/50 whitespace-nowrap">{job.dates}</div>
            </div>
            <div className="text-sm italic text-ink/65 mb-2.5">{job.company}</div>
            {job.bullets.map((bullet) => (
              <p
                key={bullet}
                className="text-[14.5px] leading-[1.6] text-ink/85 m-0 mb-1.5 last:mb-0"
              >
                {bullet}
              </p>
            ))}
          </li>
        ))}
      </ol>
    </section>
  );
}
