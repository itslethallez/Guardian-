import { useState, useCallback, useEffect } from 'react'
import { AppUser, TrustedContact, SafePhrase, EscalationStep, GuardModeSession } from '../types'
import { mockUser } from '../services/mockData'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

type PersistedAppState = {
  trustedContacts: TrustedContact[]
  safePhrases: SafePhrase[]
  escalationPlan: EscalationStep[]
  sessions: GuardModeSession[]
  permissions: AppUser['permissions']
  privacySettings: AppUser['privacySettings']
}

type ProfileRow = {
  name: string | null
  phone: string | null
  app_state: Partial<PersistedAppState> | null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parsePersistedAppState(value: unknown): Partial<PersistedAppState> {
  if (!isRecord(value)) {
    return {}
  }

  return {
    trustedContacts: Array.isArray(value.trustedContacts) ? (value.trustedContacts as TrustedContact[]) : undefined,
    safePhrases: Array.isArray(value.safePhrases) ? (value.safePhrases as SafePhrase[]) : undefined,
    escalationPlan: Array.isArray(value.escalationPlan) ? (value.escalationPlan as EscalationStep[]) : undefined,
    sessions: Array.isArray(value.sessions) ? (value.sessions as GuardModeSession[]) : undefined,
    permissions: isRecord(value.permissions) ? (value.permissions as AppUser['permissions']) : undefined,
    privacySettings: isRecord(value.privacySettings)
      ? (value.privacySettings as AppUser['privacySettings'])
      : undefined,
  }
}

export function useAppUser() {
  const { user: authUser } = useAuth()
  const [user, setUser] = useState<AppUser>(mockUser)
  const [loading, setLoading] = useState(true)
  const [persistenceError, setPersistenceError] = useState<string | null>(null)

  const persistUser = useCallback(
    async (nextUser: AppUser) => {
      if (!authUser) {
        return
      }

      const appState: PersistedAppState = {
        trustedContacts: nextUser.trustedContacts,
        safePhrases: nextUser.safePhrases,
        escalationPlan: nextUser.escalationPlan,
        sessions: nextUser.sessions,
        permissions: nextUser.permissions,
        privacySettings: nextUser.privacySettings,
      }

      const { error } = await supabase.from('profiles').upsert(
        {
          id: authUser.id,
          name: nextUser.name,
          phone: nextUser.phoneNumber,
          app_state: appState,
        },
        { onConflict: 'id' }
      )

      if (error) {
        setPersistenceError(error.message)
        console.error('[Sotto] Failed to save profile state:', error.message)
        return
      }

      setPersistenceError(null)
    },
    [authUser]
  )

  const applyUserUpdate = useCallback(
    (updater: (prev: AppUser) => AppUser) => {
      setUser((prev) => {
        const next = updater(prev)
        void persistUser(next)
        return next
      })
    },
    [persistUser]
  )

  // Load profile + persisted app state after auth is available
  useEffect(() => {
    let mounted = true

    const syncFromProfile = async () => {
      setLoading(true)

      if (!authUser) {
        if (!mounted) {
          return
        }

        setUser(mockUser)
        setLoading(false)
        setPersistenceError(null)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('name, phone, app_state')
        .eq('id', authUser.id)
        .maybeSingle<ProfileRow>()

      if (!mounted) {
        return
      }

      if (error) {
        setPersistenceError(error.message)
        console.error('[Sotto] Failed to load profile state:', error.message)
        setLoading(false)
        return
      }

      const persisted = parsePersistedAppState(data?.app_state)
      const metadataName = authUser.user_metadata?.name
      const resolvedName = typeof metadataName === 'string' && metadataName.trim().length > 0
        ? metadataName
        : mockUser.name

      setUser({
        ...mockUser,
        id: authUser.id,
        email: authUser.email ?? mockUser.email,
        name: data?.name ?? resolvedName,
        phoneNumber: data?.phone ?? '',
        trustedContacts: persisted.trustedContacts ?? [],
        safePhrases: persisted.safePhrases ?? [],
        escalationPlan: persisted.escalationPlan ?? [],
        sessions: persisted.sessions ?? [],
        permissions: persisted.permissions ?? mockUser.permissions,
        privacySettings: persisted.privacySettings ?? mockUser.privacySettings,
      })
      setPersistenceError(null)
      setLoading(false)
    }

    void syncFromProfile()

    return () => {
      mounted = false
    }
  }, [authUser])

  const updateUser = useCallback((updates: Partial<AppUser>) => {
    applyUserUpdate((prev) => ({ ...prev, ...updates }))
  }, [applyUserUpdate])

  const addTrustedContact = useCallback((contact: TrustedContact) => {
    applyUserUpdate((prev) => ({
      ...prev,
      trustedContacts: [...prev.trustedContacts, contact],
    }))
  }, [applyUserUpdate])

  const addSafePhrase = useCallback((phrase: SafePhrase) => {
    applyUserUpdate((prev) => ({
      ...prev,
      safePhrases: [...prev.safePhrases, phrase],
    }))
  }, [applyUserUpdate])

  const updateEscalationPlan = useCallback((plan: EscalationStep[]) => {
    applyUserUpdate((prev) => ({
      ...prev,
      escalationPlan: plan,
    }))
  }, [applyUserUpdate])

  const updatePermissions = useCallback((permissions: Partial<AppUser['permissions']>) => {
    applyUserUpdate((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, ...permissions },
    }))
  }, [applyUserUpdate])

  return {
    user,
    loading,
    persistenceError,
    updateUser,
    addTrustedContact,
    addSafePhrase,
    updateEscalationPlan,
    updatePermissions,
  }
}
