import type { CaseStudy } from '../../content/lib/parseCaseStudy';

export function CaseStudyCard({
  caseStudy,
  index,
  onOpen,
}: {
  caseStudy: CaseStudy;
  index: number;
  onOpen: () => void;
}) {
  return (
    <div
      className="shrink-0 w-full px-2"
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of 5`}
    >
      <button
        type="button"
        onClick={onOpen}
        className="w-full text-left border border-ink/16 rounded-sm p-8 cursor-pointer bg-card transition-colors hover:border-accent/50 focus-visible:border-accent/50"
      >
        <div className="flex justify-between items-start mb-4.5">
          <span className="text-[11px] tracking-[0.08em] uppercase text-accent border border-accent/35 px-2.5 py-1 rounded-full">
            {caseStudy.tag}
          </span>
          <span className="font-mono text-xs text-ink/40">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <div className="font-serif text-2xl font-medium mb-2 tracking-[-0.005em]">
          {caseStudy.title}
        </div>
        <div className="text-[15px] text-ink/65 mb-5 italic">{caseStudy.roleContext}</div>
        <div className="text-sm text-ink/85 pt-4 border-t border-ink/10">{caseStudy.metric}</div>
      </button>
    </div>
  );
}
