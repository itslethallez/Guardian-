import { motion } from 'framer-motion'
import { DatabaseZap, LockKeyhole, BadgeX, Trash2 } from 'lucide-react'

const promises = [
  { icon: BadgeX, title: 'No data sold', copy: 'Your safety data is never sold to advertisers or brokers.' },
  { icon: LockKeyhole, title: 'End-to-end encrypted', copy: 'Sensitive alerts and phrases stay protected in transit.' },
  { icon: Trash2, title: 'Delete anytime', copy: 'Remove your history and contacts whenever you want.' },
  { icon: DatabaseZap, title: 'No ads', copy: 'Guard Mode is focused on protection, not ad targeting.' },
]

export default function PrivacySection() {
  return (
    <section id="privacy" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-ivory mb-10"
        >
          Privacy is a promise
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {promises.map(({ icon: Icon, title, copy }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="bg-dark-card border border-charcoal rounded-xl p-5"
            >
              <Icon className="w-5 h-5 text-gold mb-3" />
              <h3 className="text-ivory font-semibold mb-1">{title}</h3>
              <p className="text-ivory/70 text-sm">{copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
