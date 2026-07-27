import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Plus, Trash2, Play } from 'lucide-react'
import { SafePhrase, AppUser } from '../../types'

interface SafePhraseBuilderScreenProps {
  user: AppUser
  onAdd: (phrase: SafePhrase) => void
}

export default function SafePhraseBuilderScreen({
  user,
  onAdd,
}: SafePhraseBuilderScreenProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<{
    phrase: string
    alertLevel: 'low' | 'medium' | 'urgent'
    customMessage: string
  }>({
    phrase: '',
    alertLevel: 'medium',
    customMessage: '',
  })
  const [testMode, setTestMode] = useState(false)
  const [testResult, setTestResult] = useState<{
    phrase: SafePhrase
    detectedAt: Date
  } | null>(null)

  const handleAdd = () => {
    if (!formData.phrase.trim()) return

    const newPhrase: SafePhrase = {
      id: `phrase-${Date.now()}`,
      phrase: formData.phrase,
      alternatives: [],
      alertLevel: formData.alertLevel,
      recipients: user.trustedContacts.slice(0, 2).map((c) => c.id),
      actions: [],
      customMessage: formData.customMessage,
      isActive: true,
    }

    onAdd(newPhrase)
    setFormData({ phrase: '', alertLevel: 'medium', customMessage: '' })
  }

  const handleStartTestMode = () => {
    setTestMode((prev) => !prev)
    setTestResult(null)
  }

  const handleTestPhrase = (phrase: SafePhrase) => {
    setTestMode(true)
    setTestResult({
      phrase,
      detectedAt: new Date(),
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col p-6 pb-12"
    >
      {/* Header */}
      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold text-ivory mb-2">SafePhrases</h1>
        <p className="text-ivory/70">Create natural-sounding phrases that trigger your chosen response</p>
      </div>

      {/* Warning */}
      <div className="bg-amber/10 border border-amber/30 rounded-lg p-4 mb-6">
        <p className="text-sm text-amber font-medium">⚠️ Choose phrases you won't say by accident</p>
        <p className="text-xs text-amber/80 mt-1">Avoid common sentences like "How are you?" or "What's the time?"</p>
      </div>

      {/* Existing Phrases */}
      {user.safePhrases.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-ivory mb-4">Your SafePhrases</h2>
          <div className="space-y-3">
            {user.safePhrases.map((phrase) => (
              <motion.div
                key={phrase.id}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-dark-card border border-charcoal rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-ivory flex-1">" {phrase.phrase}"</p>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      phrase.alertLevel === 'urgent'
                        ? 'bg-red-500/20 text-red-500'
                        : phrase.alertLevel === 'medium'
                        ? 'bg-amber/20 text-amber'
                        : 'bg-teal/20 text-teal'
                    }`}
                  >
                    {phrase.alertLevel}
                  </span>
                </div>
                <p className="text-xs text-ivory/60 mb-3">{phrase.customMessage || 'No message set'}</p>
                <button
                  type="button"
                  onClick={() => handleTestPhrase(phrase)}
                  className="flex items-center gap-2 text-xs text-gold hover:text-gold/80 transition-colors"
                >
                  <Play size={12} /> Test Phrase
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Phrase Form */}
      {user.safePhrases.length < 5 && (
        <div className="bg-dark-card border border-charcoal rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-ivory mb-4">Add New SafePhrase</h2>
          <div className="space-y-4">
            {/* Phrase Input */}
            <div>
              <label className="block text-sm font-medium text-ivory mb-2">Your Phrase</label>
              <input
                type="text"
                value={formData.phrase}
                onChange={(e) => setFormData((prev) => ({ ...prev, phrase: e.target.value }))}
                placeholder='e.g., "The weather was nice today"'
                className="w-full px-4 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
              />
              <p className="text-xs text-ivory/60 mt-2">Between 3-10 words, uncommon in daily conversation</p>
            </div>

            {/* Alert Level */}
            <div>
              <label className="block text-sm font-medium text-ivory mb-2">Alert Level</label>
              <div className="grid grid-cols-3 gap-3">
                {(['low', 'medium', 'urgent'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setFormData((prev) => ({ ...prev, alertLevel: level }))}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      formData.alertLevel === level
                        ? level === 'urgent'
                          ? 'bg-red-500/20 text-red-500 border border-red-500/50'
                          : level === 'medium'
                          ? 'bg-amber/20 text-amber border border-amber/50'
                          : 'bg-teal/20 text-teal border border-teal/50'
                        : 'bg-charcoal text-ivory/60 border border-charcoal/50'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Message */}
            <div>
              <label className="block text-sm font-medium text-ivory mb-2">Custom Message (Optional)</label>
              <textarea
                value={formData.customMessage}
                onChange={(e) => setFormData((prev) => ({ ...prev, customMessage: e.target.value }))}
                placeholder="What should your contacts know?"
                className="w-full px-4 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold resize-none"
                rows={2}
              />
            </div>

            {/* Add Button */}
            <button
              onClick={handleAdd}
              disabled={!formData.phrase.trim()}
              className="w-full px-4 py-3 bg-gold text-dark font-semibold rounded-lg hover:bg-gold/90 disabled:bg-gold/50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Add SafePhrase
            </button>
          </div>
        </div>
      )}

      {/* Test Mode */}
      {user.safePhrases.length > 0 && (
        <div className="bg-dark-card border border-charcoal rounded-lg p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-ivory">Test Phrases (No Alert Sent)</h2>
              <p className="text-xs text-ivory/60 mt-1">
                Simulate detection locally to verify your SafePhrases before you need them.
              </p>
            </div>
            <button
              type="button"
              onClick={handleStartTestMode}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                testMode
                  ? 'bg-teal text-dark hover:bg-teal-light'
                  : 'border border-gold text-gold hover:bg-gold/10'
              }`}
            >
              <Play size={16} />
              {testMode ? 'Stop Test Mode' : 'Start Test Mode'}
            </button>
          </div>

          {testMode ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-teal/30 bg-teal/10 p-4">
                <p className="text-sm text-teal font-semibold">Test mode is active</p>
                <p className="text-xs text-teal/80 mt-1">
                  Tap any phrase above to simulate detection without sending a real alert.
                </p>
              </div>

              {testResult ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-gold/20 bg-dark-card p-4"
                >
                  <p className="text-sm text-ivory font-semibold mb-1">Last test result</p>
                  <p className="text-sm text-ivory/80">
                    Detected phrase: "{testResult.phrase.phrase}"
                  </p>
                  <p className="text-xs text-ivory/60 mt-1">
                    Alert level: {testResult.phrase.alertLevel} | {testResult.detectedAt.toLocaleTimeString()}
                  </p>
                  <p className="text-xs text-teal mt-3">
                    No alert was sent. This was only a local simulation.
                  </p>
                </motion.div>
              ) : (
                <div className="rounded-lg border border-charcoal bg-charcoal/40 p-4">
                  <p className="text-sm text-ivory/80">
                    No phrase has been tested yet. Choose a SafePhrase above to run the simulation.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-charcoal bg-charcoal/40 p-4">
              <p className="text-sm text-ivory/80">
                Turn on test mode to verify phrase detection without sending any alert.
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
