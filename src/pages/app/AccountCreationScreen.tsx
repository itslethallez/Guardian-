import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Lock, Mail, Phone, User } from 'lucide-react'

const countries = [
  { code: 'AU', name: 'Australia', dialCode: '+61', example: '412 345 678' },
  { code: 'US', name: 'United States', dialCode: '+1', example: '(555) 123-4567' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', example: '7700 900123' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', example: '21 123 4567' },
] as const

type CountryCode = (typeof countries)[number]['code']

export default function AccountCreationScreen() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: 'AU' as CountryCode,
    phone: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  })

  const selectedCountry = countries.find((country) => country.code === formData.country) ?? countries[0]

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
        <p className="text-ivory/70">Set up Sotto in less than a minute</p>
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
          <div className="grid grid-cols-[140px_1fr] gap-3">
            <div>
              <label className="block text-xs text-ivory/60 mb-2">Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, country: e.target.value as CountryCode }))
                }
                className="w-full px-3 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory focus:outline-none focus:border-gold"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name} ({country.dialCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-ivory/60 mb-2">Mobile</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gold/60" />
                <div className="absolute left-10 top-1/2 -translate-y-1/2 text-xs text-gold font-semibold">
                  {selectedCountry.dialCode}
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={selectedCountry.example}
                  className="w-full pl-24 pr-4 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                  required
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-ivory/60 mt-2">
            We use your country to format the phone number and future SMS settings more cleanly.
          </p>
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
            I understand that Sotto is a personal safety tool and does not guarantee emergency response. I've read and accept the terms.
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
