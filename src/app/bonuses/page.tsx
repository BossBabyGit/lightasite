'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Copy, Check, Trophy, Users, Sparkles, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const CASINOS = [
  {
    id: 'winna',
    name: 'Winna',
    logo: 'W',
    color: 'from-green-400 to-emerald-600',
    accent: 'text-green-400',
    accentBg: 'bg-green-400/10',
    bonus: 'Exclusive deposit bonus + rakeback',
    code: 'LIGHTA',
    features: ['Instant withdrawals', 'Provably fair games', 'Weekly leaderboard prizes', '24/7 Live support'],
    description: 'Premium casino with the best slots, live games, and instant crypto payouts. Use code LIGHTA for exclusive benefits.',
    stats: { players: '2.4k+', wagered: '$4.2M', prizes: '$42k+' },
  },
  {
    id: 'hypedrop',
    name: 'Hypedrop',
    logo: 'H',
    color: 'from-orange-400 to-red-500',
    accent: 'text-orange-400',
    accentBg: 'bg-orange-400/10',
    bonus: 'Free mystery box on signup',
    code: 'LIGHTA',
    features: ['Mystery boxes', 'Guaranteed value', 'Case battles', 'Box upgrades'],
    description: 'The #1 mystery box platform. Open boxes, battle friends, and win real items. Guaranteed minimum value on every box.',
    stats: { players: '1.8k+', wagered: '$2.8M', prizes: '$28k+' },
  },
]

export default function BonusesPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    toast.success(`Code "${code}" copied!`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen py-16 px-6 relative">
      <div className="absolute inset-0 bg-mesh-1 opacity-40" />
      <div className="relative max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.25em] text-neon-pink/60 font-semibold mb-3">Exclusive Partnerships</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="gradient-text">Casinos</span>
          </h1>
          <p className="text-white/40 text-base max-w-md mx-auto">
            Use code <span className="text-neon-pink font-semibold">LIGHTA</span> on both platforms for exclusive bonuses
          </p>
        </motion.div>

        <div className="space-y-6">
          {CASINOS.map((casino, i) => (
            <motion.div
              key={casino.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl ${casino.color} opacity-[0.04] rounded-full -translate-y-1/3 translate-x-1/3 group-hover:opacity-[0.08] transition-opacity duration-700`} />

              <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${casino.color} flex items-center justify-center text-xl font-black shadow-lg`}>
                      {casino.logo}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">{casino.name}</h2>
                      <p className={`${casino.accent} font-semibold text-xs flex items-center gap-1`}>
                        <Sparkles className="w-3 h-3" />{casino.bonus}
                      </p>
                    </div>
                  </div>

                  <p className="text-white/40 mb-6 leading-relaxed text-sm">{casino.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                    {casino.features.map(feature => (
                      <div key={feature} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-[11px] text-white/50">
                        <CheckCircle className="w-3 h-3 text-neon-pink/50 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <code className={`flex-1 text-center ${casino.accent} ${casino.accentBg} px-4 py-3 rounded-xl border border-white/[0.06] font-mono font-bold text-sm tracking-wider`}>
                        {casino.code}
                      </code>
                      <button
                        onClick={() => copyCode(casino.id, casino.code)}
                        className="p-3 rounded-xl glass hover:bg-neon-pink/10 transition-all"
                      >
                        {copiedId === casino.id ? <Check className="w-4 h-4 text-accent-emerald" /> : <Copy className="w-4 h-4 text-white/40" />}
                      </button>
                    </div>
                    <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-pink to-neon-purple font-semibold text-sm hover:shadow-neon-lg transition-all duration-500 flex items-center justify-center gap-2 shimmer-btn">
                      Visit {casino.name} <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-3">
                  {[
                    { icon: Users, value: casino.stats.players, label: 'Active Players', color: 'text-neon-pink' },
                    { icon: Trophy, value: casino.stats.wagered, label: 'Total Wagered', color: 'text-accent-gold' },
                    { icon: Trophy, value: casino.stats.prizes, label: 'Prizes Given', color: 'text-accent-emerald' },
                  ].map(stat => (
                    <div key={stat.label} className="glass rounded-xl p-4 text-center group/stat hover:bg-white/[0.03] transition-all">
                      <stat.icon className={`w-4 h-4 ${stat.color} mx-auto mb-1.5 group-hover/stat:scale-110 transition-transform`} />
                      <p className="text-lg font-bold stat-number">{stat.value}</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
