import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Shield } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    const { error: authError, requiresEmailConfirmation } = await signUp(email, password, name)
    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    if (requiresEmailConfirmation) {
      navigate('/auth/sign-in', {
        state: {
          message: 'Account created. Please verify your email, then sign in.',
        },
      })
      return
    }

    // After sign-up, go through onboarding for new users
    navigate('/app/onboarding')
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-gold" />
          </div>
          <span className="text-xl font-bold text-ivory">Guard Mode</span>
        </div>

        <h1 className="text-2xl font-bold text-ivory mb-2">Create your account</h1>
        <p className="text-ivory/60 mb-8">Set up Guard Mode in less than a minute</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-ivory mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gold/60" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                required
                className="w-full pl-10 pr-4 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-ivory mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gold/60" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-ivory mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gold/60" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-ivory mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gold/60" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold text-dark font-semibold rounded-lg hover:bg-gold/90 disabled:bg-gold/50 disabled:cursor-not-allowed transition-colors mt-2"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-ivory/60 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/auth/sign-in" className="text-gold hover:underline">
            Sign in
          </Link>
        </p>

        <p className="text-center mt-4">
          <Link to="/" className="text-ivory/40 hover:text-ivory/60 text-sm transition-colors">
            ← Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
