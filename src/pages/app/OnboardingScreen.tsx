import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

const slides = [
  {
    heading: 'Protection without drawing attention',
    description: 'Sotto Mode activates only when you choose it.',
    icon: '🛡️',
  },
  {
    heading: 'Create private Sotto Phrases',
    description: 'Natural sentences that trigger your chosen response.',
    icon: '🎤',
  },
  {
    heading: 'Alert people you trust',
    description: 'Your Trusted Circle receives discreet notifications.',
    icon: '👥',
  },
  {
    heading: 'Share only what you choose',
    description: 'Control exactly what information is shared at each level.',
    icon: '🔒',
  },
  {
    heading: 'Sotto Mode runs only when you activate it',
    description: 'No background monitoring. No exceptions.',
    icon: '✨',
  },
]

export default function OnboardingScreen() {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      navigate('/app/account-creation')
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Content */}
      <motion.div
        key={currentSlide}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex-1 flex flex-col items-center justify-center px-6 text-center"
      >
        <div className="text-6xl mb-6">{slides[currentSlide].icon}</div>
        <h2 className="text-3xl font-bold text-ivory mb-4">{slides[currentSlide].heading}</h2>
        <p className="text-lg text-ivory/70 max-w-sm mb-8">{slides[currentSlide].description}</p>
      </motion.div>

      {/* Navigation */}
      <div className="px-6 pb-8 space-y-4">
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? 'w-8 bg-gold' : 'w-2 bg-charcoal'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/app/account-creation')}
            className="flex-1 px-4 py-3 text-ivory/60 font-medium rounded-lg hover:text-ivory transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-3 bg-gold text-dark font-semibold rounded-lg hover:bg-gold/90 transition-colors flex items-center justify-center gap-2"
          >
            {currentSlide === slides.length - 1 ? 'Set Up Sotto Mode' : 'Continue'}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
