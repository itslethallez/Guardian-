import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Mic, MapPin, Bell, Zap, Activity } from 'lucide-react'
import { AppUser } from '../../types'

interface PermissionSetupScreenProps {
  onUpdate: (permissions: Partial<AppUser['permissions']>) => void
}

const permissions = [
  {
    id: 'microphone',
    name: 'Microphone',
    icon: Mic,
    description: 'Listen for your SafePhrases',
    required: true,
  },
  {
    id: 'location',
    name: 'Location',
    icon: MapPin,
    description: 'Share your location with Trusted Circle',
    required: true,
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: Bell,
    description: 'Receive check-in requests and alerts',
    required: true,
  },
  {
    id: 'backgroundActivity',
    name: 'Background Activity',
    icon: Zap,
    description: 'Keep Guard Mode running in the background',
    required: false,
  },
  {
    id: 'motion',
    name: 'Motion Sensors',
    icon: Activity,
    description: 'Optional: Detect unusual movement patterns',
    required: false,
  },
]

export default function PermissionSetupScreen({
  onUpdate,
}: PermissionSetupScreenProps) {
  const navigate = useNavigate()
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, boolean>
  >({
    microphone: true,
    location: true,
    notifications: true,
    backgroundActivity: true,
    motion: false,
  })

  const handleToggle = (id: string) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleSubmit = () => {
    onUpdate(selectedPermissions)
    navigate('/home')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col p-6"
    >
      {/* Header */}
      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold text-ivory mb-2">Permissions</h1>
        <p className="text-ivory/70">Choose which permissions Guard Mode needs</p>
      </div>

      {/* Permissions List */}
      <div className="flex-1 space-y-3 mb-6">
        {permissions.map((perm) => {
          const Icon = perm.icon
          const isEnabled = selectedPermissions[perm.id]
          return (
            <motion.button
              key={perm.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleToggle(perm.id)}
              disabled={perm.required}
              className={`w-full flex items-start gap-4 p-4 rounded-lg border transition-all ${
                isEnabled
                  ? 'bg-gold/5 border-gold/30'
                  : 'bg-charcoal/30 border-charcoal/50'
              } ${
                perm.required
                  ? 'cursor-not-allowed opacity-100'
                  : 'cursor-pointer hover:border-gold/20'
              }`}
            >
              <Icon
                className={`w-6 h-6 mt-1 flex-shrink-0 ${
                  isEnabled ? 'text-gold' : 'text-ivory/40'
                }`}
              />
              <div className="flex-1 text-left">
                <p className={`font-semibold ${
                  isEnabled ? 'text-ivory' : 'text-ivory/60'
                }`}>
                  {perm.name}
                  {perm.required && (
                    <span className="text-xs text-gold ml-2">(Required)</span>
                  )}
                </p>
                <p className="text-sm text-ivory/60 mt-1">{perm.description}</p>
              </div>
              <div
                className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                  isEnabled
                    ? 'bg-gold border-gold'
                    : 'border-ivory/20'
                }`}
              >
                {isEnabled && <div className="w-2 h-2 bg-dark rounded" />}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Info */}
      <div className="bg-gold/5 border border-gold/20 rounded-lg p-4 mb-6">
        <p className="text-sm text-ivory/80">
          You can change these permissions anytime in Settings. Guard Mode works best with all permissions enabled.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => window.history.back()}
          className="flex-1 px-4 py-3 text-ivory/60 font-medium rounded-lg hover:text-ivory transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-3 bg-gold text-dark font-semibold rounded-lg hover:bg-gold/90 transition-colors flex items-center justify-center gap-2"
        >
          Continue
          <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  )
}
