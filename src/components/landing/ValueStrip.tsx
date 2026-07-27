import { motion } from 'framer-motion'
import { MessageCircle, Shield, Users } from 'lucide-react'

const values = [
  {
    icon: MessageCircle,
    title: 'Speak naturally',
    copy: 'Create phrases that fit real conversations so help stays discreet.',
  },
  {
    icon: Shield,
    title: 'Stay private by default',
    copy: 'Keep your safety tools quiet until you choose to activate them.',
  },
  {
    icon: Users,
    title: 'Bring backup quickly',
    copy: 'Alert trusted people with the right context at the right time.',
  },
]

export default function ValueStrip() {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-4"
        >
          {values.map(({ icon: Icon, title, copy }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-charcoal bg-dark-card/90 p-5 shadow-soft"
            >
              <Icon className="w-5 h-5 text-teal mb-3" />
              <h3 className="text-ivory font-semibold mb-2">{title}</h3>
              <p className="text-sm text-ivory/70 leading-relaxed">{copy}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
