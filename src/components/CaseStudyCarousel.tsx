import { useRef, useState } from 'react';
import type { CaseStudy } from '../../content/lib/parseCaseStudy';
import { CaseStudyCard } from './CaseStudyCard';

export function CaseStudyCarousel({
  caseStudies,
  onOpen,
}: {
  caseStudies: CaseStudy[];
  onOpen: (index: number) => void;
}) {
  const [slide, setSlide] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragCurrentX, setDragCurrentX] = useState<number | null>(null);
  const dragging = dragStartX !== null;
  const trackRef = useRef<HTMLDivElement>(null);

  const n = caseStudies.length;
  const goTo = (i: number) => setSlide(((i % n) + n) % n);

  const dragOffset = dragging && dragCurrentX !== null ? dragCurrentX - dragStartX! : 0;
  const trackTransform = `translateX(calc(${-slide * 100}% + ${dragOffset}px))`;

  const onPointerDown = (e: React.PointerEvent) => {
    setDragStartX(e.clientX);
    setDragCurrentX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStartX === null) return;
    setDragCurrentX(e.clientX);
  };
  const endDrag = () => {
    if (dragStartX === null) return;
    const delta = (dragCurrentX ?? dragStartX) - dragStartX;
    if (delta > 60) goTo(slide - 1);
    else if (delta < -60) goTo(slide + 1);
    setDragStartX(null);
    setDragCurrentX(null);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(slide - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(slide + 1);
    }
  };

  return (
    <section aria-labelledby="case-studies-heading" className="mb-18">
      <div className="flex items-baseline justify-between mb-6">
        <h2
          id="case-studies-heading"
          className="text-xs tracking-[0.12em] uppercase text-accent font-normal"
        >
          02 — Case Studies
        </h2>
        <div className="font-mono text-xs text-ink/50" aria-live="polite">
          {String(slide + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
        </div>
      </div>

      {/* eslint-disable jsx-a11y/no-noninteractive-tabindex, jsx-a11y/no-noninteractive-element-interactions --
          Custom carousel widget: this container is the ARIA carousel region and needs
          keyboard focus + arrow-key navigation, per the ARIA Authoring Practices carousel pattern. */}
      <div
        className="overflow-hidden -mx-2 touch-pan-y"
        role="region"
        aria-roledescription="carousel"
        aria-label="Case studies"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        {/* eslint-enable jsx-a11y/no-noninteractive-tabindex, jsx-a11y/no-noninteractive-element-interactions */}
        <div
          ref={trackRef}
          className="flex"
          style={{
            transform: trackTransform,
            transition: dragging ? 'none' : 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {caseStudies.map((cs, i) => (
            <CaseStudyCard key={cs.id} caseStudy={cs} index={i} onOpen={() => onOpen(i)} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-5">
        <div className="flex gap-1.5" role="tablist" aria-label="Choose slide">
          {caseStudies.map((cs, i) => (
            <button
              key={cs.id}
              type="button"
              role="tab"
              aria-selected={i === slide}
              aria-label={`Go to slide ${i + 1}: ${cs.title}`}
              onClick={() => goTo(i)}
              className="h-0.5 transition-all duration-250 ease-out"
              style={{
                width: i === slide ? 22 : 10,
                background: i === slide ? 'var(--color-accent)' : 'oklch(0.22 0.012 75 / 0.25)',
              }}
            />
          ))}
        </div>
        <div className="flex gap-5">
          <button
            type="button"
            onClick={() => goTo(slide - 1)}
            className="bg-transparent border-none text-[13px] tracking-[0.04em] text-ink/60 cursor-pointer p-0 hover:text-accent"
          >
            &larr; Prev
          </button>
          <button
            type="button"
            onClick={() => goTo(slide + 1)}
            className="bg-transparent border-none text-[13px] tracking-[0.04em] text-ink/60 cursor-pointer p-0 hover:text-accent"
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </section>
  );
}
