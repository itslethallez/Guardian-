import { Navigate, Routes, Route, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAppUser } from '../hooks/useAppUser'
import { useGuardModeState } from '../hooks/useGuardModeState'
import OnboardingScreen from './app/OnboardingScreen'
import AccountCreationScreen from './app/AccountCreationScreen'
import PermissionSetupScreen from './app/PermissionSetupScreen'
import HomeScreen from './app/HomeScreen'
import StartGuardModeScreen from './app/StartGuardModeScreen'
import GuardModeActiveScreen from './app/GuardModeActiveScreen'
import SafePhraseBuilderScreen from './app/SafePhraseBuilderScreen'
import TrustedCircleScreen from './app/TrustedCircleScreen'
import EscalationBuilderScreen from './app/EscalationBuilderScreen'
import IncomingAlertScreen from './app/IncomingAlertScreen'
import JourneyModeScreen from './app/JourneyModeScreen'
import SessionHistoryScreen from './app/SessionHistoryScreen'
import SettingsScreen from './app/SettingsScreen'
import SettingsDetailScreen from './app/SettingsDetailScreen'

export default function AppPrototype() {
  const navigate = useNavigate()
  const {
    user,
    loading,
    persistenceError,
    addTrustedContact,
    addSafePhrase,
    updateEscalationPlan,
    updatePermissions,
  } = useAppUser()
  const { state, startSession, endSession, extendSession, triggerAlert } = useGuardModeState()

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-ivory/60 text-sm">Loading your profile…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* App container */}
      <div className="mx-auto max-w-md bg-dark-card min-h-screen relative">
        {persistenceError && (
          <div className="mx-4 mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            We could not sync your profile changes right now: {persistenceError}
          </div>
        )}

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-50 p-2 hover:bg-charcoal rounded-lg transition-colors md:block hidden"
        >
          <ArrowLeft size={20} className="text-gold" />
        </button>

        {/* Routes */}
        <Routes>
          <Route path="/onboarding" element={<OnboardingScreen />} />
          <Route path="/account-creation" element={<AccountCreationScreen />} />
          <Route path="/permissions" element={<PermissionSetupScreen onUpdate={updatePermissions} />} />
          <Route path="/home" element={<HomeScreen user={user} />} />
          <Route path="/start-guard-mode" element={<StartGuardModeScreen onStart={startSession} />} />
          <Route
            path="/guard-mode-active"
            element={
              <GuardModeActiveScreen
                session={state.currentSession}
                onEnd={endSession}
                onExtend={() => extendSession(30)}
              />
            }
          />
          <Route path="/safe-phrases" element={<SafePhraseBuilderScreen user={user} onAdd={addSafePhrase} />} />
          <Route path="/trusted-circle" element={<TrustedCircleScreen user={user} onAdd={addTrustedContact} />} />
          <Route path="/escalation" element={<EscalationBuilderScreen onUpdate={updateEscalationPlan} />} />
          <Route path="/incoming-alert" element={<IncomingAlertScreen onTrigger={triggerAlert} />} />
          <Route path="/journey-mode" element={<JourneyModeScreen />} />
          <Route path="/history" element={<SessionHistoryScreen />} />
          <Route path="/settings" element={<SettingsScreen user={user} />} />
          <Route
            path="/settings/notifications"
            element={
              <SettingsDetailScreen
                title="Notifications"
                description="Manage how and when Sotto alerts and check-ins notify you."
              />
            }
          />
          <Route
            path="/settings/security"
            element={
              <SettingsDetailScreen
                title="Security"
                description="Review account protection and sign-in safety settings."
              />
            }
          />
          <Route
            path="/settings/privacy"
            element={
              <SettingsDetailScreen
                title="Privacy Controls"
                description="Control retention, visibility, and data-sharing behavior for Sotto Mode."
              />
            }
          />
          <Route path="*" element={<Navigate to="/app/home" replace />} />
        </Routes>
      </div>
    </div>
  )
}
