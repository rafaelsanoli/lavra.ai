import { Cabecalho, Rodape } from '@/components/layout'
import {
  HeroSection,
  FeaturesSection,
  PricingSection,
  WaitlistSection,
  FaqSection,
  HowItWorksSection
} from '@/components/landing'
import { BackToTop } from '@/components/ui'

export default function Home() {
  return (
    <>
      <Cabecalho />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <FaqSection />
        <WaitlistSection />
      </main>
      <Rodape />
      <BackToTop />
    </>
  )
}
