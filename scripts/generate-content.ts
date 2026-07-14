import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCaseStudy, sortCaseStudies } from '../content/lib/parseCaseStudy.ts';
import type { Profile, Job, SkillGroup, EducationEntry } from '../content/lib/types.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentDir = join(__dirname, '..', 'content');
const outDir = join(contentDir, 'generated');

function readJson<T>(filename: string): T {
  return JSON.parse(readFileSync(join(contentDir, filename), 'utf-8')) as T;
}

const profile = readJson<Profile>('profile.json');
const experience = readJson<Job[]>('experience.json');
const skills = readJson<SkillGroup[]>('skills.json');
const education = readJson<EducationEntry[]>('education.json');

const caseStudiesDir = join(contentDir, 'case-studies');
const caseStudyFiles = readdirSync(caseStudiesDir).filter((f) => f.endsWith('.md'));
const caseStudies = sortCaseStudies(
  caseStudyFiles.map((file) => parseCaseStudy(readFileSync(join(caseStudiesDir, file), 'utf-8'))),
);

mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, 'site-content.json'),
  JSON.stringify({ profile, experience, skills, education, caseStudies }, null, 2),
);

console.log(`Generated content/generated/site-content.json (${caseStudies.length} case studies)`);
