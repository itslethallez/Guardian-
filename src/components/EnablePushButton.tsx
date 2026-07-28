import { useState } from 'react'
import { Bell, BellRing } from 'lucide-react'
import { enablePush, EnablePushResult } from '../lib/push'

interface EnablePushButtonProps {
  className?: string
  label?: string
}

export default function EnablePushButton({
  className = '',
  label = 'Enable safety alerts',
}: EnablePushButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | EnablePushResult>('idle')

  const handleClick = async () => {
    setStatus('loading')
    const result = await enablePush()
    setStatus(result)
  }

  if (status === 'subscribed') {
    return (
      <div className={`flex items-center gap-2 text-sm text-teal ${className}`}>
        <BellRing size={16} /> Safety alerts enabled on this device
      </div>
    )
  }

  return (
    <div className={className}>
      <button
        onClick={handleClick}
        disabled={status === 'loading'}
        className="w-full px-4 py-3 bg-teal text-dark font-semibold rounded-lg hover:bg-teal-light disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
      >
        <Bell size={16} />
        {status === 'loading' ? 'Requesting…' : label}
      </button>
      {status === 'denied' && (
        <p className="text-xs text-amber mt-2">
          Notifications are blocked for Guardian. Enable them in your browser or device settings to
          receive alerts.
        </p>
      )}
      {status === 'unsupported' && (
        <p className="text-xs text-ivory/60 mt-2">
          This device doesn't support push notifications yet — on iOS, install Guardian to your home
          screen first (Share → Add to Home Screen), then open it from there and try again.
        </p>
      )}
    </div>
  )
}
