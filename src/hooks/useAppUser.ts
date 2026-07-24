import { useState, useCallback } from 'react'
import { AppUser, TrustedContact, SafePhrase, EscalationStep } from '../types'
import { mockUser } from '../services/mockData'

export function useAppUser() {
  const [user, setUser] = useState<AppUser>(mockUser)

  const updateUser = useCallback((updates: Partial<AppUser>) => {
    setUser((prev) => ({ ...prev, ...updates }))
  }, [])

  const addTrustedContact = useCallback((contact: TrustedContact) => {
    setUser((prev) => ({
      ...prev,
      trustedContacts: [...prev.trustedContacts, contact],
    }))
  }, [])

  const addSafePhrase = useCallback((phrase: SafePhrase) => {
    setUser((prev) => ({
      ...prev,
      safePhrases: [...prev.safePhrases, phrase],
    }))
  }, [])

  const updateEscalationPlan = useCallback((plan: EscalationStep[]) => {
    setUser((prev) => ({
      ...prev,
      escalationPlan: plan,
    }))
  }, [])

  const updatePermissions = useCallback((permissions: Partial<AppUser['permissions']>) => {
    setUser((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, ...permissions },
    }))
  }, [])

  return {
    user,
    updateUser,
    addTrustedContact,
    addSafePhrase,
    updateEscalationPlan,
    updatePermissions,
  }
}
