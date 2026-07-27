export interface TrustedContact {
  id: string
  name: string
  phoneNumber: string
  email?: string
  inviteChannel?: 'sms' | 'email'
  invitedAt?: string
  acceptedAt?: string
  confirmationCode?: string
  priority: 'high' | 'medium' | 'low'
  status: 'connected' | 'pending' | 'disabled' | 'unavailable' | 'sms-only'
  receivesAlerts: {
    low: boolean
    medium: boolean
    urgent: boolean
  }
}

export interface SafePhrase {
  id: string
  phrase: string
  alternatives: string[]
  alertLevel: 'low' | 'medium' | 'urgent'
  recipients: string[] // Contact IDs
  actions: PhraseTriggerAction[]
  customMessage?: string
  isActive: boolean
}

export interface PhraseTriggerAction {
  type: 'call' | 'message' | 'location' | 'timeline' | 'escalation' | 'check-in'
  enabled: boolean
}

export interface EscalationStep {
  id: string
  order: number
  action: 'notify' | 'escalate' | 'location' | 'emergency'
  contacts?: string[]
  delaySeconds: number
  description: string
}

export interface GuardModeSession {
  id: string
  startTime: Date
  duration: 'thirty-min' | 'one-hour' | 'two-hours' | 'manual' | 'custom'
  endTime?: Date
  locationSharing: boolean
  trustedContacts: string[]
  activeSafePhrase: string[]
  checkInInterval?: number
  escalationPlan?: string
  journeyMode?: JourneySession
  note?: string
  status: 'active' | 'ended' | 'paused'
  alertsTriggered: AlertEvent[]
}

export interface JourneySession {
  id: string
  destination: string
  expectedArrival: Date
  currentLocation?: { lat: number; lng: number }
  routeSharing: boolean
  checkInGracePeriod: number
  status: 'active' | 'ended' | 'delayed'
}

export interface AlertEvent {
  id: string
  timestamp: Date
  type: 'phrase-detected' | 'check-in-request' | 'delayed-arrival' | 'manual'
  level: 'low' | 'medium' | 'urgent'
  message: string
  triggeredBy?: string
  recipients: string[]
  acknowledged: boolean
  acknowledgedBy?: string
  acknowledgedAt?: Date
}

export interface AppUser {
  id: string
  name: string
  email: string
  phoneNumber: string
  trustedContacts: TrustedContact[]
  safePhrases: SafePhrase[]
  escalationPlan: EscalationStep[]
  sessions: GuardModeSession[]
  permissions: {
    microphone: boolean
    location: boolean
    notifications: boolean
    backgroundActivity: boolean
    motion: boolean
  }
  privacySettings: {
    dataRetention: 'week' | 'month' | '3months' | 'forever'
    sessionHistory: boolean
    locationHistory: boolean
    deleteOnLogout: boolean
  }
}

export interface IncomingAlert {
  id: string
  userId: string
  userName: string
  alertLevel: 'low' | 'medium' | 'urgent'
  customMessage?: string
  currentLocation?: { lat: number; lng: number }
  batteryLevel: number
  lastLocationUpdate: Date
  sessionTimeline: AlertEvent[]
  timestamp: Date
}
