import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface PushTestResult {
  id: string
  ok: boolean
  status: number
  error?: string
}

// Temporary dev-only loop-verification button — not part of the normal user
// flow. Hidden automatically in production builds (import.meta.env.DEV).
export default function DevPushTestButton() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<PushTestResult[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!import.meta.env.DEV) {
    return null
  }

  const handleClick = async () => {
    setLoading(true)
    setError(null)
    setResults(null)

    const { data, error: invokeError } = await supabase.functions.invoke('push-test', { body: {} })

    setLoading(false)

    if (invokeError) {
      setError(invokeError.message)
      return
    }

    setResults((data?.results as PushTestResult[]) ?? [])
    if (data?.error) {
      setError(data.error as string)
    }
  }

  return (
    <div className="mt-4 p-3 border border-dashed border-ivory/20 rounded-lg">
      <p className="text-xs text-ivory/40 mb-2 uppercase tracking-wide">Dev only</p>
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full px-4 py-2 border border-ivory/30 text-ivory/70 text-sm font-medium rounded-lg hover:bg-ivory/5 disabled:opacity-60 transition-colors"
      >
        {loading ? 'Sending…' : 'Send test push'}
      </button>
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
      {results && results.length > 0 && (
        <ul className="text-xs text-ivory/60 mt-2 space-y-1">
          {results.map((r) => (
            <li key={r.id}>
              {r.id.slice(0, 8)}… — {r.ok ? 'delivered' : `failed (status ${r.status})`}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
