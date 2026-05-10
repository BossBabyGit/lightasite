'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { Trophy, Gift, Users, User, Ticket, Shield, LogOut, Loader2, Home, Sparkles } from 'lucide-react'

export default function Navbar() {
  const { user, isLoggedIn, isLoading, isAdmin, login, logout, toggleAdmin } = useApp()
  const pathname = usePathname()

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
                onClick={login}
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
