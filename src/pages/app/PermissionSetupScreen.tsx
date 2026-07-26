import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Mic, MapPin, Bell, Zap, Activity } from 'lucide-react'
import { AppUser } from '../../types'

interface PermissionSetupScreenProps {
  onUpdate: (permissions: Partial<AppUser['permissions']>) => void
}

type PermissionKey = keyof AppUser['permissions']
type PermissionRequestStatus = 'idle' | 'granted' | 'denied' | 'unsupported'

interface PermissionDefinition {
  id: PermissionKey
  name: string
  icon: typeof Mic
  description: string
  required: boolean
}

const permissions: PermissionDefinition[] = [
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

const defaultPermissions: Record<PermissionKey, boolean> = {
  microphone: false,
  location: false,
  notifications: false,
  backgroundActivity: false,
  motion: false,
}

export default function PermissionSetupScreen({
  onUpdate,
}: PermissionSetupScreenProps) {
  const navigate = useNavigate()
  const [selectedPermissions, setSelectedPermissions] = useState<Record<PermissionKey, boolean>>(
    defaultPermissions
  )
  const [statuses, setStatuses] = useState<Record<PermissionKey, PermissionRequestStatus>>({
    microphone: 'idle',
    location: 'idle',
    notifications: 'idle',
    backgroundActivity: 'idle',
    motion: 'idle',
  })
  const [activeRequest, setActiveRequest] = useState<PermissionKey | null>(null)
  const [permissionError, setPermissionError] = useState<string | null>(null)

  const requiredPermissionIds = useMemo(
    () => permissions.filter((permission) => permission.required).map((permission) => permission.id),
    []
  )

  const areRequiredGranted = requiredPermissionIds.every((id) => selectedPermissions[id])

  const updatePermission = (
    id: PermissionKey,
    enabled: boolean,
    status: PermissionRequestStatus,
    errorMessage?: string
  ) => {
    setSelectedPermissions((prev) => ({ ...prev, [id]: enabled }))
    setStatuses((prev) => ({ ...prev, [id]: status }))
    setPermissionError(errorMessage ?? null)
  }

  const requestMicrophone = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      updatePermission('microphone', false, 'unsupported', 'Microphone access is not supported on this device/browser.')
      return
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach((track) => track.stop())
    updatePermission('microphone', true, 'granted')
  }

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      updatePermission('location', false, 'unsupported', 'Location access is not supported on this device/browser.')
      return
    }

    await new Promise<void>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve(),
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
      )
    })

    updatePermission('location', true, 'granted')
  }

  const requestNotifications = async () => {
    if (!('Notification' in window)) {
      updatePermission('notifications', false, 'unsupported', 'Notifications are not supported on this device/browser.')
      return
    }

    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      updatePermission('notifications', true, 'granted')
      return
    }

    updatePermission('notifications', false, 'denied', 'Notification permission was denied.')
  }

  const requestBackgroundActivity = async () => {
    const supportsWakeLock = 'wakeLock' in navigator
    if (!supportsWakeLock) {
      updatePermission(
        'backgroundActivity',
        false,
        'unsupported',
        'Background activity support is limited by this browser. Guard Mode may pause when the app is not active.'
      )
      return
    }

    updatePermission('backgroundActivity', true, 'granted')
  }

  const requestMotion = async () => {
    if (!('DeviceMotionEvent' in window)) {
      updatePermission('motion', false, 'unsupported', 'Motion sensors are not available on this device.')
      return
    }

    const eventWithPermission = DeviceMotionEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>
    }

    if (typeof eventWithPermission.requestPermission !== 'function') {
      updatePermission('motion', true, 'granted')
      return
    }

    const permission = await eventWithPermission.requestPermission()
    if (permission === 'granted') {
      updatePermission('motion', true, 'granted')
      return
    }

    updatePermission('motion', false, 'denied', 'Motion permission was denied.')
  }

  const requestPermission = async (id: PermissionKey) => {
    setActiveRequest(id)

    try {
      switch (id) {
        case 'microphone':
          await requestMicrophone()
          break
        case 'location':
          await requestLocation()
          break
        case 'notifications':
          await requestNotifications()
          break
        case 'backgroundActivity':
          await requestBackgroundActivity()
          break
        case 'motion':
          await requestMotion()
          break
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Permission request failed.'
      updatePermission(id, false, 'denied', message)
    } finally {
      setActiveRequest(null)
    }
  }

  const handlePermissionClick = (permission: PermissionDefinition) => {
    if (activeRequest) {
      return
    }

    if (!permission.required && selectedPermissions[permission.id]) {
      updatePermission(permission.id, false, 'idle')
      return
    }

    void requestPermission(permission.id)
  }

  const handleSubmit = () => {
    if (!areRequiredGranted) {
      setPermissionError('Please enable all required permissions before continuing.')
      return
    }

    onUpdate(selectedPermissions)
    navigate('/app/home')
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
          const status = statuses[perm.id]
          const isBusy = activeRequest === perm.id

          return (
            <motion.button
              key={perm.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => handlePermissionClick(perm)}
              disabled={Boolean(activeRequest)}
              className={`w-full flex items-start gap-4 p-4 rounded-lg border transition-all ${
                isEnabled
                  ? 'bg-gold/5 border-gold/30'
                  : 'bg-charcoal/30 border-charcoal/50'
              } ${
                activeRequest
                  ? 'cursor-not-allowed opacity-80'
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
                {status === 'denied' && (
                  <p className="text-xs text-red-300 mt-1">Denied. Tap to try again.</p>
                )}
                {status === 'unsupported' && (
                  <p className="text-xs text-amber mt-1">Not supported on this browser/device.</p>
                )}
              </div>
              <div
                className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                  isEnabled
                    ? 'bg-gold border-gold'
                    : 'border-ivory/20'
                }`}
              >
                {isBusy ? (
                  <div className="w-2 h-2 bg-gold rounded animate-pulse" />
                ) : (
                  isEnabled && <div className="w-2 h-2 bg-dark rounded" />
                )}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Info */}
      <div className="bg-gold/5 border border-gold/20 rounded-lg p-4 mb-6">
        <p className="text-sm text-ivory/80">
          Required permissions must be granted to continue. For best results on phones, use HTTPS and allow prompts when requested.
        </p>
      </div>
      {permissionError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-200">{permissionError}</p>
        </div>
      )}

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
          disabled={!areRequiredGranted}
          className="flex-1 px-4 py-3 bg-gold text-dark font-semibold rounded-lg hover:bg-gold/90 disabled:bg-gold/50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          Continue
          <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  )
}
