import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Plus, Mail, Phone, Users, CheckCircle, X } from 'lucide-react'
import { TrustedContact, AppUser } from '../../types'

const countries = [
  { code: 'AU', name: 'Australia', dialCode: '+61', example: '412 345 678' },
  { code: 'US', name: 'United States', dialCode: '+1', example: '(555) 987-6543' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', example: '7700 900123' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', example: '21 123 4567' },
] as const

type CountryCode = (typeof countries)[number]['code']

interface TrustedCircleScreenProps {
  user: AppUser
  onAdd: (contact: TrustedContact) => void
}

export default function TrustedCircleScreen({
  user,
  onAdd,
}: TrustedCircleScreenProps) {
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    country: 'AU' as CountryCode,
    phoneNumber: '',
    email: '',
  })
  const selectedCountry =
    countries.find((country) => country.code === formData.country) ?? countries[0]

  const handleAdd = () => {
    if (!formData.name.trim() || !formData.phoneNumber.trim()) return
    const trimmedPhone = formData.phoneNumber.trim()
    const normalizedPhone = trimmedPhone.startsWith('+')
      ? trimmedPhone
      : `${selectedCountry.dialCode} ${trimmedPhone}`

    const newContact: TrustedContact = {
      id: `contact-${Date.now()}`,
      name: formData.name,
      phoneNumber: normalizedPhone,
      email: formData.email,
      priority: 'high',
      status: 'pending',
      receivesAlerts: { low: true, medium: true, urgent: true },
    }

    onAdd(newContact)
    setFormData({ name: '', country: formData.country, phoneNumber: '', email: '' })
    setShowForm(false)
  }

  const statusColors: Record<string, string> = {
    connected: 'bg-teal/20 text-teal',
    pending: 'bg-amber/20 text-amber',
    disabled: 'bg-charcoal text-ivory/60',
    unavailable: 'bg-red-500/20 text-red-500',
    'sms-only': 'bg-teal/10 text-teal/80',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col p-6 pb-12"
    >
      {/* Header */}
      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold text-ivory mb-2">Trusted Circle</h1>
        <p className="text-ivory/70">People who receive your alerts</p>
      </div>

      {/* Existing Contacts */}
      {user.trustedContacts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-ivory mb-4">Your Contacts ({user.trustedContacts.length})</h2>
          <div className="space-y-3">
            {user.trustedContacts.map((contact) => (
              <motion.div
                key={contact.id}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-dark-card border border-charcoal rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-semibold text-ivory">{contact.name}</p>
                    <div className="flex items-center gap-2 text-xs text-ivory/60 mt-1">
                      <Phone size={12} /> {contact.phoneNumber}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${statusColors[contact.status] || ''}`}>
                    {contact.status === 'connected' && '✓'}
                    {contact.status === 'pending' && '⏳'}
                    {contact.status}
                  </span>
                </div>
                <div className="flex gap-2 text-xs text-ivory/60">
                  {contact.receivesAlerts.low && <span>Low •</span>}
                  {contact.receivesAlerts.medium && <span>Medium •</span>}
                  {contact.receivesAlerts.urgent && <span>Urgent</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Add Contact */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full px-4 py-4 border border-dashed border-gold text-gold font-semibold rounded-lg hover:bg-gold/5 transition-colors flex items-center justify-center gap-2 mb-6"
        >
          <Plus size={18} /> Add Trusted Contact
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-card border border-charcoal rounded-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-ivory">Add Contact</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-ivory/60 hover:text-ivory transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-ivory mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Sarah Mitchell"
                className="w-full px-4 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-ivory mb-2">Phone Number</label>
              <div className="grid grid-cols-[150px_1fr] gap-3">
                <select
                  value={formData.country}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, country: e.target.value as CountryCode }))
                  }
                  className="px-3 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory focus:outline-none focus:border-gold"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name} ({country.dialCode})
                    </option>
                  ))}
                </select>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gold font-semibold">
                    {selectedCountry.dialCode}
                  </div>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder={selectedCountry.example}
                    className="w-full pl-16 pr-4 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-ivory mb-2">Email (Optional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="sarah@example.com"
                className="w-full px-4 py-3 bg-charcoal border border-charcoal/50 rounded-lg text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-3 text-ivory/60 font-medium rounded-lg hover:text-ivory transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!formData.name.trim() || !formData.phoneNumber.trim()}
                className="flex-1 px-4 py-3 bg-gold text-dark font-semibold rounded-lg hover:bg-gold/90 disabled:bg-gold/50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Add
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Info Card */}
      <div className="bg-gold/5 border border-gold/20 rounded-lg p-4">
        <p className="text-sm text-ivory/80">
          💡 Invited contacts can join Guard Mode to receive your alerts. SMS fallback is available for contacts without the app.
        </p>
      </div>
    </motion.div>
  )
}
