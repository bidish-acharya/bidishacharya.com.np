import type { Profile } from '../../content/lib/types';

export function Header({ profile }: { profile: Profile }) {
  return (
    <header className="flex items-start justify-between gap-8 mb-16 pb-10 border-b border-ink/[0.14]">
      <div>
        <h1 className="font-serif text-[42px] font-medium tracking-[-0.01em] leading-[1.1] mb-1.5">
          {profile.name}
        </h1>
        <p className="text-[17px] text-ink/75 mb-3.5">{profile.title}</p>
        <p className="text-[13px] tracking-[0.04em] uppercase text-ink/55 mb-2.5">
          {profile.location}
        </p>
        <nav aria-label="Contact links" className="flex gap-4 text-sm">
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <span className="text-ink/30" aria-hidden="true">
            ·
          </span>
          <a href={profile.links.rhinostats} target="_blank" rel="noopener noreferrer">
            RhinoStats
          </a>
          <span className="text-ink/30" aria-hidden="true">
            ·
          </span>
          <a href={`mailto:${profile.links.email}`}>Email</a>
        </nav>
      </div>
      <div
        aria-hidden="true"
        className="shrink-0 w-19 h-19 rounded-full border border-ink/20 flex items-center justify-center"
        style={{
          width: 76,
          height: 76,
          backgroundImage:
            'repeating-linear-gradient(45deg, oklch(0.22 0.012 75 / 0.06) 0px, oklch(0.22 0.012 75 / 0.06) 2px, transparent 2px, transparent 10px)',
        }}
      >
        <span className="font-mono text-[9px] tracking-[0.03em] text-ink/45 text-center">
          photo
        </span>
      </div>
    </header>
  );
}
