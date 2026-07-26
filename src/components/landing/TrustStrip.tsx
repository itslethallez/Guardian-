import { motion } from 'framer-motion'
import { Lock, ShieldCheck, WifiOff, Code2 } from 'lucide-react'

const trustItems = [
  { icon: Lock, text: 'End-to-end encrypted' },
  { icon: ShieldCheck, text: 'No data sold' },
  { icon: WifiOff, text: 'Works offline' },
  { icon: Code2, text: 'Open source' },
]

export default function TrustStrip() {
  return (
    <section className="border-y border-charcoal bg-dark-card/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustItems.map(({ icon: Icon, text }, index) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="flex items-center justify-center gap-2 text-sm text-ivory/80"
            >
              <Icon className="w-4 h-4 text-teal" />
              <span>{text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
