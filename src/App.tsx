import { useState } from 'react';
import { profile, experience, skills, education, caseStudies } from './lib/content';
import { Header } from './components/Header';
import { Summary } from './components/Summary';
import { CaseStudyCarousel } from './components/CaseStudyCarousel';
import { CaseStudyDetail } from './components/CaseStudyDetail';
import { ExperienceList } from './components/ExperienceList';
import { SkillsSection } from './components/SkillsSection';
import { Education } from './components/Education';
import { RecruiterChat } from './components/RecruiterChat';
import { Footer } from './components/Footer';

function App() {
  const [activeCaseIndex, setActiveCaseIndex] = useState<number | null>(null);
  const n = caseStudies.length;

  const openCase = (index: number) => {
    setActiveCaseIndex(index);
    window.scrollTo(0, 0);
  };
  const closeCase = () => setActiveCaseIndex(null);
  const goToCase = (index: number) => {
    setActiveCaseIndex(((index % n) + n) % n);
    window.scrollTo(0, 0);
  };

  if (activeCaseIndex !== null) {
    return (
      <main>
        <CaseStudyDetail
          caseStudy={caseStudies[activeCaseIndex]}
          total={n}
          onClose={closeCase}
          onPrev={() => goToCase(activeCaseIndex - 1)}
          onNext={() => goToCase(activeCaseIndex + 1)}
        />
      </main>
    );
  }

  return (
    <main className="max-w-[720px] mx-auto px-8 pt-24 pb-30 animate-fade-up">
      <Header profile={profile} />
      <Summary summary={profile.summary} />
      <CaseStudyCarousel caseStudies={caseStudies} onOpen={openCase} />
      <ExperienceList experience={experience} />
      <SkillsSection skills={skills} />
      <Education education={education} />
      <RecruiterChat />
      <Footer profile={profile} />
    </main>
  );
}

export default App;
