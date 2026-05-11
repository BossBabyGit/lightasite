'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { Trophy, Gift, Users, User, Ticket, Shield, LogOut, Loader2, Home, Sparkles, X, Tag } from 'lucide-react'

export default function Navbar() {
  const { user, isLoggedIn, isLoading, isAdmin, login, logout, toggleAdmin } = useApp()
  const pathname = usePathname()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [affiliateCode, setAffiliateCode] = useState('')

  const handleLogin = () => {
    login(affiliateCode || undefined)
    setShowLoginModal(false)
    setAffiliateCode('')
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="glass-strong border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-pink to-neon-purple flex items-center justify-center font-black text-sm group-hover:shadow-neon-lg transition-all duration-500">
                L
              </div>
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-neon-pink/30 to-neon-purple/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <span className="text-lg font-bold gradient-text-static tracking-tight">Lighta</span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5 p-1 rounded-2xl bg-white/[0.02]">
            <NavLink href="/" icon={<Home className="w-3.5 h-3.5" />} label="Home" active={pathname === '/'} />
            <NavLink href="/bonuses" icon={<Gift className="w-3.5 h-3.5" />} label="Bonuses" active={pathname === '/bonuses'} />
            <NavLink href="/leaderboard" icon={<Trophy className="w-3.5 h-3.5" />} label="Leaderboard" active={pathname === '/leaderboard'} />
            {isLoggedIn && (
              <>
                <NavLink href="/referrals" icon={<Users className="w-3.5 h-3.5" />} label="Referrals" active={pathname === '/referrals'} />
                <NavLink href="/raffle" icon={<Ticket className="w-3.5 h-3.5" />} label="Raffle" active={pathname === '/raffle'} />
                <NavLink href="/profile" icon={<User className="w-3.5 h-3.5" />} label="Profile" active={pathname === '/profile'} />
              </>
            )}
            {isAdmin && (
              <NavLink href="/admin" icon={<Shield className="w-3.5 h-3.5" />} label="Admin" active={pathname === '/admin'} />
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {isLoggedIn && (
              <button
                onClick={toggleAdmin}
                className="text-[10px] px-2.5 py-1 rounded-lg border border-white/[0.06] text-white/40 hover:text-neon-pink hover:border-neon-pink/20 transition-all uppercase tracking-wider font-semibold"
              >
                {isAdmin ? 'Exit' : 'Admin'}
              </button>
            )}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link href="/profile" className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl glass hover:border-neon-pink/20 transition-all group">
                  <div className="relative">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-neon-pink to-neon-purple flex items-center justify-center text-[10px] font-bold">
                      {user?.username[0]}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent-emerald border-2 border-dark-900" />
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs font-semibold leading-tight">{user?.username}</p>
                    <p className="text-[10px] text-white/30">{user?.points.toLocaleString()} pts</p>
                  </div>
                </Link>
                <button onClick={logout} className="p-2 rounded-lg hover:bg-white/[0.04] text-white/30 hover:text-white/70 transition-all">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                disabled={isLoading}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-neon-pink to-neon-purple font-semibold text-sm hover:shadow-neon-lg transition-all duration-500 disabled:opacity-50 flex items-center gap-2 shimmer-btn"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs">Connecting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Login with Kick
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-neon-pink/20 to-transparent" />

      {/* Login Modal with Affiliate Code */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              className="glass-card rounded-2xl p-6 w-full max-w-sm mx-4 relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-neon-pink/[0.04] rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-neon-purple/[0.04] rounded-full blur-[60px]" />
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-bold text-lg">Sign In</h3>
                    <p className="text-[10px] text-white/25 mt-0.5">Connect with your Kick account</p>
                  </div>
                  <button onClick={() => setShowLoginModal(false)} className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-all">
                    <X className="w-4 h-4 text-white/30" />
                  </button>
                </div>

                <div className="mb-4">
                  <label className="text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-2 block">
                    <Tag className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                    Affiliate / Referral Code
                  </label>
                  <input
                    type="text"
                    value={affiliateCode}
                    onChange={e => setAffiliateCode(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    placeholder="Enter code (optional)"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] focus:border-neon-pink/30 outline-none text-sm transition-colors placeholder:text-white/15"
                    autoFocus
                  />
                  <p className="text-[9px] text-white/15 mt-1.5">Get <span className="text-neon-pink font-semibold">+250 bonus points</span> when you use a valid code</p>
                </div>

                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-neon-pink to-neon-purple font-semibold text-sm hover:shadow-neon-lg transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-2 shimmer-btn"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Login with Kick
                    </>
                  )}
                </button>

                <button
                  onClick={handleLogin}
                  className="w-full mt-2 py-2 text-[10px] text-white/20 hover:text-white/40 transition-all"
                >
                  Skip — continue without code
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function NavLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 ${
        active
          ? 'text-white bg-white/[0.06]'
          : 'text-white/40 hover:text-white/80 hover:bg-white/[0.03]'
      }`}
    >
      {icon}
      {label}
      {active && (
        <motion.div
          layoutId="nav-active"
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-pink/10 to-neon-purple/10 border border-neon-pink/10"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  )
}
