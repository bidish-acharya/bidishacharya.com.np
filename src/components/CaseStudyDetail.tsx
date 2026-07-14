import { useEffect, useRef } from 'react';
import type { CaseStudy } from '../../content/lib/parseCaseStudy';

export function CaseStudyDetail({
  caseStudy,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  caseStudy: CaseStudy;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [caseStudy.id]);

  return (
    <div className="max-w-[680px] mx-auto px-8 py-16 pb-30 animate-fade-up">
      <button
        type="button"
        onClick={onClose}
        className="bg-transparent border-none text-[13px] tracking-[0.03em] text-ink/60 cursor-pointer p-0 mb-12 hover:text-accent"
      >
        &larr; Back to portfolio
      </button>

      <div className="text-xs tracking-[0.1em] uppercase text-accent mb-3.5">
        {caseStudy.tag} &nbsp;·&nbsp; {caseStudy.order.toString().padStart(2, '0')} /{' '}
        {String(total).padStart(2, '0')}
      </div>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="font-serif text-4xl font-medium tracking-[-0.01em] leading-[1.15] mb-2.5 outline-none"
      >
        {caseStudy.title}
      </h1>
      <div className="text-base italic text-ink/65 mb-10">{caseStudy.roleContext}</div>

      <div className="flex gap-10 py-6 mb-12 border-t border-b border-ink/14">
        <div>
          <div className="text-[11px] tracking-[0.06em] uppercase text-ink/50 mb-1">Outcome</div>
          <div className="text-[15px]">{caseStudy.metric}</div>
        </div>
      </div>

      <p className="text-[12.5px] italic text-ink/50 -mt-7 mb-10">
        Placeholder narrative — illustrative detail below pending final write-up.
      </p>

      <div className="mb-9">
        <h2 className="font-serif text-xl font-medium mb-2.5">Challenge</h2>
        <p className="text-base leading-[1.7] text-ink/88 m-0">{caseStudy.challenge}</p>
      </div>
      <div className="mb-9">
        <h2 className="font-serif text-xl font-medium mb-2.5">Approach</h2>
        <p className="text-base leading-[1.7] text-ink/88 m-0">{caseStudy.approach}</p>
      </div>
      <div className="mb-14">
        <h2 className="font-serif text-xl font-medium mb-2.5">Outcome</h2>
        <p className="text-base leading-[1.7] text-ink/88 m-0">{caseStudy.outcome}</p>
      </div>

      <div className="flex justify-between pt-8 border-t border-ink/14">
        <button
          type="button"
          onClick={onPrev}
          className="bg-transparent border-none text-[13px] text-ink/60 cursor-pointer hover:text-accent"
        >
          &larr; Previous case study
        </button>
        <button
          type="button"
          onClick={onNext}
          className="bg-transparent border-none text-[13px] text-ink/60 cursor-pointer hover:text-accent"
        >
          Next case study &rarr;
        </button>
      </div>
    </div>
  );
}
