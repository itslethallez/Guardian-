import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Shield, Users, Mic, Clock, Settings, History, ChevronRight } from 'lucide-react'
import { AppUser } from '../../types'

interface HomeScreenProps {
  user: AppUser
}

const menuItems = [
  {
    icon: Shield,
    label: 'Start Guard Mode',
    description: 'Activate your safety session',
    path: '/app/start-guard-mode',
    color: 'text-gold',
  },
  {
    icon: Mic,
    label: 'SafePhrases',
    description: 'Manage your phrases',
    path: '/app/safe-phrases',
    color: 'text-teal',
  },
  {
    icon: Users,
    label: 'Trusted Circle',
    description: 'Manage trusted contacts',
    path: '/app/trusted-circle',
    color: 'text-teal',
  },
  {
    icon: Clock,
    label: 'Journey Mode',
    description: 'Set travel expectations',
    path: '/app/journey-mode',
    color: 'text-teal',
  },
  {
    icon: History,
    label: 'Session History',
    description: 'Review past sessions',
    path: '/app/history',
    color: 'text-ivory/60',
  },
  {
    icon: Settings,
    label: 'Settings',
    description: 'Privacy & preferences',
    path: '/app/settings',
    color: 'text-ivory/60',
  },
]

export default function HomeScreen({ user }: HomeScreenProps) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col p-6 pb-12"
    >
      {/* Header */}
      <div className="mb-8 mt-4">
        <p className="text-sm text-ivory/60 mb-1">Welcome back</p>
        <h1 className="text-3xl font-bold text-ivory">{user.name}</h1>
      </div>

      {/* Status Card */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-card border border-charcoal rounded-xl p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-ivory/60">Guard Mode Status</p>
            <p className="text-2xl font-bold text-ivory">Ready to Activate</p>
          </div>
          <div className="w-12 h-12 bg-teal/20 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-teal" />
          </div>
        </div>
        <button
          onClick={() => navigate('/app/start-guard-mode')}
          className="w-full px-4 py-3 bg-gold text-dark font-semibold rounded-lg hover:bg-gold/90 transition-colors"
        >
          Start Guard Mode
        </button>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-card border border-charcoal rounded-lg p-4 text-center"
        >
          <p className="text-2xl font-bold text-gold">{user.safePhrases.length}</p>
          <p className="text-xs text-ivory/60">SafePhrases</p>
        </motion.div>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-card border border-charcoal rounded-lg p-4 text-center"
        >
          <p className="text-2xl font-bold text-teal">{user.trustedContacts.length}</p>
          <p className="text-xs text-ivory/60">Trusted Contacts</p>
        </motion.div>
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-dark-card border border-charcoal rounded-lg p-4 text-center"
        >
          <p className="text-2xl font-bold text-ivory/60">{user.sessions.length}</p>
          <p className="text-xs text-ivory/60">Sessions</p>
        </motion.div>
      </div>

      {/* Menu */}
      <div className="space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.button
              key={item.path}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-4 p-4 bg-dark-card border border-charcoal rounded-lg hover:border-gold/30 transition-colors group"
            >
              <Icon className={`w-5 h-5 ${item.color}`} />
              <div className="flex-1 text-left">
                <p className="font-medium text-ivory">{item.label}</p>
                <p className="text-xs text-ivory/60">{item.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-ivory/40 group-hover:text-gold transition-colors" />
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
