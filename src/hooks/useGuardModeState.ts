import { useState, useCallback } from 'react'
import { GuardModeSession, SafePhrase, TrustedContact, AlertEvent } from '../types'

interface GuardModeState {
  isActive: boolean
  currentSession: GuardModeSession | null
  timeRemaining: number
  activePhrases: SafePhrase[]
  recentAlerts: AlertEvent[]
}

export function useGuardModeState() {
  const [state, setState] = useState<GuardModeState>({
    isActive: false,
    currentSession: null,
    timeRemaining: 0,
    activePhrases: [],
    recentAlerts: [],
  })

  const startSession = useCallback((session: GuardModeSession) => {
    setState((prev) => ({
      ...prev,
      isActive: true,
      currentSession: session,
      timeRemaining: calculateTimeRemaining(session),
    }))
  }, [])

  const endSession = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isActive: false,
      currentSession: null,
      timeRemaining: 0,
    }))
  }, [])

  const extendSession = useCallback((minutes: number) => {
    setState((prev) => {
      if (!prev.currentSession) return prev
      const base = prev.currentSession.endTime ? new Date(prev.currentSession.endTime) : new Date()
      const endTime = new Date(base.getTime() + minutes * 60000)
      const session = { ...prev.currentSession, endTime }
      return {
        ...prev,
        currentSession: session,
        timeRemaining: calculateTimeRemaining(session),
      }
    })
  }, [])

  const triggerAlert = useCallback((alert: AlertEvent) => {
    setState((prev) => ({
      ...prev,
      recentAlerts: [alert, ...prev.recentAlerts],
    }))
  }, [])

  return {
    state,
    startSession,
    endSession,
    extendSession,
    triggerAlert,
  }
}

function calculateTimeRemaining(session: GuardModeSession): number {
  if (!session.endTime) return 0
  const now = new Date().getTime()
  const end = session.endTime.getTime()
  return Math.max(0, Math.floor((end - now) / 1000))
}
