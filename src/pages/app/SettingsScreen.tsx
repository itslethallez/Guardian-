import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, LogOut, Trash2, Bell, Shield, Database, ChevronRight } from 'lucide-react'
import { AppUser } from '../../types'
import { useAuth } from '../../contexts/AuthContext'

interface SettingsScreenProps {
  user: AppUser
}

const settingsSections = [
  {
    icon: Shield,
    label: 'Sotto Phrases',
    description: 'Manage your safety phrases',
    path: '/app/safe-phrases',
  },
  {
    icon: Shield,
    label: 'Trusted Circle',
    description: 'Manage your trusted contacts',
    path: '/app/trusted-circle',
  },
  {
    icon: Shield,
    label: 'Escalation Plan',
    description: 'Configure your response steps',
    path: '/app/escalation',
  },
  {
    icon: Bell,
    label: 'Notifications',
    description: 'Control alert preferences',
    path: '/app/settings/notifications',
  },
  {
    icon: Lock,
    label: 'Security',
    description: 'Biometric & passcode',
    path: '/app/settings/security',
  },
  {
    icon: Database,
    label: 'Privacy Controls',
    description: 'Data retention & deletion',
    path: '/app/settings/privacy',
  },
]

export default function SettingsScreen({ user }: SettingsScreenProps) {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [showDeleteWarning, setShowDeleteWarning] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth/sign-in')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col p-6 pb-12"
    >
      {/* Header */}
      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold text-ivory mb-2">Settings</h1>
        <p className="text-ivory/70">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="bg-dark-card border border-charcoal rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-ivory mb-4">Account</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-ivory/60">Name</p>
            <p className="text-lg font-medium text-ivory">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-ivory/60">Email</p>
            <p className="text-lg font-medium text-ivory">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-ivory/60">Phone</p>
            <p className="text-lg font-medium text-ivory">{user.phoneNumber}</p>
          </div>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="space-y-2 mb-8">
        {settingsSections.map((section) => {
          const Icon = section.icon
          return (
            <motion.button
              key={section.label}
              whileHover={{ x: 4 }}
              onClick={() => navigate(section.path)}
              className="w-full flex items-center gap-4 p-4 bg-dark-card border border-charcoal rounded-lg hover:border-gold/30 transition-colors text-left"
            >
              <Icon className="w-5 h-5 text-gold flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-ivory">{section.label}</p>
                <p className="text-xs text-ivory/60">{section.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-ivory/40" />
            </motion.button>
          )
        })}
      </div>

      {/* Danger Zone */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-ivory mb-4">Advanced</h2>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 p-4 bg-dark-card border border-charcoal rounded-lg hover:border-gold/30 transition-colors">
          <LogOut className="w-5 h-5 text-gold" />
          <div className="text-left flex-1">
            <p className="font-medium text-ivory">Sign Out</p>
            <p className="text-xs text-ivory/60">Clear your current session</p>
          </div>
        </button>
        <button
          onClick={() => setShowDeleteWarning(true)}
          className="w-full flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg hover:border-red-500/50 transition-colors"
        >
          <Trash2 className="w-5 h-5 text-red-500" />
          <div className="text-left flex-1">
            <p className="font-medium text-red-500">Delete Account</p>
            <p className="text-xs text-red-500/80">Permanently remove all data</p>
          </div>
        </button>
      </div>

      {/* Delete Warning */}
      {showDeleteWarning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-dark-card border border-red-500/30 rounded-lg p-6 max-w-sm"
          >
            <p className="text-lg font-bold text-red-500 mb-3">Delete Account?</p>
            <p className="text-ivory/80 mb-6">
              This action cannot be undone. All your data, sessions, and settings will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteWarning(false)}
                className="flex-1 px-4 py-2 text-ivory/60 font-medium rounded-lg hover:text-ivory transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-red-500/20 text-red-500 font-semibold rounded-lg hover:bg-red-500/30 transition-colors">
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
