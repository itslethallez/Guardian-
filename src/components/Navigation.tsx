import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const isApp = location.pathname.startsWith('/app')

  if (isApp) return null

  const navItems = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Sotto Phrase', href: '#safephrase' },
    { label: 'Trusted Circle', href: '#trusted-circle' },
    { label: 'Journey Mode', href: '#journey-mode' },
    { label: 'Privacy', href: '#privacy' },
    { label: 'Simulation', href: '/simulation' },
  ]

  return (
    <nav className="fixed top-0 w-full bg-dark/95 backdrop-blur-sm border-b border-charcoal z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              item.href.startsWith('/') ? (
                <Link key={item.label} to={item.href} className="text-sm text-ivory/80 hover:text-gold transition-colors">
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm text-ivory/80 hover:text-gold transition-colors"
                >
                  {item.label}
                </a>
              )
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/auth/sign-in" className="text-sm text-ivory/80 hover:text-gold transition-colors">
              Sign In
            </Link>
            <Link
              to="/auth/sign-up"
              className="px-6 py-2 bg-gold text-dark font-medium rounded-lg hover:bg-gold/90 transition-colors"
            >
              Get Sotto
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-ivory hover:text-gold transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-charcoal bg-dark-card">
            <div className="px-4 py-4 space-y-4">
              {navItems.map((item) => (
                item.href.startsWith('/') ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="block text-sm text-ivory/80 hover:text-gold transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block text-sm text-ivory/80 hover:text-gold transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              ))}
              <div className="pt-4 border-t border-charcoal space-y-3">
                <Link
                  to="/auth/sign-in"
                  className="block text-sm text-ivory/80 hover:text-gold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/sign-up"
                  className="block px-4 py-2 bg-gold text-dark font-medium rounded-lg hover:bg-gold/90 transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Sotto
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
