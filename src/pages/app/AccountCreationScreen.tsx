import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Lock, Mail, Phone, User } from 'lucide-react'

export default function AccountCreationScreen() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/app/permissions')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col p-6"
    >
      {/* Header */}
      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold text-ivory mb-2">Create Your Account</h1>
        <p className="text-ivory/70">Set up Guard Mode in less than a minute</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-ivory mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-gold/60" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Alex Johnson"
              className="w-full pl-10 pr-4 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
              required
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
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="alex@example.com"
              className="w-full pl-10 pr-4 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-ivory mb-2">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 w-5 h-5 text-gold/60" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              className="w-full pl-10 pr-4 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
              required
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
              required
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
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
              required
            />
          </div>
        </div>

        {/* Terms */}
        <label className="flex items-start gap-3 my-6">
          <input
            type="checkbox"
            name="acceptedTerms"
            checked={formData.acceptedTerms}
            onChange={handleChange}
            className="w-5 h-5 accent-gold rounded mt-0.5"
            required
          />
          <span className="text-sm text-ivory/70">
            I understand that Guard Mode is a personal safety tool and does not guarantee emergency response. I've read and accept the terms.
          </span>
        </label>

        {/* Submit */}
        <div className="pt-4 flex gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex-1 px-4 py-3 text-ivory/60 font-medium rounded-lg hover:text-ivory transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!formData.acceptedTerms}
            className="flex-1 px-4 py-3 bg-gold text-dark font-semibold rounded-lg hover:bg-gold/90 disabled:bg-gold/50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            Continue
            <ChevronRight size={18} />
          </button>
        </div>
      </form>
    </motion.div>
  )
}
