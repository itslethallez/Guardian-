import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { acceptInvite } from '../lib/invites'

type AcceptState =
  | { status: 'idle' }
  | { status: 'accepting' }
  | { status: 'success'; inviterName: string }
  | { status: 'error'; message: string }

export default function JoinPage() {
  const { token } = useParams<{ token?: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { session, loading: authLoading } = useAuth()
  const [state, setState] = useState<AcceptState>({ status: 'idle' })

  const stateCode = (location.state as { code?: string } | null)?.code

  const runAccept = async (payload: { token?: string; code?: string }) => {
    setState({ status: 'accepting' })
    try {
      const result = await acceptInvite(payload)
      setState({ status: 'success', inviterName: result.inviterName })
    } catch (err) {
      setState({
        status: 'error',
        message: err instanceof Error ? err.message : 'This invite is no longer valid.',
      })
    }
  }

  useEffect(() => {
    if (authLoading || !session || state.status !== 'idle') return
    if (token) {
      void runAccept({ token })
    } else if (stateCode) {
      void runAccept({ code: stateCode })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, session, token, stateCode])

  const handleCodeSubmit = (code: string) => {
    if (!session) {
      navigate('/auth/sign-in', { state: { from: '/join', code } })
      return
    }
    void runAccept({ code })
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-ivory/60 text-sm">Loading…</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm text-center"
        >
          <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-7 h-7 text-gold" />
          </div>
          <h1 className="text-2xl font-bold text-ivory mb-2">
            You've been invited to a safety circle
          </h1>
          <p className="text-ivory/60 mb-8">
            Open Guardian and sign in (or create an account) to accept and start receiving alerts.
          </p>
          <div className="space-y-3 mb-8">
            <button
              onClick={() =>
                navigate('/auth/sign-in', {
                  state: { from: token ? `/join/${token}` : '/join' },
                })
              }
              className="w-full py-3 bg-gold text-dark font-semibold rounded-lg hover:bg-gold/90 transition-colors"
            >
              Sign in to accept
            </button>
            <button
              onClick={() =>
                navigate('/auth/sign-up', {
                  state: { from: token ? `/join/${token}` : '/join' },
                })
              }
              className="w-full py-3 border border-gold text-gold font-semibold rounded-lg hover:bg-gold/10 transition-colors"
            >
              Create an account
            </button>
          </div>
          <CodeEntry onSubmit={handleCodeSubmit} />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm text-center"
      >
        {state.status === 'accepting' && (
          <p className="text-ivory/60">Connecting you to your safety circle…</p>
        )}

        {state.status === 'success' && (
          <>
            <div className="w-14 h-14 rounded-full bg-teal/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-7 h-7 text-teal" />
            </div>
            <h1 className="text-2xl font-bold text-ivory mb-2">You're connected</h1>
            <p className="text-ivory/60 mb-8">
              You're now part of {state.inviterName}'s safety circle and will be notified if they
              need help.
            </p>
            <button
              onClick={() => navigate('/app/home')}
              className="w-full py-3 bg-gold text-dark font-semibold rounded-lg hover:bg-gold/90 transition-colors"
            >
              Continue to Guardian
            </button>
          </>
        )}

        {(state.status === 'error' || state.status === 'idle') && (
          <>
            <div className="w-14 h-14 rounded-full bg-amber/20 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-7 h-7 text-amber" />
            </div>
            <h1 className="text-2xl font-bold text-ivory mb-2">
              {state.status === 'error' ? "That didn't work" : 'Enter your invite code'}
            </h1>
            {state.status === 'error' && <p className="text-ivory/60 mb-6">{state.message}</p>}
            <CodeEntry onSubmit={handleCodeSubmit} />
          </>
        )}
      </motion.div>
    </div>
  )
}

function CodeEntry({ onSubmit }: { onSubmit: (code: string) => void }) {
  const [code, setCode] = useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (code.trim()) onSubmit(code.trim().toUpperCase())
      }}
      className="space-y-3"
    >
      <label className="block text-sm font-medium text-ivory/70 text-left">
        Have a code instead?
      </label>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="GRD-XXXXXX"
        className="w-full px-4 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold text-center tracking-widest"
      />
      <button
        type="submit"
        disabled={!code.trim()}
        className="w-full py-3 border border-gold text-gold font-semibold rounded-lg hover:bg-gold/10 disabled:opacity-50 transition-colors"
      >
        Enter code
      </button>
    </form>
  )
}
