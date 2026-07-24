import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Plus, Trash2, Clock } from 'lucide-react'
import { EscalationStep, AppUser } from '../../types'

interface EscalationBuilderScreenProps {
  onUpdate: (plan: EscalationStep[]) => void
}

export default function EscalationBuilderScreen({
  onUpdate,
}: EscalationBuilderScreenProps) {
  const navigate = useNavigate()
  const [steps, setSteps] = useState<EscalationStep[]>([
    {
      id: '1',
      order: 1,
      action: 'notify',
      contacts: ['contact-001'],
      delaySeconds: 0,
      description: 'Notify Sarah and ask her to call',
    },
    {
      id: '2',
      order: 2,
      action: 'escalate',
      contacts: ['contact-002'],
      delaySeconds: 120,
      description: 'If not acknowledged within 2 minutes, notify James',
    },
  ])

  const actionColors: Record<string, string> = {
    notify: 'bg-teal/20 text-teal',
    escalate: 'bg-amber/20 text-amber',
    location: 'bg-gold/20 text-gold',
    emergency: 'bg-red-500/20 text-red-500',
  }

  const handleSave = () => {
    onUpdate(steps)
    navigate('/app/home')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col p-6 pb-12"
    >
      {/* Header */}
      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold text-ivory mb-2">Escalation Plan</h1>
        <p className="text-ivory/70">Build your step-by-step response</p>
      </div>

      {/* Steps */}
      <div className="mb-8 space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-dark-card border border-charcoal rounded-lg p-4"
          >
            <div className="flex items-start gap-4">
              {/* Step number */}
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                <span className="text-gold font-semibold text-sm">{step.order}</span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-ivory">{step.description}</p>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${actionColors[step.action] || ''}`}>
                    {step.action}
                  </span>
                </div>

                {step.delaySeconds > 0 && (
                  <p className="text-xs text-ivory/60 flex items-center gap-1">
                    <Clock size={12} /> After {step.delaySeconds}s
                  </p>
                )}
              </div>

              {/* Delete button */}
              {steps.length > 1 && (
                <button
                  onClick={() => setSteps((prev) => prev.filter((s) => s.id !== step.id))}
                  className="text-ivory/40 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-gold/5 border border-gold/20 rounded-lg p-4 mb-6">
        <p className="text-sm text-ivory/80">
          📍 Your escalation plan runs only when you choose to activate it. Each step should have a clear action and contact assignment.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-auto">
        <button
          onClick={() => navigate('/app/home')}
          className="flex-1 px-4 py-3 text-ivory/60 font-medium rounded-lg hover:text-ivory transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-3 bg-gold text-dark font-semibold rounded-lg hover:bg-gold/90 transition-colors flex items-center justify-center gap-2"
        >
          Save Plan
          <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  )
}
