'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { Users, Copy, Check, UserPlus, DollarSign, Clock, MessageSquare, CheckCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function ReferralsPage() {
  const { user, isLoggedIn, simulateViewerRef, simulateCasinoRef } = useApp()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'viewer' | 'casino'>('viewer')

  useEffect(() => {
    if (!isLoggedIn) router.push('/')
  }, [isLoggedIn, router])

  if (!user) return null

  const qualifiedViewerRefs = user.viewerReferrals.filter(r => r.qualified).length
  const qualifiedCasinoRefs = user.casinoReferrals.filter(r => r.qualified).length
  const totalCasinoEarned = user.casinoReferrals.reduce((sum, r) => sum + r.earnedUSD, 0)

  const copyCode = () => {
    navigator.clipboard.writeText(user.referralCode)
    setCopied(true)
    toast.success('Referral code copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSimViewerRef = () => {
    toast.loading('New viewer joining...', { duration: 1200 })
    setTimeout(() => {
      simulateViewerRef()
      toast.success('Viewer referral added!')
    }, 1200)
  }

  const handleSimCasinoRef = (platform: 'winna' | 'hypedrop') => {
    toast.loading(`Simulating ${platform} referral...`, { duration: 1200 })
    setTimeout(() => {
      simulateCasinoRef(platform)
      toast.success(`${platform} referral added!`)
    }, 1200)
  }

  return (
    <div className="min-h-screen py-16 px-6 relative">
      <div className="absolute inset-0 bg-mesh-1 opacity-30" />
      <div className="relative max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.25em] text-neon-pink/60 font-semibold mb-3">Earn Rewards</p>
          <h1 className="text-4xl font-bold mb-2"><span className="gradient-text">Referral</span> System</h1>
          <p className="text-white/40">Earn from viewer referrals and casino sign-ups</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
          {[
            { label: 'Viewer Refs (Qualified)', value: `${qualifiedViewerRefs} / ${user.viewerReferrals.length}`, icon: Users, color: 'text-neon-pink', bg: 'bg-neon-pink/20' },
            { label: 'Points from Viewer Refs', value: `${(qualifiedViewerRefs * 50).toLocaleString()} pts`, icon: MessageSquare, color: 'text-neon-purple', bg: 'bg-neon-purple/20' },
            { label: 'Casino Refs (Qualified)', value: `${qualifiedCasinoRefs} / ${user.casinoReferrals.length}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/20' },
            { label: 'Total Earned (Casino)', value: `$${totalCasinoEarned.toLocaleString()}`, icon: DollarSign, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`w-3.5 h-3.5 ${s.color}`} /></div>
                <span className="text-white/30 text-[10px] uppercase tracking-wider font-medium">{s.label}</span>
              </div>
              <p className="text-xl font-bold stat-number">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Referral Code */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6 mb-10">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-base mb-1">Your Referral Code</h3>
              <p className="text-[11px] text-white/30">Share with friends. Viewer refs need 2h watch + 20 chat messages to qualify.</p>
            </div>
            <div className="flex items-center gap-2">
              <code className="px-5 py-3 rounded-xl bg-white/[0.03] border border-neon-pink/15 text-neon-pink font-mono font-bold text-sm tracking-widest">{user.referralCode}</code>
              <button onClick={copyCode} className="p-3 rounded-xl bg-neon-pink/10 hover:bg-neon-pink/20 transition-all">
                {copied ? <Check className="w-4 h-4 text-accent-emerald" /> : <Copy className="w-4 h-4 text-neon-pink" />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab Switcher */}
        <div className="flex gap-1 mb-8 p-1 glass rounded-2xl w-fit">
          {(['viewer', 'casino'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${activeTab === tab ? 'text-white' : 'text-white/35 hover:text-white/60'}`}>
              {activeTab === tab && (
                <motion.div layoutId="ref-tab" className={`absolute inset-0 rounded-xl ${tab === 'viewer' ? 'bg-neon-pink/80' : 'bg-gradient-to-r from-green-500/80 to-emerald-600/80'}`}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />
              )}
              <span className="relative capitalize">{tab} Referrals</span>
            </button>
          ))}
        </div>

        {activeTab === 'viewer' ? (
          <motion.div key="viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Requirements Info */}
            <div className="glass-card rounded-2xl p-4 mb-6 flex flex-wrap gap-5 items-center">
              <div className="flex items-center gap-2 text-xs"><Clock className="w-3.5 h-3.5 text-neon-pink" /><span className="text-white/40">Watch <strong className="text-white/80">2 hours</strong></span></div>
              <div className="flex items-center gap-2 text-xs"><MessageSquare className="w-3.5 h-3.5 text-neon-purple" /><span className="text-white/40">Send <strong className="text-white/80">20 messages</strong></span></div>
              <div className="flex items-center gap-2 text-xs"><DollarSign className="w-3.5 h-3.5 text-accent-emerald" /><span className="text-white/40">Earn <strong className="text-white/80">50 pts</strong> per ref</span></div>
            </div>

            <button onClick={handleSimViewerRef} className="mb-6 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-pink to-neon-purple font-semibold text-sm hover:shadow-neon-lg transition-all duration-500 flex items-center gap-2 shimmer-btn">
              <UserPlus className="w-3.5 h-3.5" /> Simulate Viewer Referral
            </button>

            {/* Viewer Refs Table */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-white/[0.04] text-[10px] text-white/30 font-semibold uppercase tracking-wider">
                <div className="col-span-3">Username</div>
                <div className="col-span-2">Joined</div>
                <div className="col-span-2 text-center">Watch Time</div>
                <div className="col-span-2 text-center">Messages</div>
                <div className="col-span-3 text-center">Status</div>
              </div>
              {user.viewerReferrals.length === 0 && <p className="text-center text-white/30 py-8">No viewer referrals yet</p>}
              {user.viewerReferrals.map((ref, i) => (
                <div key={ref.username + i} className="grid grid-cols-12 gap-3 px-5 py-3 items-center border-b border-white/[0.03] last:border-0 hover:bg-white/[0.015] transition-colors">
                  <div className="col-span-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-neon-pink/20 to-neon-purple/20 flex items-center justify-center text-[10px] font-bold">{ref.username[0]}</div>
                    <span className="text-xs font-medium">{ref.username}</span>
                  </div>
                  <div className="col-span-2 text-xs text-white/50">{ref.joinedAt}</div>
                  <div className="col-span-2 text-center">
                    <span className={`text-xs font-medium ${ref.watchTimeHours >= 2 ? 'text-green-400' : 'text-red-400'}`}>{ref.watchTimeHours}h / 2h</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className={`text-xs font-medium ${ref.chatMessages >= 20 ? 'text-green-400' : 'text-red-400'}`}>{ref.chatMessages} / 20</span>
                  </div>
                  <div className="col-span-3 text-center">
                    {ref.qualified ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-400 font-semibold"><CheckCircle className="w-3.5 h-3.5" />Qualified (+50 pts)</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-white/40"><XCircle className="w-3.5 h-3.5" />Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="casino" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Requirements Info */}
            <div className="glass-card rounded-2xl p-4 mb-6 flex flex-wrap gap-5 items-center">
              <div className="flex items-center gap-2 text-xs"><DollarSign className="w-3.5 h-3.5 text-accent-emerald" /><span className="text-white/40">Deposit <strong className="text-white/80">$1,000+</strong></span></div>
              <div className="flex items-center gap-2 text-xs"><DollarSign className="w-3.5 h-3.5 text-accent-gold" /><span className="text-white/40">Wager <strong className="text-white/80">$10,000+</strong></span></div>
              <div className="flex items-center gap-2 text-xs"><DollarSign className="w-3.5 h-3.5 text-neon-pink" /><span className="text-white/40">Earn <strong className="text-white/80">$100+</strong> per ref</span></div>
            </div>

            <div className="flex gap-2 mb-6">
              <button onClick={() => handleSimCasinoRef('winna')} className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 font-semibold text-xs hover:shadow-neon-lg transition-all duration-500 flex items-center gap-1.5 shimmer-btn">
                <UserPlus className="w-3.5 h-3.5" /> Sim Winna
              </button>
              <button onClick={() => handleSimCasinoRef('hypedrop')} className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 font-semibold text-xs hover:shadow-neon-lg transition-all duration-500 flex items-center gap-1.5 shimmer-btn">
                <UserPlus className="w-3.5 h-3.5" /> Sim Hypedrop
              </button>
            </div>

            {/* Casino Refs Table */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-white/[0.04] text-[10px] text-white/30 font-semibold uppercase tracking-wider">
                <div className="col-span-2">Username</div>
                <div className="col-span-2">Platform</div>
                <div className="col-span-2 text-right">Deposited</div>
                <div className="col-span-2 text-right">Wagered</div>
                <div className="col-span-2 text-right">Earnings</div>
                <div className="col-span-2 text-center">Status</div>
              </div>
              {user.casinoReferrals.length === 0 && <p className="text-center text-white/30 py-8">No casino referrals yet</p>}
              {user.casinoReferrals.map((ref, i) => (
                <div key={ref.username + i} className="grid grid-cols-12 gap-3 px-5 py-3 items-center border-b border-white/[0.03] last:border-0 hover:bg-white/[0.015] transition-colors">
                  <div className="col-span-2 text-sm font-medium">{ref.username}</div>
                  <div className="col-span-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${ref.platform === 'winna' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                      {ref.platform}
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className={`text-xs font-medium ${ref.deposited >= 1000 ? 'text-green-400' : 'text-red-400'}`}>${ref.deposited.toLocaleString()}</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className={`text-xs font-medium ${ref.wagered >= 10000 ? 'text-green-400' : 'text-red-400'}`}>${ref.wagered.toLocaleString()}</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className={`text-sm font-bold ${ref.earnedUSD > 0 ? 'text-green-400' : 'text-white/30'}`}>${ref.earnedUSD}</span>
                  </div>
                  <div className="col-span-2 text-center">
                    {ref.qualified ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-400 font-semibold"><CheckCircle className="w-3.5 h-3.5" />Confirmed</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-white/40"><XCircle className="w-3.5 h-3.5" />Not qualified</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
