import { Cabecalho, Rodape } from '@/components/layout'
import {
  HeroSection,
  FeaturesSection,
  PricingSection,
  WaitlistSection,
  FaqSection,
  HowItWorksSection,
  LogoCloud
} from '@/components/landing'
import { BackToTop } from '@/components/ui'

export default function Home() {
  return (
    <>
      <Cabecalho />
      <main>
        <HeroSection />
        <LogoCloud />
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
