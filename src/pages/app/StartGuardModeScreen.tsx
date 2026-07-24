import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Clock, MapPin, Users, AlertCircle } from 'lucide-react'
import { GuardModeSession } from '../../types'

interface StartGuardModeScreenProps {
  onStart: (session: GuardModeSession) => void
}

const durationOptions = [
  { label: '30 minutes', value: 'thirty-min', minutes: 30 },
  { label: '1 hour', value: 'one-hour', minutes: 60 },
  { label: '2 hours', value: 'two-hours', minutes: 120 },
  { label: 'Until I turn it off', value: 'manual', minutes: 0 },
]

export default function StartGuardModeScreen({
  onStart,
}: StartGuardModeScreenProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState<'duration' | 'config' | 'review'>('duration')
  const [config, setConfig] = useState({
    duration: 'one-hour' as const,
    locationSharing: true,
    enableSafePhrases: true,
    checkInInterval: 5,
    note: '',
    journeyDestination: '',
  })

  const selectedDuration = durationOptions.find((d) => d.value === config.duration)

  const handleStart = () => {
    const now = new Date()
    const endTime = new Date(
      now.getTime() + (selectedDuration?.minutes || 0) * 60000
    )

    const session: GuardModeSession = {
      id: `session-${Date.now()}`,
      startTime: now,
      duration: config.duration,
      endTime: config.duration === 'manual' ? undefined : endTime,
      locationSharing: config.locationSharing,
      trustedContacts: [],
      activeSafePhrase: [],
      checkInInterval: config.checkInInterval,
      note: config.note,
      status: 'active',
      alertsTriggered: [],
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
        <h1 className="text-3xl font-bold text-ivory mb-2">Start Guard Mode</h1>
        <p className="text-ivory/70">Configure your safety session</p>
      </div>

      {/* Step 1: Duration */}
      {step === 'duration' && (
        <motion.div
          key="duration"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex-1"
        >
          <h2 className="text-lg font-semibold text-ivory mb-4">How long do you need Guard Mode?</h2>
          <div className="space-y-3">
            {durationOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setConfig((prev) => ({ ...prev, duration: option.value as any }))}
                className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                  config.duration === option.value
                    ? 'border-gold bg-gold/10'
                    : 'border-charcoal hover:border-charcoal/80 bg-dark-card'
                }`}
              >
                <Clock className="w-6 h-6 text-gold" />
                <div className="text-left flex-1">
                  <p className="font-medium text-ivory">{option.label}</p>
                </div>
                {config.duration === option.value && (
                  <div className="w-6 h-6 rounded-full border-2 border-gold bg-gold/20" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Step 2: Configuration */}
      {step === 'config' && (
        <motion.div
          key="config"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex-1 space-y-4"
        >
          {/* Location Sharing */}
          <div className="bg-dark-card border border-charcoal rounded-lg p-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gold" />
                <div>
                  <p className="font-medium text-ivory">Location Sharing</p>
                  <p className="text-xs text-ivory/60">Share with Trusted Circle</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.locationSharing}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    locationSharing: e.target.checked,
                  }))
                }
                className="w-5 h-5 accent-gold rounded"
              />
            </label>
          </div>

          {/* SafePhrases */}
          <div className="bg-dark-card border border-charcoal rounded-lg p-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-gold" />
                <div>
                  <p className="font-medium text-ivory">Enable SafePhrases</p>
                  <p className="text-xs text-ivory/60">Listen for your phrases</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.enableSafePhrases}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    enableSafePhrases: e.target.checked,
                  }))
                }
                className="w-5 h-5 accent-gold rounded"
              />
            </label>
          </div>

          {/* Check-in Interval */}
          <div className="bg-dark-card border border-charcoal rounded-lg p-4">
            <label className="block">
              <p className="font-medium text-ivory mb-2">Check-in Interval</p>
              <select
                value={config.checkInInterval}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    checkInInterval: parseInt(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 bg-charcoal border border-charcoal/50 rounded-lg text-ivory focus:outline-none focus:border-gold"
              >
                <option value={5}>Every 5 minutes</option>
                <option value={10}>Every 10 minutes</option>
                <option value={15}>Every 15 minutes</option>
                <option value={30}>Every 30 minutes</option>
              </select>
            </label>
          </div>

          {/* Note */}
          <div className="bg-dark-card border border-charcoal rounded-lg p-4">
            <label className="block">
              <p className="font-medium text-ivory mb-2">Session Note (Optional)</p>
              <textarea
                value={config.note}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    note: e.target.value,
                  }))
                }
                placeholder="E.g., First date at The Blue Room"
                className="w-full px-3 py-2 bg-charcoal border border-charcoal/50 rounded-lg text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold resize-none"
                rows={3}
              />
            </label>
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
          <h2 className="text-lg font-semibold text-ivory mb-6">Ready to activate?</h2>
          <div className="space-y-4 bg-dark-card border border-charcoal rounded-lg p-6 mb-6">
            <div>
              <p className="text-sm text-ivory/60">Duration</p>
              <p className="text-lg font-semibold text-ivory">{selectedDuration?.label}</p>
            </div>
            {config.locationSharing && (
              <div>
                <p className="text-sm text-ivory/60 flex items-center gap-2">
                  <MapPin size={14} /> Location Sharing Enabled
                </p>
              </div>
            )}
            {config.enableSafePhrases && (
              <div>
                <p className="text-sm text-ivory/60 flex items-center gap-2">
                  <AlertCircle size={14} /> SafePhrases Listening
                </p>
              </div>
            )}
            {config.note && (
              <div>
                <p className="text-sm text-ivory/60">Note</p>
                <p className="text-ivory italic">"{ config.note}"</p>
              </div>
            )}
          </div>

          <div className="bg-gold/5 border border-gold/20 rounded-lg p-4">
            <p className="text-sm text-ivory/80">
              🎤 Make sure your microphone is enabled and you're in a safe place to activate Guard Mode.
            </p>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step !== 'duration' && (
          <button
            onClick={() => {
              if (step === 'review') setStep('config')
              else setStep('duration')
            }}
            className="flex-1 px-4 py-3 text-ivory/60 font-medium rounded-lg hover:text-ivory transition-colors"
          >
            Back
          </button>
        )}
        {step === 'duration' && (
          <button
            onClick={() => navigate('/app/home')}
            className="flex-1 px-4 py-3 text-ivory/60 font-medium rounded-lg hover:text-ivory transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={() => {
            if (step === 'duration') setStep('config')
            else if (step === 'config') setStep('review')
            else handleStart()
          }}
          className="flex-1 px-4 py-3 bg-gold text-dark font-semibold rounded-lg hover:bg-gold/90 transition-colors flex items-center justify-center gap-2"
        >
          {step === 'review' ? 'Activate Guard Mode' : 'Continue'}
          <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  )
}
