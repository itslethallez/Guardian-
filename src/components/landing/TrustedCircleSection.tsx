import { motion } from 'framer-motion'
import { Phone, UserCheck } from 'lucide-react'

const contacts = [
  { name: 'Maya R.', relation: 'Sister', status: 'Available' },
  { name: 'Jordan K.', relation: 'Best friend', status: 'On standby' },
]

export default function TrustedCircleSection() {
  return (
    <section id="trusted-circle" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-ivory mb-4"
        >
          Build your Trusted Circle
        </motion.h2>
        <p className="text-ivory/75 mb-8 max-w-2xl">
          Add people who can respond quickly. They get alerts, your live location, and your custom safety note the moment you need support.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {contacts.map((contact, index) => (
            <motion.div
              key={contact.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-dark-card border border-charcoal rounded-xl p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-ivory font-semibold">{contact.name}</p>
                  <p className="text-sm text-ivory/60">{contact.relation}</p>
                </div>
                <UserCheck className="w-5 h-5 text-teal" />
              </div>
              <div className="mt-4 text-sm flex items-center justify-between">
                <span className="text-ivory/60 flex items-center gap-2"><Phone className="w-4 h-4 text-gold" /> Alert method</span>
                <span className="text-gold">{contact.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
