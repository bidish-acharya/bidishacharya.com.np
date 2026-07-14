import siteContent from '../../content/generated/site-content.json';
import type { Profile, Job, SkillGroup, EducationEntry } from '../../content/lib/types';
import type { CaseStudy } from '../../content/lib/parseCaseStudy';

interface SiteContent {
  profile: Profile;
  experience: Job[];
  skills: SkillGroup[];
  education: EducationEntry[];
  caseStudies: CaseStudy[];
}

const content = siteContent as SiteContent;

export const profile = content.profile;
export const experience = content.experience;
export const skills = content.skills;
export const education = content.education;
export const caseStudies = content.caseStudies;

export type { CaseStudy };
