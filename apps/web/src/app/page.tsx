import { Cabecalho, Rodape } from '@/components/layout'
import { 
  HeroSection, 
  FeaturesSection, 
  PricingSection, 
  WaitlistSection 
} from '@/components/landing'

export default function Home() {
  return (
    <>
      <Cabecalho />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <WaitlistSection />
      </main>
      <Rodape />
    </>
  )
}
