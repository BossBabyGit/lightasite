'use client'

import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { TrendingUp, Calendar, Users, ArrowUp, Clock, Trophy } from 'lucide-react'

export default function JackpotPage() {
  const { jackpot } = useApp()

  const daysLeft = Math.max(0, Math.ceil((new Date(jackpot.endsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
  const profitableStreams = jackpot.contributions.filter(c => c.amount > 0).length

  return (
    <div className="min-h-screen py-16 px-6 relative">
      <div className="absolute inset-0 bg-mesh-2 opacity-30" />
      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <p className="text-[10px] uppercase tracking-[0.25em] text-neon-pink/60 font-semibold mb-3">Community Giveaway</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Monthly <span className="gradient-text">Pot</span>
          </h1>
          <p className="text-white/40 max-w-xl mx-auto text-sm leading-relaxed">
            The Monthly Pot is <span className="text-white/70 font-medium">1.5% of profits per stream</span> added to the pot. At the end of the month we give it away in creative ways to VIPs, code users, and community members.
          </p>
        </motion.div>

        {/* Main Pot Display */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card rounded-3xl p-8 md:p-10 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-emerald/[0.02] rounded-full -translate-y-1/2 translate-x-1/3 blur-[80px]" />
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-semibold mb-2">{jackpot.month} Pot</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl md:text-7xl font-black stat-number text-accent-emerald">
                    ${jackpot.currentAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-xs text-white/25 mt-2">1.5% of stream profits - grows every profitable stream</p>
              </div>
              <div className="flex gap-5">
                <div className="text-center">
                  <div className="w-11 h-11 rounded-xl bg-neon-pink/10 flex items-center justify-center mx-auto mb-1.5">
                    <Calendar className="w-4.5 h-4.5 text-neon-pink" />
                  </div>
                  <p className="text-lg font-bold stat-number">{daysLeft}</p>
                  <p className="text-[9px] text-white/30 uppercase tracking-wider">Days Left</p>
                </div>
                <div className="text-center">
                  <div className="w-11 h-11 rounded-xl bg-neon-purple/10 flex items-center justify-center mx-auto mb-1.5">
                    <TrendingUp className="w-4.5 h-4.5 text-neon-purple" />
                  </div>
                  <p className="text-lg font-bold stat-number">{profitableStreams}/{jackpot.contributions.length}</p>
                  <p className="text-[9px] text-white/30 uppercase tracking-wider">Profit Streams</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-5 mb-8 border-l-2 border-neon-pink/30"
        >
          <p className="text-xs text-white/40 leading-relaxed">
            <span className="text-white/60 font-semibold">How it works:</span> After each stream, if we end in profit, 1.5% of that profit gets added to the monthly pot. If the stream ends negative, nothing is added. At the end of the month, the full pot gets given away to VIPs, active users, code users, and more in creative ways.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contribution History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <div className="p-5 border-b border-white/[0.04]">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <ArrowUp className="w-4 h-4 text-accent-emerald" />
                Recent Contributions
              </h3>
            </div>
            <div className="divide-y divide-white/[0.03]">
              {jackpot.contributions.map((c, i) => (
                <motion.div
                  key={c.date + i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  className={`px-5 py-3.5 flex items-center justify-between hover:bg-white/[0.015] transition-colors ${c.amount === 0 ? 'opacity-50' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white/70 truncate">{c.reason}</p>
                    <p className="text-[10px] text-white/25 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  {c.amount > 0 ? (
                    <span className="text-sm font-bold text-accent-emerald stat-number ml-3">+${c.amount.toFixed(2)}</span>
                  ) : (
                    <span className="text-[10px] font-medium text-white/25 ml-3">$0.00</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Previous Months */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <div className="p-5 border-b border-white/[0.04]">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4 text-accent-gold" />
                Previous Pots
              </h3>
            </div>
            <div className="divide-y divide-white/[0.03]">
              {jackpot.previousWinners.map((pw, i) => (
                <motion.div
                  key={pw.month}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  className="px-5 py-4 flex items-center justify-between hover:bg-white/[0.015] transition-colors"
                >
                  <div>
                    <p className="text-xs font-semibold">{pw.month}</p>
                    <p className="text-[10px] text-white/25 mt-0.5 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Given to {pw.winners} members
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-accent-gold stat-number">${pw.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-white/20">avg ~${Math.round(pw.amount / pw.winners)} each</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
