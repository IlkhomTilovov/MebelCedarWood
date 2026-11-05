import { About } from '@/components/landing/About';
import { CtaBand } from '@/components/landing/CtaBand';
import { Guarantee } from '@/components/landing/Guarantee';
import { Hero } from '@/components/landing/Hero';
import { Portfolio } from '@/components/landing/Portfolio';
import { ProcessSteps } from '@/components/landing/ProcessSteps';
import { StickyCta } from '@/components/landing/StickyCta';
import { WhyUs } from '@/components/landing/WhyUs';

export function LandingPage() {
  return (
    <div>
      <Hero />
      <About />
      <Guarantee />
      <WhyUs />
      <Portfolio />
      <ProcessSteps />
      <CtaBand />
      <StickyCta />
    </div>
  );
}
