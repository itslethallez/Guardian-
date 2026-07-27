import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  Pause,
  RefreshCcw,
  Shield,
  Mic,
  MapPin,
  Bell,
  Lock,
  Users,
  Smartphone,
  Sparkles,
  AlertTriangle,
  MessageSquare,
  Phone,
  Navigation2,
  Cog,
} from 'lucide-react'

type SimulationStepKey =
  | 'landing'
  | 'signup'
  | 'permissions'
  | 'safephrase'
  | 'guard'
  | 'alert'
  | 'settings'

interface SimulationStep {
  key: SimulationStepKey
  title: string
  description: string
  icon: typeof Sparkles
}

const steps: SimulationStep[] = [
  {
    key: 'landing',
    title: 'Landing page',
    description: 'Check the hero, CTA hierarchy, and visual direction.',
    icon: Sparkles,
  },
  {
    key: 'signup',
    title: 'Sign-up flow',
    description: 'Verify country, mobile, and account setup inputs.',
    icon: Smartphone,
  },
  {
    key: 'permissions',
    title: 'Permissions setup',
    description: 'Confirm required phone permissions and prompts.',
    icon: Lock,
  },
  {
    key: 'safephrase',
    title: 'SafePhrase test mode',
    description: 'Simulate detection and local acknowledgement.',
    icon: Mic,
  },
  {
    key: 'guard',
    title: 'Guard Mode active',
    description: 'Inspect the live session state and time remaining.',
    icon: Shield,
  },
  {
    key: 'alert',
    title: 'Incoming alert',
    description: 'Review contact actions and response options.',
    icon: Bell,
  },
  {
    key: 'settings',
    title: 'Settings',
    description: 'Check account, privacy, and sign-out controls.',
    icon: Cog,
  },
]

const featureChecklist = [
  { key: 'landing', label: 'Landing experience', icon: Sparkles },
  { key: 'signup', label: 'Account setup', icon: Smartphone },
  { key: 'permissions', label: 'Phone permissions', icon: Lock },
  { key: 'safephrase', label: 'SafePhrase test', icon: Mic },
  { key: 'guard', label: 'Guard Mode session', icon: Shield },
  { key: 'alert', label: 'Incoming alert flow', icon: AlertTriangle },
  { key: 'settings', label: 'Settings and privacy', icon: Cog },
] as const

export default function SimulationLab() {
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState<1 | 2>(1)
  const [activeIndex, setActiveIndex] = useState(0)
  const [completed, setCompleted] = useState<SimulationStepKey[]>([])
  const [log, setLog] = useState<string[]>(['Ready to run the visual simulation.'])
  const timerRef = useRef<number | null>(null)

  const activeStep = steps[activeIndex]

  const sceneMeta = useMemo(() => {
    const seen = new Set(completed)
    seen.add(activeStep.key)
    return seen
  }, [activeStep.key, completed])

  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (!running) {
      return
    }

    if (activeIndex >= steps.length - 1) {
      setRunning(false)
      return
    }

    timerRef.current = window.setTimeout(() => {
      const next = steps[activeIndex + 1]
      setLog((prev) => [
        `Completed: ${activeStep.title}`,
        `Advancing to ${next.title}`,
        ...prev,
      ])
      setCompleted((prev) => (prev.includes(activeStep.key) ? prev : [...prev, activeStep.key]))
      setActiveIndex((prev) => prev + 1)
    }, 1800 / speed)

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [activeIndex, activeStep.key, activeStep.title, running, speed])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [])

  const reset = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setRunning(false)
    setActiveIndex(0)
    setCompleted([])
    setLog(['Ready to run the visual simulation.'])
  }

  const start = () => {
    if (activeIndex >= steps.length - 1) {
      reset()
    }
    setRunning(true)
    setLog((prev) => [`Starting visual simulation at ${steps[activeIndex].title}`, ...prev])
  }

  const pause = () => setRunning(false)

  const renderScene = () => {
    switch (activeStep.key) {
      case 'landing':
        return (
          <div className="space-y-4">
            <div className="rounded-2xl border border-charcoal bg-dark-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-gold">Guard Mode</p>
                  <h2 className="text-2xl font-bold text-ivory">Safety that does not draw attention.</h2>
                </div>
              </div>
              <p className="text-sm text-ivory/75 mb-4">
                Test the hero, CTA order, and new visual hierarchy in a realistic preview.
              </p>
              <div className="flex gap-3">
                <div className="px-4 py-2 rounded-lg bg-gold text-dark text-sm font-semibold">Start Guard Mode</div>
                <div className="px-4 py-2 rounded-lg border border-charcoal text-ivory/80 text-sm">View simulation</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['Trusted', 'Private', 'Mobile-ready'].map((item) => (
                <div key={item} className="rounded-xl border border-charcoal bg-charcoal/40 px-3 py-4 text-center text-sm text-ivory/80">
                  {item}
                </div>
              ))}
            </div>
          </div>
        )
      case 'signup':
        return (
          <div className="rounded-2xl border border-charcoal bg-dark-card p-5 space-y-4">
            <div>
              <p className="text-xs text-gold uppercase tracking-[0.2em] mb-2">Account setup</p>
              <h2 className="text-2xl font-bold text-ivory">Country + mobile entry</h2>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-3">
              <div className="rounded-lg border border-charcoal bg-charcoal/40 p-3">
                <p className="text-xs text-ivory/50 mb-1">Country</p>
                <p className="text-ivory font-medium">Australia (+61)</p>
              </div>
              <div className="rounded-lg border border-charcoal bg-charcoal/40 p-3">
                <p className="text-xs text-ivory/50 mb-1">Mobile</p>
                <p className="text-ivory font-medium">412 345 678</p>
              </div>
            </div>
            <div className="rounded-lg border border-gold/20 bg-gold/5 p-3 text-sm text-ivory/80">
              The form should feel cleaner and easier to scan on phones.
            </div>
          </div>
        )
      case 'permissions':
        return (
          <div className="space-y-3">
            {[
              ['Microphone', true, 'Listening for SafePhrases'],
              ['Location', true, 'Sharing with Trusted Circle'],
              ['Notifications', true, 'Receiving check-ins'],
              ['Motion', false, 'Optional sensor'],
            ].map(([label, granted, note]) => (
              <div key={label as string} className="rounded-xl border border-charcoal bg-dark-card p-4 flex items-center justify-between">
                <div>
                  <p className="text-ivory font-medium">{label as string}</p>
                  <p className="text-xs text-ivory/60">{note as string}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${granted ? 'bg-teal/10 text-teal border border-teal/20' : 'bg-charcoal text-ivory/50 border border-charcoal'}`}>
                  {granted ? 'Granted' : 'Optional'}
                </span>
              </div>
            ))}
          </div>
        )
      case 'safephrase':
        return (
          <div className="space-y-3">
            <div className="rounded-2xl border border-charcoal bg-dark-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-ivory">Test mode active</p>
                <span className="text-xs px-2 py-1 rounded-full bg-teal/10 text-teal border border-teal/20">local simulation</span>
              </div>
              <div className="rounded-lg border border-charcoal bg-charcoal/40 p-3 text-sm text-ivory/80">
                {"Can you check if I left the balcony door open?"}
              </div>
              <div className="mt-3 space-y-2">
                <div className="rounded-lg border border-charcoal bg-charcoal/50 px-3 py-2 text-xs text-ivory/75">Sentence pushed to test queue</div>
                <div className="rounded-lg border border-charcoal bg-charcoal/50 px-3 py-2 text-xs text-ivory/75">Listening for the phrase</div>
                <div className="rounded-lg border border-teal/30 bg-teal/10 px-3 py-2 text-xs text-teal">Phrase matched, alert queued locally</div>
              </div>
            </div>
          </div>
        )
      case 'guard':
        return (
          <div className="grid gap-3">
            {[
              ['Time remaining', '42m 18s', Shield],
              ['Location', 'Connected', MapPin],
              ['Microphone', 'Listening', Mic],
              ['Trusted Circle', '2 connected', Users],
            ].map(([label, value, Icon]) => (
              <div key={label as string} className="rounded-xl border border-charcoal bg-dark-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal/10 border border-teal/20 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-teal" />
                  </div>
                  <div>
                    <p className="text-ivory font-medium">{label as string}</p>
                    <p className="text-xs text-ivory/60">Active session status</p>
                  </div>
                </div>
                <p className="text-teal font-semibold">{value as string}</p>
              </div>
            ))}
          </div>
        )
      case 'alert':
        return (
          <div className="rounded-2xl border border-amber/30 bg-amber/5 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber" />
              </div>
              <div>
                <p className="text-ivory font-semibold">Incoming alert</p>
                <p className="text-sm text-ivory/70">User may need assistance</p>
              </div>
            </div>
            <div className="rounded-xl border border-charcoal bg-dark-card p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-ivory/80">
                <span>Call</span>
                <Phone className="w-4 h-4 text-teal" />
              </div>
              <div className="flex items-center justify-between text-ivory/80">
                <span>Message</span>
                <MessageSquare className="w-4 h-4 text-gold" />
              </div>
              <div className="flex items-center justify-between text-ivory/80">
                <span>Navigate</span>
                <Navigation2 className="w-4 h-4 text-gold" />
              </div>
            </div>
          </div>
        )
      case 'settings':
        return (
          <div className="grid gap-3">
            {['SafePhrases', 'Trusted Circle', 'Escalation Plan', 'Privacy Controls'].map((item) => (
              <div key={item} className="rounded-xl border border-charcoal bg-dark-card p-4 flex items-center justify-between">
                <div>
                  <p className="text-ivory font-medium">{item}</p>
                  <p className="text-xs text-ivory/60">Settings section</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-teal" />
              </div>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-dark text-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-2">Visual simulation</p>
            <h1 className="text-3xl md:text-5xl font-bold text-ivory">App feature simulation lab</h1>
            <p className="text-ivory/70 max-w-2xl mt-3">
              Run a visual walkthrough of the landing page, onboarding, permissions, SafePhrase tests, Guard Mode, alerts, and settings.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={running ? pause : start}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold transition-colors ${
                running ? 'bg-teal text-dark hover:bg-teal-light' : 'bg-gold text-dark hover:bg-gold/90'
              }`}
            >
              {running ? <Pause className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
              {running ? 'Pause' : 'Run simulation'}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-charcoal bg-dark-card text-ivory/80 hover:text-ivory transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Reset
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-gold/20 bg-gold/5 text-gold hover:bg-gold/10 transition-colors"
            >
              Back to site <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-charcoal bg-dark-card p-5 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-gold mb-1">Current scene</p>
                <h2 className="text-2xl font-bold text-ivory">{activeStep.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSpeed(1)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold ${speed === 1 ? 'bg-gold text-dark' : 'border border-charcoal text-ivory/70'}`}
                >
                  1x
                </button>
                <button
                  type="button"
                  onClick={() => setSpeed(2)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold ${speed === 2 ? 'bg-gold text-dark' : 'border border-charcoal text-ivory/70'}`}
                >
                  2x
                </button>
              </div>
            </div>
            <p className="text-sm text-ivory/70 mb-4">{activeStep.description}</p>
            <div className="rounded-3xl border border-charcoal bg-dark min-h-[460px] p-5">
              {renderScene()}
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-charcoal bg-dark-card p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-gold mb-1">Feature coverage</p>
                  <h3 className="text-xl font-bold text-ivory">What is being tested</h3>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-teal/10 text-teal border border-teal/20">
                  {sceneMeta.size}/{steps.length}
                </span>
              </div>
              <div className="space-y-3">
                {featureChecklist.map(({ key, label, icon: Icon }) => {
                  const done = sceneMeta.has(key)
                  const active = activeStep.key === key
                  return (
                    <div
                      key={key}
                      className={`rounded-xl border p-3 flex items-center justify-between ${
                        active
                          ? 'border-gold/30 bg-gold/5'
                          : done
                            ? 'border-teal/20 bg-teal/5'
                            : 'border-charcoal bg-dark'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? 'bg-teal/10' : 'bg-charcoal'}`}>
                          <Icon className={`w-4 h-4 ${done ? 'text-teal' : 'text-ivory/50'}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ivory">{label}</p>
                          <p className="text-xs text-ivory/60">{active ? 'active' : done ? 'tested' : 'pending'}</p>
                        </div>
                      </div>
                      {done && <CheckCircle2 className="w-5 h-5 text-teal" />}
                    </div>
                  )
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-charcoal bg-dark-card p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-gold mb-1">Event log</p>
                  <h3 className="text-xl font-bold text-ivory">Simulation output</h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${running ? 'bg-teal/10 text-teal border border-teal/20' : 'bg-charcoal text-ivory/60 border border-charcoal'}`}>
                  {running ? 'running' : 'paused'}
                </span>
              </div>
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {log.map((entry) => (
                  <div key={entry} className="rounded-lg border border-charcoal bg-dark px-3 py-2 text-xs text-ivory/75">
                    {entry}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
