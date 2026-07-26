import { motion } from 'framer-motion'
import { MoonStar, HeartHandshake, Plane, Users } from 'lucide-react'

const useCases = [
  { icon: MoonStar, title: 'Late-night walk home', copy: 'Keep your location shared and safety check-ins active until you arrive.' },
  { icon: HeartHandshake, title: 'First date', copy: 'Set a discreet phrase and let a friend monitor your check-ins.' },
  { icon: Plane, title: 'Travelling alone', copy: 'Share your route and trigger help quickly in unfamiliar places.' },
  { icon: Users, title: 'Meeting a stranger', copy: 'Have backup ready without drawing attention to your phone.' },
]

export default function UseCases() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-ivory mb-10"
        >
          Built for real moments
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {useCases.map(({ icon: Icon, title, copy }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="bg-dark-card border border-charcoal rounded-xl p-5"
            >
              <Icon className="w-5 h-5 text-teal mb-3" />
              <h3 className="text-ivory font-semibold mb-2">{title}</h3>
              <p className="text-sm text-ivory/70">{copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
