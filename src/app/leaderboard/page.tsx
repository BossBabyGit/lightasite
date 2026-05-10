'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { Trophy, Crown, Medal, Award, DollarSign } from 'lucide-react'

export default function LeaderboardPage() {
  const { winnaLeaderboard, hypedropLeaderboard } = useApp()
  const [activeTab, setActiveTab] = useState<'winna' | 'hypedrop'>('winna')

  const leaderboard = activeTab === 'winna' ? winnaLeaderboard : hypedropLeaderboard
  const top3 = leaderboard.slice(0, 3)

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />
    return <span className="text-white/40 font-bold text-sm">#{rank}</span>
  }

  return (
    <div className="min-h-screen py-16 px-6 relative">
      <div className="absolute inset-0 bg-mesh-2 opacity-40" />
      <div className="relative max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.25em] text-neon-pink/60 font-semibold mb-3">Rankings</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Casino <span className="gradient-text">Leaderboard</span>
          </h1>
          <p className="text-white/40">Top players ranked by wager amount</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex justify-center mb-14">
          <div className="glass rounded-2xl p-1 flex gap-1">
            {(['winna', 'hypedrop'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-8 py-2.5 rounded-xl text-xs font-bold transition-all duration-500 flex items-center gap-2 ${
                  activeTab === tab ? 'text-white' : 'text-white/35 hover:text-white/60'
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="lb-tab"
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r ${tab === 'winna' ? 'from-green-500/80 to-emerald-600/80' : 'from-orange-500/80 to-red-500/80'}`}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center text-[10px] font-black">{tab === 'winna' ? 'W' : 'H'}</span>
                  <span className="capitalize">{tab}</span>
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-end justify-center gap-3 md:gap-5 mb-16 px-4"
        >
          {/* 2nd */}
          <div className="flex-1 max-w-[200px]">
            <div className="glass-card rounded-t-2xl p-4 text-center border-t-2 border-gray-300/30">
              <Medal className="w-5 h-5 text-gray-300 mx-auto mb-2" />
              <div className="w-11 h-11 mx-auto rounded-xl bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-sm font-bold mb-2">{top3[1]?.username[0]}</div>
              <p className="font-bold text-xs truncate">{top3[1]?.username}</p>
              <p className="text-white/30 text-[10px] stat-number mt-1">${top3[1]?.wagered.toLocaleString()}</p>
              <p className="text-accent-emerald font-bold text-sm stat-number mt-0.5">${top3[1]?.prize.toLocaleString()}</p>
            </div>
            <div className="h-16 bg-gradient-to-t from-gray-500/10 to-transparent border-x border-b border-white/[0.04]" />
          </div>

          {/* 1st */}
          <div className="flex-1 max-w-[220px]">
            <div className="glass-card rounded-t-2xl p-5 text-center border-t-2 border-accent-gold/50 relative gradient-border">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-accent-gold text-black text-[10px] font-black tracking-wider">#1</div>
              <Crown className="w-7 h-7 text-accent-gold mx-auto mb-2 mt-2" />
              <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-accent-gold to-yellow-600 flex items-center justify-center text-xl font-bold mb-2 shadow-neon">{top3[0]?.username[0]}</div>
              <p className="font-bold text-sm truncate">{top3[0]?.username}</p>
              <p className="text-white/30 text-xs stat-number mt-1">${top3[0]?.wagered.toLocaleString()}</p>
              <p className="text-accent-emerald font-bold text-lg stat-number mt-0.5">${top3[0]?.prize.toLocaleString()}</p>
            </div>
            <div className="h-24 bg-gradient-to-t from-accent-gold/10 to-transparent border-x border-b border-white/[0.04]" />
          </div>

          {/* 3rd */}
          <div className="flex-1 max-w-[200px]">
            <div className="glass-card rounded-t-2xl p-4 text-center border-t-2 border-amber-600/30">
              <Award className="w-5 h-5 text-amber-500 mx-auto mb-2" />
              <div className="w-11 h-11 mx-auto rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-sm font-bold mb-2">{top3[2]?.username[0]}</div>
              <p className="font-bold text-xs truncate">{top3[2]?.username}</p>
              <p className="text-white/30 text-[10px] stat-number mt-1">${top3[2]?.wagered.toLocaleString()}</p>
              <p className="text-accent-emerald font-bold text-sm stat-number mt-0.5">${top3[2]?.prize.toLocaleString()}</p>
            </div>
            <div className="h-10 bg-gradient-to-t from-amber-700/10 to-transparent border-x border-b border-white/[0.04]" />
          </div>
        </motion.div>

        <motion.div key={activeTab + '-table'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/[0.04] text-[10px] text-white/30 font-semibold uppercase tracking-wider">
            <div className="col-span-1">Rank</div>
            <div className="col-span-5">Player</div>
            <div className="col-span-3 text-right">Wagered</div>
            <div className="col-span-3 text-right">Prize</div>
          </div>
          {leaderboard.slice(3).map((entry, i) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.04 }}
              className="grid grid-cols-12 gap-4 px-6 py-3.5 items-center hover:bg-white/[0.015] transition-colors border-b border-white/[0.03] last:border-0"
            >
              <div className="col-span-1">{getRankIcon(entry.rank)}</div>
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-neon-pink/20 to-neon-purple/20 flex items-center justify-center text-[10px] font-bold">{entry.username[0]}</div>
                <span className="font-medium text-sm text-white/60">{entry.username}</span>
              </div>
              <div className="col-span-3 text-right text-white/40 text-sm stat-number">${entry.wagered.toLocaleString()}</div>
              <div className="col-span-3 text-right">
                <span className="text-accent-emerald font-semibold text-sm stat-number">${entry.prize.toLocaleString()}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
