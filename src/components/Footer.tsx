import type { Profile } from '../../content/lib/types';

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="pt-8 border-t border-ink/14 text-center">
      <p className="font-serif text-base italic text-ink/60 mb-4.5">{profile.tagline}</p>
      <nav aria-label="Contact links" className="flex gap-4 justify-center text-[13px] mb-2">
        <a href={`mailto:${profile.links.email}`}>Email</a>
        <span className="text-ink/30" aria-hidden="true">
          ·
        </span>
        <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <span className="text-ink/30" aria-hidden="true">
          ·
        </span>
        <a href={profile.links.rhinostats} target="_blank" rel="noopener noreferrer">
          RhinoStats
        </a>
      </nav>
      <div className="text-[11px] text-ink/40">{profile.location}</div>
    </footer>
  );
}
