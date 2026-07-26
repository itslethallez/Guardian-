import { motion } from 'framer-motion'
import { MessageCircle, Mic, Siren } from 'lucide-react'

const steps = [
  {
    title: 'Set your SafePhrase',
    description: 'Create a natural sentence only you know triggers help.',
    icon: MessageCircle,
  },
  {
    title: 'Activate Guard Mode',
    description: 'Start listening quietly while location sharing runs in the background.',
    icon: Mic,
  },
  {
    title: 'Help is on the way',
    description: 'Trusted contacts are alerted with your location and context.',
    icon: Siren,
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-ivory mb-10"
        >
          How it works
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map(({ title, description, icon: Icon }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-dark-card border border-charcoal rounded-xl p-6"
            >
              <div className="w-8 h-8 rounded-full bg-gold/20 text-gold text-sm font-bold flex items-center justify-center mb-4">
                {index + 1}
              </div>
              <Icon className="w-5 h-5 text-teal mb-3" />
              <h3 className="text-xl font-semibold text-ivory mb-2">{title}</h3>
              <p className="text-ivory/70">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
