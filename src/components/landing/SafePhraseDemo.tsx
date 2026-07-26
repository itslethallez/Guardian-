import { motion } from 'framer-motion'
import { Ear, MessageSquare } from 'lucide-react'

export default function SafePhraseDemo() {
  return (
    <section id="safephrase" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-dark-card border border-charcoal rounded-2xl p-8 md:p-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-4">SafePhrase detection</h2>
          <p className="text-ivory/75 mb-8">
            Say your phrase naturally in conversation. Guard Mode quietly detects it and activates your emergency flow.
          </p>

          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-wide text-ivory/50">Example phrase</div>
              <div className="bg-charcoal border border-charcoal/80 rounded-lg p-4 text-ivory">
                “Can you check if I left the balcony door open?”
              </div>
            </div>

            <motion.div
              animate={{ boxShadow: ['0 0 0px rgba(63,184,160,0)', '0 0 28px rgba(63,184,160,0.45)', '0 0 0px rgba(63,184,160,0)'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-teal/10 border border-teal/40 rounded-lg p-5"
            >
              <div className="flex items-center gap-3 text-teal mb-2">
                <Ear className="w-5 h-5" />
                <span className="font-semibold">Listening...</span>
              </div>
              <div className="flex items-center gap-3 text-ivory/80">
                <MessageSquare className="w-4 h-4 text-gold" />
                <span>SafePhrase detected. Alerting your trusted circle.</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
