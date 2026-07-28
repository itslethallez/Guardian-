import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, MapPin, Mic, Users, Battery, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { GuardModeSession } from '../../types'
import DemoModeBanner from '../../components/DemoModeBanner'

interface GuardModeActiveScreenProps {
  session: GuardModeSession | null
  onEnd: () => void
  onExtend: () => void
}

export default function GuardModeActiveScreen({
  session,
  onEnd,
  onExtend,
}: GuardModeActiveScreenProps) {
  const navigate = useNavigate()
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [showCheckIn, setShowCheckIn] = useState(false)

  const handleImSafe = () => {
    setShowCheckIn(false)
    onEnd()
    navigate('/app/home')
  }

  const handleExtend = () => {
    onExtend()
    setShowCheckIn(false)
  }

  const handleQuietAssistance = () => {
    setShowCheckIn(false)
    navigate('/app/incoming-alert')
  }

  useEffect(() => {
    if (!session?.endTime) return

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const end = new Date(session.endTime!).getTime()
      const remaining = Math.max(0, Math.floor((end - now) / 1000))
      setTimeRemaining(remaining)

      // Show check-in at 5 minute mark
      if (remaining === 300) setShowCheckIn(true)
    }, 1000)

    return () => clearInterval(interval)
  }, [session])

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-ivory/60">Loading...</p>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m ${secs}s`
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col p-6 pb-12"
    >
      <DemoModeBanner />

      {/* Active Indicator */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-16 h-16 rounded-full bg-teal/20 flex items-center justify-center mx-auto mb-6 mt-4"
      >
        <Shield className="w-8 h-8 text-teal" />
      </motion.div>

      {/* Status */}
      <div className="text-center mb-8">
        <p className="text-sm text-teal font-semibold mb-1 flex items-center justify-center gap-2">
          <CheckCircle size={14} /> Guard Mode Active
        </p>
        <h1 className="text-4xl font-bold text-ivory mb-2">{formatTime(timeRemaining)}</h1>
        <p className="text-sm text-ivory/60">Time remaining</p>
      </div>

      {/* Status Grid */}
      <div className="space-y-3 mb-8">
        {/* Location */}
        <div className="bg-dark-card border border-charcoal rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-teal" />
            <div>
              <p className="font-medium text-ivory">Location</p>
              <p className="text-xs text-ivory/60">Connected</p>
            </div>
          </div>
          <div className="w-3 h-3 rounded-full bg-teal animate-pulse" />
        </div>

        {/* Microphone */}
        <div className="bg-dark-card border border-charcoal rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mic className="w-5 h-5 text-teal" />
            <div>
              <p className="font-medium text-ivory">Microphone</p>
              <p className="text-xs text-ivory/60">Listening</p>
            </div>
          </div>
          <div className="w-3 h-3 rounded-full bg-teal animate-pulse" />
        </div>

        {/* Trusted Circle */}
        <div className="bg-dark-card border border-charcoal rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-teal" />
            <div>
              <p className="font-medium text-ivory">Trusted Circle</p>
              <p className="text-xs text-ivory/60">2 Connected</p>
            </div>
          </div>
          <div className="w-3 h-3 rounded-full bg-teal animate-pulse" />
        </div>

        {/* Battery */}
        <div className="bg-dark-card border border-charcoal rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Battery className="w-5 h-5 text-safety-green" />
            <div>
              <p className="font-medium text-ivory">Battery</p>
              <p className="text-xs text-ivory/60">87%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Check-in Modal */}
      {showCheckIn && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/80 flex items-end z-50"
        >
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="w-full bg-dark-card border-t border-charcoal rounded-t-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber" />
              <h2 className="text-xl font-bold text-ivory">Your session ends in 5 minutes</h2>
            </div>
            <p className="text-ivory/70 mb-6">Are you safe? Let us know how you're doing.</p>
            <div className="space-y-3">
              <button
                onClick={handleImSafe}
                className="w-full px-4 py-3 bg-teal text-dark font-semibold rounded-lg hover:bg-teal-light transition-colors"
              >
                I'm Safe
              </button>
              <button
                onClick={handleExtend}
                className="w-full px-4 py-3 border border-gold text-gold font-semibold rounded-lg hover:bg-gold/10 transition-colors"
              >
                Extend Session
              </button>
              <button
                onClick={handleQuietAssistance}
                className="w-full px-4 py-3 border border-amber text-amber font-semibold rounded-lg hover:bg-amber/10 transition-colors"
              >
                Quiet Assistance
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="space-y-3 mt-auto">
        <button
          onClick={handleImSafe}
          className="w-full px-4 py-3 bg-teal text-dark font-semibold rounded-lg hover:bg-teal-light transition-colors"
        >
          I'm Safe
        </button>
        <button
          onClick={handleExtend}
          className="w-full px-4 py-3 border border-gold text-gold font-semibold rounded-lg hover:bg-gold/10 transition-colors"
        >
          Extend Time
        </button>
        <button
          onClick={handleQuietAssistance}
          className="w-full px-4 py-3 border border-amber text-amber font-semibold rounded-lg hover:bg-amber/10 transition-colors"
        >
          Quiet Assistance
        </button>
        <button
          onClick={() => {
            onEnd()
            navigate('/app/home')
          }}
          className="w-full px-4 py-3 text-ivory/60 font-medium rounded-lg hover:text-ivory transition-colors"
        >
          End Session
        </button>
      </div>
    </motion.div>
  )
}
