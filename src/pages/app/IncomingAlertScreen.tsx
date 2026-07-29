import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, MapPin, Phone, MessageSquare, Navigation2, Clock, CheckCircle } from 'lucide-react'
import DemoModeBanner from '../../components/DemoModeBanner'

interface IncomingAlertScreenProps {
  onTrigger?: (alert: any) => void
}

export default function IncomingAlertScreen({
  onTrigger,
}: IncomingAlertScreenProps) {
  const navigate = useNavigate()
  const [acknowledged, setAcknowledged] = useState(false)
  const [action, setAction] = useState<string | null>(null)

  const alert = {
    userId: 'user-001',
    userName: 'Michael Torres',
    alertLevel: 'medium' as const,
    customMessage: 'I got a flat tyre',
    currentLocation: { lat: 37.7749, lng: -122.4194 },
    batteryLevel: 65,
    lastLocationUpdate: new Date(Date.now() - 5 * 60000),
    timestamp: new Date(),
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col p-6 pb-12 bg-gradient-to-b from-amber/5 to-dark"
    >
      <DemoModeBanner />

      {/* Alert Header */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-16 h-16 rounded-full bg-amber/20 flex items-center justify-center mx-auto mb-6 mt-4"
      >
        <AlertCircle className="w-8 h-8 text-amber" />
      </motion.div>

      {/* Status */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-ivory mb-2">{alert.userName} may need assistance</h1>
        <div className="inline-block px-4 py-1 bg-amber/20 text-amber rounded-full text-sm font-medium mb-4">
          Medium Alert
        </div>
        <p className="text-lg text-ivory/80 italic">{`"${alert.customMessage}"`}</p>
      </div>

      {/* Location Card */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-dark-card border border-charcoal rounded-lg overflow-hidden mb-6"
      >
        {/* Map */}
        <div className="w-full h-40 bg-charcoal flex items-center justify-center">
          <MapPin className="w-8 h-8 text-amber" />
        </div>

        {/* Details */}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-ivory/60 mb-1">Battery</p>
              <p className="text-lg font-semibold text-ivory">{alert.batteryLevel}%</p>
            </div>
            <div>
              <p className="text-xs text-ivory/60 mb-1">Last Update</p>
              <p className="text-lg font-semibold text-ivory">5 min ago</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-dark-card border border-charcoal rounded-lg p-4 mb-6"
      >
        <h3 className="font-semibold text-ivory mb-4">Session Timeline</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-ivory">Sotto Mode activated</p>
              <p className="text-xs text-ivory/60">15 minutes ago</p>
            </div>
          </div>
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-ivory">Sotto Phrase detected: "I got a flat tyre"</p>
              <p className="text-xs text-ivory/60">2 minutes ago</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      {!acknowledged ? (
        <div className="space-y-3 mt-auto">
          <button
            onClick={() => setAction('call')}
            className="w-full px-4 py-3 bg-teal text-dark font-semibold rounded-lg hover:bg-teal-light transition-colors flex items-center justify-center gap-2"
          >
            <Phone size={18} /> Call {alert.userName}
          </button>
          <button
            onClick={() => setAction('message')}
            className="w-full px-4 py-3 border border-gold text-gold font-semibold rounded-lg hover:bg-gold/10 transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare size={18} /> Message
          </button>
          <button
            onClick={() => setAction('navigate')}
            className="w-full px-4 py-3 border border-gold text-gold font-semibold rounded-lg hover:bg-gold/10 transition-colors flex items-center justify-center gap-2"
          >
            <Navigation2 size={18} /> Navigate
          </button>
          <button
            onClick={() => setAcknowledged(true)}
            className="w-full px-4 py-3 text-ivory/60 font-medium rounded-lg hover:text-ivory transition-colors"
          >
            I'm handling this
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-auto"
        >
          <div className="bg-teal/10 border border-teal/30 rounded-lg p-4 mb-4 text-center">
            <p className="text-teal font-semibold mb-1">✓ Alert acknowledged</p>
            <p className="text-sm text-teal/80">Michael has been notified that you're handling this.</p>
          </div>
          <button
            onClick={() => navigate('/app/home')}
            className="w-full px-4 py-3 bg-gold text-dark font-semibold rounded-lg hover:bg-gold/90 transition-colors"
          >
            Return Home
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}
