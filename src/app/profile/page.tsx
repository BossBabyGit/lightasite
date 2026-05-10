'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useApp, RANKS } from '@/context/AppContext'
import type { RankTier } from '@/context/AppContext'
import { Shield, Star, Clock, MessageSquare, Link as LinkIcon, Unlink, Users, DollarSign, Ticket, Trophy, TrendingUp, TrendingDown, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const RANK_COLORS: Record<RankTier, string> = {
  Bronze: 'from-amber-700 to-amber-900',
  Silver: 'from-gray-300 to-gray-500',
  Gold: 'from-yellow-400 to-yellow-600',
  Diamond: 'from-cyan-300 to-blue-500',
  VIP: 'from-neon-pink to-neon-purple',
}

export default function ProfilePage() {
  const { user, isLoggedIn, connectAccount, disconnectAccount, raffles } = useApp()
  const router = useRouter()
  const [connectingAccount, setConnectingAccount] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoggedIn) router.push('/')
  }, [isLoggedIn, router])

  if (!user) return null

  const currentRankIndex = RANKS.findIndex(r => r.name === user.rank)
  const nextRank = RANKS[currentRankIndex + 1]
  const currentRank = RANKS[currentRankIndex]

  const hoursProgress = nextRank
    ? Math.min(((user.watchTimeHours - currentRank.minHours) / (nextRank.minHours - currentRank.minHours)) * 100, 100)
    : 100
  const msgsProgress = nextRank
    ? Math.min(((user.chatMessages - currentRank.minMessages) / (nextRank.minMessages - currentRank.minMessages)) * 100, 100)
    : 100

  const qualifiedViewerRefs = user.viewerReferrals.filter(r => r.qualified).length
  const qualifiedCasinoRefs = user.casinoReferrals.filter(r => r.qualified).length
  const totalCasinoEarned = user.casinoReferrals.reduce((sum, r) => sum + r.earnedUSD, 0)
  const activeRaffleEntries = raffles.filter(r => r.status === 'active' && r.entries.some(e => e.username === user.username)).length

  const handleConnect = (account: 'hypedrop' | 'winna') => {
    setConnectingAccount(account)
    setTimeout(() => {
      if (user.connectedAccounts[account]) {
        disconnectAccount(account)
        toast.success(`${account} disconnected`)
      } else {
        connectAccount(account)
        toast.success(`${account} connected!`)
      }
      setConnectingAccount(null)
    }, 1000)
  }

  return (
    <div className="min-h-screen py-16 px-6 relative">
      <div className="absolute inset-0 bg-mesh-2 opacity-30" />
      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8 md:p-10 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-neon-pink/[0.04] rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]" />
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="relative"
            >
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${RANK_COLORS[user.rank]} flex items-center justify-center text-2xl font-black shadow-neon`}>
                {user.username[0]}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-accent-emerald border-2 border-dark-950 flex items-center justify-center">
                <span className="text-[8px] font-black">✓</span>
              </div>
            </motion.div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold mb-1 tracking-tight">{user.username}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2.5 mb-3">
                <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r ${RANK_COLORS[user.rank]} uppercase tracking-wider`}>{user.rank}</span>
                <span className="text-xs text-white/30 stat-number">{user.points.toLocaleString()} pts</span>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-white/30">
                <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{user.watchTimeHours}h watched</div>
                <div className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{user.chatMessages.toLocaleString()} msgs</div>
                <div className="flex items-center gap-1"><Users className="w-3 h-3" />{qualifiedViewerRefs + qualifiedCasinoRefs} refs</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Watch Time', value: `${user.watchTimeHours}h`, icon: Clock, color: 'text-neon-pink', gradient: 'from-neon-pink/20 to-neon-pink/5' },
            { label: 'Chat Messages', value: user.chatMessages.toLocaleString(), icon: MessageSquare, color: 'text-neon-purple', gradient: 'from-neon-purple/20 to-neon-purple/5' },
            { label: 'Casino Earned', value: `$${totalCasinoEarned}`, icon: DollarSign, color: 'text-accent-emerald', gradient: 'from-accent-emerald/20 to-accent-emerald/5' },
            { label: 'Active Raffles', value: activeRaffleEntries.toString(), icon: Ticket, color: 'text-accent-gold', gradient: 'from-accent-gold/20 to-accent-gold/5' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="glass-card rounded-xl p-4 text-center group">
              <div className={`w-8 h-8 mx-auto rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500`}>
                <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
              </div>
              <p className="text-lg font-bold stat-number">{s.value}</p>
              <p className="text-[10px] text-white/30 uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Casino Stats — shown when at least one account is connected */}
        {(user.connectedAccounts.winna || user.connectedAccounts.hypedrop) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-neon-pink" />
              <h3 className="font-bold text-sm">Casino Stats</h3>
              <span className="text-[9px] text-white/20 uppercase tracking-wider ml-1">Read-only</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(['winna', 'hypedrop'] as const).map(platform => {
                const stats = user.casinoStats[platform]
                if (!stats) return null
                const isProfit = stats.profit >= 0
                return (
                  <div key={platform} className="glass-card rounded-2xl p-5 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] ${platform === 'winna' ? 'bg-green-500/[0.04]' : 'bg-orange-500/[0.04]'}`} />
                    <div className="relative">
                      <div className="flex items-center gap-2.5 mb-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${platform === 'winna' ? 'bg-green-500/15 text-green-400' : 'bg-orange-500/15 text-orange-400'}`}>
                          {platform === 'winna' ? 'W' : 'H'}
                        </div>
                        <div>
                          <p className="font-semibold text-sm capitalize">{platform}</p>
                          <p className="text-[9px] text-white/25 uppercase tracking-wider">Connected</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 text-center">
                          <DollarSign className="w-3 h-3 mx-auto mb-1 text-neon-pink/60" />
                          <p className="text-sm font-bold stat-number">${stats.deposited.toLocaleString()}</p>
                          <p className="text-[9px] text-white/25 uppercase tracking-wider">Deposited</p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 text-center">
                          <TrendingUp className="w-3 h-3 mx-auto mb-1 text-neon-purple/60" />
                          <p className="text-sm font-bold stat-number">${stats.wagered.toLocaleString()}</p>
                          <p className="text-[9px] text-white/25 uppercase tracking-wider">Wagered</p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 text-center">
                          {isProfit ? <ArrowUpRight className="w-3 h-3 mx-auto mb-1 text-accent-emerald/80" /> : <ArrowDownRight className="w-3 h-3 mx-auto mb-1 text-red-400/80" />}
                          <p className={`text-sm font-bold stat-number ${isProfit ? 'text-accent-emerald' : 'text-red-400'}`}>
                            {isProfit ? '+' : '-'}${Math.abs(stats.profit).toLocaleString()}
                          </p>
                          <p className="text-[9px] text-white/25 uppercase tracking-wider">Profit</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-4 h-4 text-neon-pink" />
              <h3 className="font-bold text-sm">Rank Progress</h3>
            </div>
            <div className="flex justify-between text-xs mb-3">
              <span className="text-white/40">Current: <strong className="text-white/80">{user.rank}</strong></span>
              <span className="text-white/40">Next: <strong className="text-white/80">{nextRank?.name || 'MAX'}</strong></span>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-[10px] text-white/30 mb-1.5">
                <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> Watch Time</span>
                <span className="stat-number">{user.watchTimeHours}h / {nextRank ? `${nextRank.minHours}h` : 'MAX'}</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${hoursProgress}%` }} transition={{ duration: 1, delay: 0.5 }} className="h-full rounded-full bg-gradient-to-r from-neon-pink to-neon-purple" />
              </div>
            </div>
            <div className="mb-5">
              <div className="flex justify-between text-[10px] text-white/30 mb-1.5">
                <span className="flex items-center gap-1"><MessageSquare className="w-2.5 h-2.5" /> Chat Messages</span>
                <span className="stat-number">{user.chatMessages} / {nextRank ? nextRank.minMessages : 'MAX'}</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${msgsProgress}%` }} transition={{ duration: 1, delay: 0.7 }} className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan" />
              </div>
            </div>
            <p className="text-[10px] text-white/20 mb-4">Both requirements must be met to rank up</p>
            <div className="grid grid-cols-5 gap-1">
              {RANKS.map((rank, i) => (
                <div key={rank.name} className={`text-center p-1.5 rounded-lg transition-all ${i <= currentRankIndex ? 'bg-neon-pink/10 border border-neon-pink/15' : 'bg-white/[0.02] border border-white/[0.04]'}`}>
                  <div className={`text-[9px] font-bold ${i <= currentRankIndex ? 'text-neon-pink' : 'text-white/20'}`}>{rank.name}</div>
                  <div className="text-[8px] text-white/15 mt-0.5">{rank.minHours}h</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-4 h-4 text-neon-pink" />
              <h3 className="font-bold text-sm">Connected Accounts</h3>
            </div>
            <div className="space-y-3 mb-5">
              {(['winna', 'hypedrop'] as const).map(account => (
                <div key={account} className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${account === 'winna' ? 'bg-green-500/15 text-green-400' : 'bg-orange-500/15 text-orange-400'}`}>
                      {account === 'winna' ? 'W' : 'H'}
                    </div>
                    <div>
                      <p className="font-medium text-sm capitalize">{account}</p>
                      <p className="text-[10px] text-white/30">{user.connectedAccounts[account] ? 'Connected' : 'Not connected'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleConnect(account)}
                    disabled={connectingAccount === account}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 disabled:opacity-50 ${user.connectedAccounts[account] ? 'text-red-400/70 hover:bg-red-500/10 border border-red-400/10' : 'bg-neon-pink/10 text-neon-pink hover:bg-neon-pink/20'}`}
                  >
                    {connectingAccount === account ? '...' : user.connectedAccounts[account] ? (<><Unlink className="w-3 h-3" /> Disconnect</>) : (<><LinkIcon className="w-3 h-3" /> Connect</>)}
                  </button>
                </div>
              ))}
            </div>
            <div className="p-3.5 rounded-xl bg-neon-pink/[0.04] border border-neon-pink/10">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-3.5 h-3.5 text-neon-pink" />
                <span className="text-xs font-medium">Kick Account</span>
              </div>
              <p className="text-[10px] text-white/30">Connected as <strong className="text-neon-pink">{user.username}</strong> via Kick</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
