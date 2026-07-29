import { AlertTriangle } from 'lucide-react'

export default function DemoModeBanner() {
  return (
    <div
      role="alert"
      className="sticky top-0 z-40 w-full bg-amber text-dark px-4 py-2.5 flex items-center justify-center gap-2 text-center text-sm font-semibold"
    >
      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
      <span>
        DEMO MODE — Sotto is not yet monitoring and will NOT contact anyone in an emergency.
      </span>
    </div>
  )
}
