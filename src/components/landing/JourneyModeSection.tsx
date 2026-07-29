import { motion } from 'framer-motion'
import { Clock3, Map, Route } from 'lucide-react'

export default function JourneyModeSection() {
  return (
    <section id="journey-mode" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-4">Journey Mode for safer trips</h2>
          <p className="text-ivory/75 mb-6">
            Share your route and expected arrival time. If you miss a check-in, Sotto prompts you and can alert your circle.
          </p>
          <div className="space-y-3 text-ivory/80">
            <p className="flex items-center gap-2"><Route className="w-4 h-4 text-teal" /> Route tracking with ETA</p>
            <p className="flex items-center gap-2"><Clock3 className="w-4 h-4 text-teal" /> Automatic missed check-in reminders</p>
            <p className="flex items-center gap-2"><Map className="w-4 h-4 text-teal" /> Live trip updates to contacts</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-dark-card border border-charcoal rounded-2xl p-6 space-y-4"
        >
          <div className="text-xs text-ivory/50">Journey Mode</div>
          <div className="bg-charcoal rounded-lg p-4">
            <p className="text-sm text-ivory/70">Route</p>
            <p className="text-ivory font-medium">Campus Library → Oak Street Station</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-charcoal rounded-lg p-3">
              <p className="text-xs text-ivory/60">ETA</p>
              <p className="text-ivory font-semibold">8:42 PM</p>
            </div>
            <div className="bg-charcoal rounded-lg p-3">
              <p className="text-xs text-ivory/60">Check-in</p>
              <p className="text-ivory font-semibold">Every 5 min</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
