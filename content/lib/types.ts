export interface Profile {
  name: string;
  title: string;
  location: string;
  summary: string;
  tagline: string;
  links: {
    linkedin: string;
    rhinostats: string;
    email: string;
  };
}

export interface Job {
  role: string;
  company: string;
  dates: string;
  bullets: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface EducationEntry {
  degree: string;
  school: string;
  dates: string;
  extra: string | null;
}
