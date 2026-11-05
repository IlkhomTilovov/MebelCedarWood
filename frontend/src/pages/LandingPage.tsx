import { About } from '@/components/landing/About';
import { CtaBand } from '@/components/landing/CtaBand';
import { Guarantee } from '@/components/landing/Guarantee';
import { Hero } from '@/components/landing/Hero';
import { Portfolio } from '@/components/landing/Portfolio';
import { ProcessSteps } from '@/components/landing/ProcessSteps';
import { StickyCta } from '@/components/landing/StickyCta';
import { WhyUs } from '@/components/landing/WhyUs';
import { useSeo } from '@/lib/seo';

export function LandingPage() {
  useSeo({
    title: 'Premium oshxona mebeli ishlab chiqarish',
    description:
      "CEDAR WOOD — individual loyihalash, sifatli materiallar va shartnoma asosidagi muddat kafolati bilan premium oshxona mebeli. 1 kun kechiksak, shartnoma summasining 15% ini qaytaramiz.",
    path: '/',
  });

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
