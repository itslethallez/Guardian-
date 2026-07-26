import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function FinalCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-gold/20 bg-dark-card p-10 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal/10 via-gold/10 to-teal/10 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-4">Your safety, one phrase away</h2>
            <p className="text-ivory/75 mb-8">
              Set up Guard Mode in minutes and protect yourself discreetly wherever you go.
            </p>
            <Link
              to="/auth/sign-up"
              className="inline-flex items-center gap-2 px-7 py-3 bg-gold text-dark font-semibold rounded-lg hover:bg-gold/90 transition-colors"
            >
              Start now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
