'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useApp } from '@/context/AppContext'
import { Zap, Trophy, Users, ArrowRight, DollarSign, TrendingUp, Gift, Ticket, Sparkles, ChevronRight, ChevronDown } from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
}

export default function HomePage() {
  const { platformStats, winnaLeaderboard, isLoggedIn, login, isLoading } = useApp()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[100vh] flex items-center justify-center">
        {/* Background layers */}
        <div className="absolute inset-0 bg-dark-950" />

        {/* Main gradient orbs — bigger and more dramatic */}
        <div className="absolute inset-0">
          <div className="absolute top-[5%] left-[15%] w-[700px] h-[700px] bg-neon-pink/[0.08] rounded-full blur-[200px] animate-float-slower" />
          <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-neon-purple/[0.09] rounded-full blur-[180px] animate-float-slower" style={{ animationDelay: '5s' }} />
          <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[900px] h-[600px] bg-neon-cyan/[0.035] rounded-full blur-[220px] animate-pulse-slow" />
          <div className="absolute top-[60%] left-[30%] w-[400px] h-[400px] bg-accent-gold/[0.03] rounded-full blur-[150px] animate-float-slower" style={{ animationDelay: '8s' }} />
        </div>

        {/* Hero grid */}
        <div className="absolute inset-0 hero-grid" />

        {/* Noise overlay */}
        <div className="absolute inset-0 noise-overlay" />

        {/* Orbital rings behind text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] orbital-ring pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[500px] md:h-[500px] orbital-ring-2 pointer-events-none" />

        {/* Vertical beams */}
        <div className="hero-beam h-[40%] top-0 left-[20%]" style={{ animationDelay: '0s' }} />
        <div className="hero-beam h-[35%] top-0 left-[45%]" style={{ animationDelay: '1.5s' }} />
        <div className="hero-beam h-[45%] top-0 right-[25%]" style={{ animationDelay: '3s' }} />
        <div className="hero-beam h-[30%] top-0 right-[10%]" style={{ animationDelay: '2s' }} />

        {/* Floating stat badges */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex absolute top-[22%] left-[6%] glass-card rounded-2xl px-4 py-3 items-center gap-3 animate-float-slow z-20"
        >
          <div className="w-8 h-8 rounded-lg bg-accent-emerald/20 flex items-center justify-center">
            <Gift className="w-4 h-4 text-accent-emerald" />
          </div>
          <div>
            <p className="text-xs font-bold stat-number">${platformStats.totalGivenAway.toLocaleString()}</p>
            <p className="text-[9px] text-white/30 uppercase tracking-wider">Given Away</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex absolute top-[18%] right-[7%] glass-card rounded-2xl px-4 py-3 items-center gap-3 animate-float-slow z-20"
          style={{ animationDelay: '2s' }}
        >
          <div className="w-8 h-8 rounded-lg bg-neon-pink/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-neon-pink" />
          </div>
          <div>
            <p className="text-xs font-bold stat-number">{platformStats.totalUsers.toLocaleString()}</p>
            <p className="text-[9px] text-white/30 uppercase tracking-wider">Members</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex absolute bottom-[20%] left-[8%] glass-card rounded-2xl px-4 py-3 items-center gap-3 animate-float-slow z-20"
          style={{ animationDelay: '4s' }}
        >
          <div className="w-8 h-8 rounded-lg bg-accent-gold/20 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-accent-gold" />
          </div>
          <div>
            <p className="text-xs font-bold stat-number">{platformStats.totalRafflesRun}</p>
            <p className="text-[9px] text-white/30 uppercase tracking-wider">Raffles Run</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex absolute bottom-[25%] right-[6%] glass-card rounded-2xl px-4 py-3 items-center gap-3 animate-float-slow z-20"
          style={{ animationDelay: '6s' }}
        >
          <div className="w-8 h-8 rounded-lg bg-neon-purple/20 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-neon-purple" />
          </div>
          <div>
            <p className="text-xs font-bold stat-number">${platformStats.totalCasinoRefEarnings.toLocaleString()}</p>
            <p className="text-[9px] text-white/30 uppercase tracking-wider">Ref Earnings</p>
          </div>
        </motion.div>

        {/* Center content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-card mb-10 text-[10px] text-white/50 font-semibold tracking-[0.15em] uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-emerald" />
              </span>
              Live on Kick
              <span className="w-px h-3 bg-white/10" />
              Community Hub
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-8xl md:text-[10rem] lg:text-[12rem] font-black mb-4 tracking-tighter leading-[0.8]"
          >
            <span className="gradient-text text-glow">Lighta</span>
          </motion.h1>

          <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: '6rem' }} transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-[2px] bg-gradient-to-r from-transparent via-neon-pink to-transparent mx-auto mb-8"
          />

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base md:text-lg text-white/35 mb-12 max-w-lg mx-auto font-light leading-relaxed"
          >
            Exclusive casino bonuses, community raffles,{' '}
            <span className="text-white/60 font-medium">leaderboard rewards</span>, and more.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link href="/bonuses" className="group relative px-8 py-3.5 rounded-2xl bg-gradient-to-r from-neon-pink to-neon-purple font-bold text-sm tracking-wide hover:shadow-neon-xl transition-all duration-500 shimmer-btn flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Explore Bonuses
              <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            {!isLoggedIn && (
              <button onClick={login} disabled={isLoading}
                className="px-8 py-3.5 rounded-2xl glass-card font-semibold text-sm text-white/50 hover:text-white hover:border-neon-pink/20 transition-all duration-500 flex items-center gap-2"
              >
                <Zap className="w-3.5 h-3.5" />
                Login with Kick
              </button>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}
            className="mt-16 flex items-center justify-center gap-6 text-white/15 text-[10px] font-semibold uppercase tracking-[0.2em]"
          >
            {['Winna', 'Hypedrop', 'Kick'].map((name, i) => (
              <span key={name} className="flex items-center gap-6">
                {i > 0 && <span className="w-1 h-1 rounded-full bg-neon-pink/30" />}
                <span className="hover:text-white/30 transition-colors cursor-default">{name}</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        >
          <span className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-medium">Scroll</span>
          <ChevronDown className="w-4 h-4 text-white/20 scroll-indicator" />
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-mesh-1 opacity-50" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div {...fadeUp} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-[10px] uppercase tracking-[0.25em] text-neon-pink/60 font-semibold mb-3">Platform Overview</p>
            <h2 className="text-3xl md:text-5xl font-bold">Community <span className="gradient-text">Stats</span></h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Given Away', value: `$${platformStats.totalGivenAway.toLocaleString()}`, icon: Gift, color: 'text-accent-emerald', gradient: 'from-accent-emerald/20 to-accent-emerald/5' },
              { label: 'Casino Ref Earnings', value: `$${platformStats.totalCasinoRefEarnings.toLocaleString()}`, icon: DollarSign, color: 'text-neon-pink', gradient: 'from-neon-pink/20 to-neon-pink/5' },
              { label: 'Viewer Ref Points', value: platformStats.totalViewerRefPoints.toLocaleString(), icon: TrendingUp, color: 'text-neon-purple', gradient: 'from-neon-purple/20 to-neon-purple/5' },
              { label: 'Total Users', value: platformStats.totalUsers.toLocaleString(), icon: Users, color: 'text-neon-cyan', gradient: 'from-neon-cyan/20 to-neon-cyan/5' },
              { label: 'Raffles Run', value: platformStats.totalRafflesRun.toString(), icon: Ticket, color: 'text-accent-gold', gradient: 'from-accent-gold/20 to-accent-gold/5' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card rounded-2xl p-5 text-center group"
              >
                <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-xl md:text-2xl font-bold stat-number mb-0.5">{stat.value}</p>
                <p className="text-[10px] text-white/30 uppercase tracking-wider font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard + Quick Links */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/50 to-dark-950" />
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ ease: [0.16, 1, 0.3, 1] }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-neon-pink/60 font-semibold mb-1">Top Players</p>
                <h2 className="text-2xl font-bold">Winna Leaderboard</h2>
              </div>
              <Link href="/leaderboard" className="text-xs text-neon-pink hover:text-neon-pink/80 flex items-center gap-1 font-medium group">
                View All <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="space-y-2">
              {winnaLeaderboard.slice(0, 5).map((entry, i) => (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`glass-card rounded-xl p-4 flex items-center justify-between ${i === 0 ? 'gradient-border' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${
                      i === 0 ? 'bg-accent-gold/20 text-accent-gold' :
                      i === 1 ? 'bg-gray-300/10 text-gray-300' :
                      i === 2 ? 'bg-amber-600/15 text-amber-500' :
                      'bg-white/[0.03] text-white/30'
                    }`}>
                      {entry.rank}
                    </div>
                    <span className="font-medium text-sm">{entry.username}</span>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <span className="text-xs text-white/40 stat-number">${entry.wagered.toLocaleString()}</span>
                    <span className="text-xs font-bold text-accent-emerald stat-number">${entry.prize}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ ease: [0.16, 1, 0.3, 1] }}>
            <p className="text-[10px] uppercase tracking-[0.25em] text-neon-pink/60 font-semibold mb-1">Navigate</p>
            <h2 className="text-2xl font-bold mb-8">Quick Access</h2>
            <div className="space-y-3">
              {[
                { href: '/bonuses', title: 'Casino Bonuses', desc: 'Exclusive Winna & Hypedrop codes', icon: Gift, color: 'from-neon-pink to-neon-purple' },
                { href: '/leaderboard', title: 'Leaderboards', desc: 'Winna & Hypedrop wager rankings', icon: Trophy, color: 'from-accent-gold to-orange-500' },
                { href: '/referrals', title: 'Referral System', desc: 'Earn from viewer & casino referrals', icon: Users, color: 'from-neon-cyan to-neon-blue' },
                { href: '/raffle', title: 'Active Raffles', desc: 'Spend points for a chance to win', icon: Ticket, color: 'from-accent-emerald to-emerald-600' },
              ].map((link, i) => (
                <motion.div key={link.href} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <Link href={link.href} className="glass-card rounded-xl p-4 flex items-center gap-4 group block">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-500`}>
                      <link.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{link.title}</h3>
                      <p className="text-xs text-white/30 truncate">{link.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/15 group-hover:text-neon-pink group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
