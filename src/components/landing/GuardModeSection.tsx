import { motion } from 'framer-motion'
import { Mic, MapPinned, Shield } from 'lucide-react'

export default function GuardModeSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-4">Guard Mode, always in the background</h2>
          <p className="text-ivory/75 mb-6">
            Stay discreet while Guard Mode listens for your SafePhrase, tracks your route, and keeps trusted contacts aware.
          </p>
          <div className="space-y-3">
            <p className="flex items-center gap-2 text-ivory/80"><Mic className="w-4 h-4 text-teal" /> Passive phrase listening</p>
            <p className="flex items-center gap-2 text-ivory/80"><MapPinned className="w-4 h-4 text-teal" /> Live location sharing</p>
            <p className="flex items-center gap-2 text-ivory/80"><Shield className="w-4 h-4 text-teal" /> Fast alert escalation</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-dark-card border border-charcoal rounded-2xl p-6"
        >
          <div className="text-xs text-ivory/50 mb-3">Guard Mode status</div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-ivory/70">Microphone</span>
              <span className="text-teal">Active</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ivory/70">Location updates</span>
              <span className="text-teal">Shared every 30s</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ivory/70">Trusted contacts</span>
              <span className="text-gold">3 online</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
