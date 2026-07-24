import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Download, Trash2, Calendar, Clock } from 'lucide-react'

const mockSessions = [
  {
    id: 'session-001',
    date: '2024-01-15',
    time: '19:30',
    duration: '1 hour',
    status: 'completed',
    alerts: 0,
    note: 'First date at The Blue Room',
  },
  {
    id: 'session-002',
    date: '2024-01-14',
    time: '14:00',
    duration: '2 hours',
    status: 'completed',
    alerts: 1,
    note: 'Property inspection - Downtown',
  },
  {
    id: 'session-003',
    date: '2024-01-13',
    time: '22:15',
    duration: '45 minutes',
    status: 'completed',
    alerts: 0,
    note: 'Late-night commute home',
  },
]

export default function SessionHistoryScreen() {
  const navigate = useNavigate()
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

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
      <div className="space-y-3 mb-8">
        {mockSessions.map((session) => (
          <motion.button
            key={session.id}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={() => setSelectedSession(selectedSession === session.id ? null : session.id)}
            className="w-full text-left bg-dark-card border border-charcoal rounded-lg p-4 hover:border-gold/30 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-ivory">{session.note}</p>
                <div className="flex items-center gap-4 text-xs text-ivory/60 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {session.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {session.time}
                  </span>
                </div>
              </div>
              <span className="px-2 py-1 bg-teal/20 text-teal rounded text-xs font-medium">
                {session.duration}
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
                  <p className="mb-2">Status: <span className="text-teal font-medium">Completed Safely</span></p>
                  <p>Alerts Triggered: <span className="text-ivory font-medium">{session.alerts}</span></p>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 text-xs border border-gold text-gold font-medium rounded hover:bg-gold/10 transition-colors flex items-center justify-center gap-1">
                    <Download size={12} /> Export
                  </button>
                  <button className="flex-1 px-3 py-2 text-xs text-ivory/60 font-medium rounded hover:text-red-500 transition-colors flex items-center justify-center gap-1">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Info */}
      <div className="bg-gold/5 border border-gold/20 rounded-lg p-4">
        <p className="text-sm text-ivory/80">
          📑 Sessions are stored securely. You can delete individual sessions or clear your history anytime in Settings.
        </p>
      </div>
    </motion.div>
  )
}
