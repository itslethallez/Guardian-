import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'

interface SettingsDetailScreenProps {
  title: string
  description: string
}

export default function SettingsDetailScreen({ title, description }: SettingsDetailScreenProps) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col p-6 pb-12"
    >
      <button
        onClick={() => navigate('/app/settings')}
        className="inline-flex items-center gap-2 text-ivory/70 hover:text-ivory transition-colors mt-2 mb-6"
      >
        <ChevronLeft size={18} />
        Back to Settings
      </button>

      <h1 className="text-3xl font-bold text-ivory mb-3">{title}</h1>
      <p className="text-ivory/70 mb-8">{description}</p>

      <div className="bg-dark-card border border-charcoal rounded-lg p-5">
        <p className="text-sm text-ivory/80">
          {title} controls aren't available yet in this version of Sotto.
        </p>
      </div>
    </motion.div>
  )
}
