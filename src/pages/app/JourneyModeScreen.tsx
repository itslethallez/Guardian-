import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, MapPin, Clock, AlertCircle, Users } from 'lucide-react'
import { AppUser, GuardModeSession } from '../../types'

interface JourneyModeScreenProps {
  user: AppUser
  onStart: (session: GuardModeSession) => void
}

export default function JourneyModeScreen({ user, onStart }: JourneyModeScreenProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState<'destination' | 'arrival' | 'review'>('destination')
  const [config, setConfig] = useState({
    destination: '',
    expectedArrival: '',
    gracePeriod: 5,
  })

  const handleStart = () => {
    const now = new Date()
    const expectedArrival = new Date(now)
    const [hours, minutes] = config.expectedArrival.split(':').map(Number)
    if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
      expectedArrival.setHours(hours, minutes, 0, 0)
    }

    const session: GuardModeSession = {
      id: `session-${Date.now()}`,
      startTime: now,
      duration: 'custom',
      endTime: undefined,
      locationSharing: true,
      trustedContacts: user.trustedContacts.map((contact) => contact.id),
      activeSafePhrase: user.safePhrases.filter((phrase) => phrase.isActive).map((phrase) => phrase.id),
      checkInInterval: config.gracePeriod,
      note: `Journey to ${config.destination}`,
      status: 'active',
      alertsTriggered: [],
      journeyMode: {
        id: `journey-${Date.now()}`,
        destination: config.destination,
        expectedArrival,
        routeSharing: true,
        checkInGracePeriod: config.gracePeriod,
        status: 'active',
      },
    }

    onStart(session)
    navigate('/app/guard-mode-active')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col p-6"
    >
      {/* Header */}
      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold text-ivory mb-2">Journey Mode</h1>
        <p className="text-ivory/70">Set your destination and expected arrival</p>
      </div>

      {/* Step 1: Destination */}
      {step === 'destination' && (
        <motion.div
          key="destination"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex-1"
        >
          <div>
            <label className="block text-sm font-medium text-ivory mb-2">Where are you going?</label>
            <input
              type="text"
              value={config.destination}
              onChange={(e) => setConfig((prev) => ({ ...prev, destination: e.target.value }))}
              placeholder="e.g., Coffee shop at Main St"
              className="w-full px-4 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold mb-4"
            />
          </div>

          <div className="bg-dark-card border border-charcoal rounded-lg p-4 mb-4 flex items-center gap-3">
            <Users className={`w-5 h-5 ${user.trustedContacts.length > 0 ? 'text-teal' : 'text-ivory/40'}`} />
            <div>
              <p className="text-sm font-medium text-ivory">
                {user.trustedContacts.length > 0
                  ? `Shared with your ${user.trustedContacts.length}-person Trusted Circle`
                  : 'No Trusted Circle contacts yet'}
              </p>
              <p className="text-xs text-ivory/60">
                {user.trustedContacts.length > 0
                  ? 'Your route and status go to everyone in your circle'
                  : 'Add a contact from Trusted Circle before starting a journey'}
              </p>
            </div>
          </div>

          <div className="bg-gold/5 border border-gold/20 rounded-lg p-4">
            <p className="text-sm text-ivory/80">
              📄 Your route and status will be shared with your Trusted Circle until you mark the journey complete.
            </p>
          </div>
        </motion.div>
      )}

      {/* Step 2: Expected Arrival */}
      {step === 'arrival' && (
        <motion.div
          key="arrival"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex-1"
        >
          <div>
            <label className="block text-sm font-medium text-ivory mb-2">Expected Arrival Time</label>
            <input
              type="time"
              value={config.expectedArrival}
              onChange={(e) => setConfig((prev) => ({ ...prev, expectedArrival: e.target.value }))}
              className="w-full px-4 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory focus:outline-none focus:border-gold mb-4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ivory mb-2">Grace Period</label>
            <p className="text-xs text-ivory/60 mb-2">Allow this much extra time before a check-in</p>
            <select
              value={config.gracePeriod}
              onChange={(e) => setConfig((prev) => ({ ...prev, gracePeriod: parseInt(e.target.value) }))}
              className="w-full px-4 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory focus:outline-none focus:border-gold mb-4"
            >
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
            </select>
          </div>

          <div className="bg-amber/10 border border-amber/20 rounded-lg p-4">
            <p className="text-sm text-amber/80">
              ⚠️ If you don't check in within {config.gracePeriod} minutes of this time, your Trusted Circle will be notified.
            </p>
          </div>
        </motion.div>
      )}

      {/* Step 3: Review */}
      {step === 'review' && (
        <motion.div
          key="review"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex-1"
        >
          <h2 className="text-lg font-semibold text-ivory mb-6">Journey Summary</h2>
          <div className="space-y-4 bg-dark-card border border-charcoal rounded-lg p-6 mb-6">
            <div>
              <p className="text-sm text-ivory/60 flex items-center gap-2">
                <MapPin size={14} /> Destination
              </p>
              <p className="text-lg font-semibold text-ivory">{config.destination}</p>
            </div>
            <div>
              <p className="text-sm text-ivory/60 flex items-center gap-2">
                <Clock size={14} /> Expected Arrival
              </p>
              <p className="text-lg font-semibold text-ivory">{config.expectedArrival}</p>
            </div>
            <div>
              <p className="text-sm text-ivory/60 flex items-center gap-2">
                <AlertCircle size={14} /> Check-in Grace Period
              </p>
              <p className="text-lg font-semibold text-ivory">{config.gracePeriod} minutes</p>
            </div>
          </div>

          <div className="bg-gold/5 border border-gold/20 rounded-lg p-4">
            <p className="text-sm text-ivory/80">
              📍 Journey Mode will start immediately. You can end the journey anytime from your active session.
            </p>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step !== 'destination' && (
          <button
            onClick={() => {
              if (step === 'review') setStep('arrival')
              else setStep('destination')
            }}
            className="flex-1 px-4 py-3 text-ivory/60 font-medium rounded-lg hover:text-ivory transition-colors"
          >
            Back
          </button>
        )}
        {step === 'destination' && (
          <button
            onClick={() => navigate('/app/home')}
            className="flex-1 px-4 py-3 text-ivory/60 font-medium rounded-lg hover:text-ivory transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={() => {
            if (step === 'destination') setStep('arrival')
            else if (step === 'arrival') setStep('review')
            else handleStart()
          }}
          disabled={!config.destination || (step === 'arrival' && !config.expectedArrival)}
          className="flex-1 px-4 py-3 bg-gold text-dark font-semibold rounded-lg hover:bg-gold/90 disabled:bg-gold/50 transition-colors flex items-center justify-center gap-2"
        >
          {step === 'review' ? 'Start Journey' : 'Continue'}
          <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  )
}
