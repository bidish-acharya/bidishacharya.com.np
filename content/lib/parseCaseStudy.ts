export interface CaseStudy {
  id: string;
  order: number;
  tag: string;
  title: string;
  roleContext: string;
  metric: string;
  challenge: string;
  approach: string;
  outcome: string;
}

const SECTION_KEYS = ['challenge', 'approach', 'outcome'] as const;

/**
 * Minimal frontmatter + section parser for case study markdown files.
 * Frontmatter is flat `key: value` pairs between `---` fences; the body
 * is split into sections by `## Heading` markers (Challenge/Approach/Outcome).
 * Deliberately hand-rolled (no gray-matter/remark) since the schema is this small.
 */
export function parseCaseStudy(raw: string): CaseStudy {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error('Case study file is missing frontmatter fences (---)');
  }
  const [, frontmatterBlock, body] = match;

  const frontmatter: Record<string, string> = {};
  for (const line of frontmatterBlock.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    frontmatter[key] = value;
  }

  const sections: Record<string, string> = {};
  const sectionMatches = body.split(/^##\s+(.+)$/m);
  for (let i = 1; i < sectionMatches.length; i += 2) {
    const heading = sectionMatches[i].trim().toLowerCase();
    const content = sectionMatches[i + 1]?.trim() ?? '';
    sections[heading] = content;
  }

  for (const key of SECTION_KEYS) {
    if (!sections[key]) {
      throw new Error(`Case study "${frontmatter.id}" is missing a "## ${key}" section`);
    }
  }

  return {
    id: frontmatter.id,
    order: Number(frontmatter.order) || 0,
    tag: frontmatter.tag,
    title: frontmatter.title,
    roleContext: frontmatter.roleContext,
    metric: frontmatter.metric,
    challenge: sections.challenge,
    approach: sections.approach,
    outcome: sections.outcome,
  };
}

export function sortCaseStudies(list: CaseStudy[]): CaseStudy[] {
  return [...list].sort((a, b) => a.order - b.order);
}
