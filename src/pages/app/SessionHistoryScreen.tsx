import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Calendar, Clock, History } from 'lucide-react'
import { AppUser } from '../../types'

interface SessionHistoryScreenProps {
  user: AppUser
  onDelete: (sessionId: string) => void
}

const durationLabels: Record<string, string> = {
  'thirty-min': '30 minutes',
  'one-hour': '1 hour',
  'two-hours': '2 hours',
  manual: 'Until stopped',
  custom: 'Journey',
}

export default function SessionHistoryScreen({ user, onDelete }: SessionHistoryScreenProps) {
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  const sessions = [...user.sessions].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col p-6 pb-12"
    >
      {/* Header */}
      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold text-ivory mb-2">Session History</h1>
        <p className="text-ivory/70">Review your past safety sessions</p>
      </div>

      {/* Sessions */}
      {sessions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="w-14 h-14 rounded-full bg-charcoal flex items-center justify-center mb-4">
            <History className="w-6 h-6 text-ivory/40" />
          </div>
          <p className="text-ivory/70 font-medium mb-1">No sessions yet</p>
          <p className="text-sm text-ivory/50 max-w-xs">
            Sessions you start and complete with Sotto Mode or Journey Mode will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {sessions.map((session) => (
            <motion.button
              key={session.id}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              onClick={() => setSelectedSession(selectedSession === session.id ? null : session.id)}
              className="w-full text-left bg-dark-card border border-charcoal rounded-lg p-4 hover:border-gold/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-ivory">{session.note || 'Safety session'}</p>
                  <div className="flex items-center gap-4 text-xs text-ivory/60 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {new Date(session.startTime).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-1 bg-teal/20 text-teal rounded text-xs font-medium whitespace-nowrap">
                  {durationLabels[session.duration] ?? session.duration}
                </span>
              </div>

              {/* Expanded Details */}
              {selectedSession === session.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-charcoal/50 space-y-3"
                >
                  <div className="text-sm text-ivory/70">
                    <p className="mb-2">
                      Status:{' '}
                      <span className="text-teal font-medium">
                        {session.status === 'ended' ? 'Completed' : session.status}
                      </span>
                    </p>
                    <p>Alerts Triggered: <span className="text-ivory font-medium">{session.alertsTriggered.length}</span></p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedSession(null)
                      onDelete(session.id)
                    }}
                    className="w-full px-3 py-2 text-xs text-ivory/60 font-medium rounded hover:text-red-500 transition-colors flex items-center justify-center gap-1 border border-charcoal"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="bg-gold/5 border border-gold/20 rounded-lg p-4">
        <p className="text-sm text-ivory/80">
          📑 Sessions are stored in your account. You can delete individual sessions anytime.
        </p>
      </div>
    </motion.div>
  )
}
