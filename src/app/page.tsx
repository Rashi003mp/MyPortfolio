import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import SkillsSection from '@/components/skills-section';
import ProjectsSection from '@/components/projects-section';
import GithubSection from '@/components/github-section';
import ContactSection from '@/components/contact-section';
import Footer from '@/components/footer';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <Separator className="my-4 container" />
        <SkillsSection />
        <ProjectsSection />
        <Separator className="my-4 container" />
        <GithubSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
