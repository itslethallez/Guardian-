import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Mic, Shield } from 'lucide-react'
import Logo from '../Logo'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

function Waveform() {
  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-gold to-gold/50 rounded-full"
          animate={{ height: ['8px', '32px', '8px'] }}
          transition={{
            duration: 0.6,
            delay: i * 0.05,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  )
}

export default function Hero() {
  return (
    <section className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex items-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-dark to-dark pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
              {/* Logo */}
              <motion.div variants={item}>
                <Logo />
              </motion.div>

              {/* Main headline */}
              <motion.div variants={item}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-ivory leading-tight">
                  Protection without drawing attention
                </h1>
              </motion.div>

              {/* Supporting copy */}
              <motion.p variants={item} className="text-lg text-ivory/80 max-w-lg leading-relaxed">
                Guard Mode gives you a discreet way to ask for help, share your location and alert people you trust without making it obvious to anyone around you.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/auth/sign-up"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gold text-dark font-semibold rounded-lg hover:bg-gold/90 transition-colors"
                >
                  Start Guard Mode
                  <ArrowRight size={18} />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-gold text-gold font-semibold rounded-lg hover:bg-gold/10 transition-colors"
                >
                  See How It Works
                </a>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right: Phone Mock-up */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Phone body */}
              <div className="w-full max-w-sm bg-gradient-to-b from-charcoal to-dark rounded-3xl border-8 border-charcoal shadow-2xl overflow-hidden">
                {/* Phone notch */}
                <div className="h-6 bg-charcoal flex items-center justify-center">
                  <div className="w-32 h-4 bg-dark rounded-b-lg" />
                </div>

                {/* Screen content */}
                <div className="bg-dark-card p-6 min-h-96 flex flex-col items-center justify-center space-y-8">
                  {/* Status indicator */}
                  <motion.div
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-12 h-12 rounded-full bg-teal/20 flex items-center justify-center"
                  >
                    <Shield className="w-6 h-6 text-teal" />
                  </motion.div>

                  {/* Waveform animation */}
                  <Waveform />

                  {/* Status text */}
                  <div className="text-center">
                    <p className="text-sm text-teal font-semibold mb-2">Guard Mode Active</p>
                    <p className="text-xs text-ivory/60">Listening for SafePhrases</p>
                  </div>

                  {/* Quick status */}
                  <div className="w-full space-y-3 pt-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-ivory/60">Location</span>
                      <span className="text-teal font-medium flex items-center gap-1">
                        <MapPin size={12} /> Connected
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-ivory/60">Trusted Circle</span>
                      <span className="text-teal font-medium">2 Available</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute -inset-8 bg-teal/5 rounded-3xl blur-3xl -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
