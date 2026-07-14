import type { SkillGroup } from '../../content/lib/types';

export function SkillsSection({ skills }: { skills: SkillGroup[] }) {
  return (
    <section aria-labelledby="skills-heading" className="mb-18">
      <h2
        id="skills-heading"
        className="text-xs tracking-[0.12em] uppercase text-accent mb-6 font-normal"
      >
        04 — Skills
      </h2>
      <dl className="m-0">
        {skills.map((group) => (
          <div
            key={group.category}
            className="grid grid-cols-[160px_1fr] gap-4 py-3 border-b border-ink/8"
          >
            <dt className="text-[13px] tracking-[0.04em] text-ink/55">{group.category}</dt>
            <dd className="text-[14.5px] leading-[1.7] text-ink/88 m-0">
              {group.items.join('  ·  ')}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
