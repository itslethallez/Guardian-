import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Plus, Trash2, Clock, X } from 'lucide-react'
import { EscalationStep, AppUser } from '../../types'

interface EscalationBuilderScreenProps {
  user: AppUser
  onUpdate: (plan: EscalationStep[]) => void
}

const actionOptions: { value: EscalationStep['action']; label: string }[] = [
  { value: 'notify', label: 'Notify' },
  { value: 'escalate', label: 'Escalate' },
  { value: 'location', label: 'Share location' },
  { value: 'emergency', label: 'Emergency' },
]

export default function EscalationBuilderScreen({
  user,
  onUpdate,
}: EscalationBuilderScreenProps) {
  const navigate = useNavigate()
  const [steps, setSteps] = useState<EscalationStep[]>(user.escalationPlan)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<{
    action: EscalationStep['action']
    contactId: string
    delaySeconds: number
    description: string
  }>({
    action: 'notify',
    contactId: user.trustedContacts[0]?.id ?? '',
    delaySeconds: 0,
    description: '',
  })

  const actionColors: Record<string, string> = {
    notify: 'bg-teal/20 text-teal',
    escalate: 'bg-amber/20 text-amber',
    location: 'bg-gold/20 text-gold',
    emergency: 'bg-red-500/20 text-red-500',
  }

  const contactName = (contactId?: string) =>
    user.trustedContacts.find((contact) => contact.id === contactId)?.name

  const handleAddStep = () => {
    if (!formData.description.trim()) return

    const newStep: EscalationStep = {
      id: `step-${Date.now()}`,
      order: steps.length + 1,
      action: formData.action,
      contacts: formData.contactId ? [formData.contactId] : [],
      delaySeconds: formData.delaySeconds,
      description: formData.description.trim(),
    }

    setSteps((prev) => [...prev, newStep])
    setFormData({
      action: 'notify',
      contactId: user.trustedContacts[0]?.id ?? '',
      delaySeconds: 0,
      description: '',
    })
    setShowForm(false)
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
      {steps.length > 0 ? (
        <div className="mb-6 space-y-4">
          {steps.map((step) => (
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
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <p className="font-semibold text-ivory">{step.description}</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${actionColors[step.action] || ''}`}>
                      {step.action}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-ivory/60">
                    {contactName(step.contacts?.[0]) && <span>{contactName(step.contacts?.[0])}</span>}
                    {step.delaySeconds > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> After {step.delaySeconds}s
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => setSteps((prev) => prev.filter((s) => s.id !== step.id))}
                  className="text-ivory/40 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="mb-6 bg-dark-card border border-dashed border-charcoal rounded-lg p-6 text-center">
          <p className="text-sm text-ivory/60">
            No escalation steps yet. Add a step to define what happens if you don't check in.
          </p>
        </div>
      )}

      {/* Add Step */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          disabled={user.trustedContacts.length === 0}
          className="w-full px-4 py-4 border border-dashed border-gold text-gold font-semibold rounded-lg hover:bg-gold/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mb-6"
        >
          <Plus size={18} /> Add Step
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-card border border-charcoal rounded-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-ivory">New Step</h2>
            <button onClick={() => setShowForm(false)} className="text-ivory/60 hover:text-ivory transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ivory mb-2">Action</label>
              <div className="grid grid-cols-2 gap-2">
                {actionOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData((prev) => ({ ...prev, action: option.value }))}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      formData.action === option.value
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-charcoal text-ivory/70 hover:border-charcoal/80'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ivory mb-2">Contact</label>
              <select
                value={formData.contactId}
                onChange={(e) => setFormData((prev) => ({ ...prev, contactId: e.target.value }))}
                className="w-full px-4 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory focus:outline-none focus:border-gold"
              >
                {user.trustedContacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ivory mb-2">Delay (seconds)</label>
              <input
                type="number"
                min={0}
                value={formData.delaySeconds}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, delaySeconds: parseInt(e.target.value, 10) || 0 }))
                }
                className="w-full px-4 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ivory mb-2">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., Notify them and ask for a call back"
                className="w-full px-4 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
              />
            </div>

            <button
              onClick={handleAddStep}
              disabled={!formData.description.trim()}
              className="w-full px-4 py-3 bg-gold text-dark font-semibold rounded-lg hover:bg-gold/90 disabled:bg-gold/50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Add Step
            </button>
          </div>
        </motion.div>
      )}

      {user.trustedContacts.length === 0 && (
        <div className="bg-amber/10 border border-amber/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber/90">
            Add a Trusted Circle contact first so you have someone to assign escalation steps to.
          </p>
        </div>
      )}

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
