import { useEffect } from 'react'
import Navigation from '../components/Navigation'
import Hero from '../components/landing/Hero'
import TrustStrip from '../components/landing/TrustStrip'
import HowItWorks from '../components/landing/HowItWorks'
import SafePhraseDemo from '../components/landing/SafePhraseDemo'
import GuardModeSection from '../components/landing/GuardModeSection'
import TrustedCircleSection from '../components/landing/TrustedCircleSection'
import JourneyModeSection from '../components/landing/JourneyModeSection'
import PrivacySection from '../components/landing/PrivacySection'
import UseCases from '../components/landing/UseCases'
import FinalCTA from '../components/landing/FinalCTA'

export default function LandingPage() {
  useEffect(() => {
    document.body.style.overflowX = 'hidden'
    return () => {
      document.body.style.overflowX = 'auto'
    }
  }, [])

  return (
    <>
      <Navigation />
      <main className="bg-dark text-ivory">
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <SafePhraseDemo />
        <GuardModeSection />
        <TrustedCircleSection />
        <JourneyModeSection />
        <PrivacySection />
        <UseCases />
        <FinalCTA />
      </main>
    </>
  )
}
