'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import type { RegisteredUser, Bonus } from '@/context/AppContext'
import { Shield, Users, Zap, DollarSign, Ticket, Plus, Trash2, Play, Edit3, X, Clock, MessageSquare, ChevronRight, Gift, Eye, BarChart3, Sparkles, Radio, Trophy } from 'lucide-react'
import AdminStreamTab from '@/components/AdminStreamTab'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

type AdminTab = 'overview' | 'users' | 'raffles' | 'bonuses' | 'stream'

const ADMIN_TABS: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'raffles', label: 'Raffles', icon: Ticket },
  { id: 'bonuses', label: 'Bonuses', icon: Gift },
  { id: 'stream', label: 'Stream', icon: Radio },
]

const inputClass = "px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] focus:border-neon-pink/30 outline-none text-xs transition-colors w-full"

export default function AdminPage() {
  const { user, isLoggedIn, isAdmin, raffles, bonuses, registeredUsers, createRaffle, editRaffle, removeRaffle, rollRaffle, addPoints, setUserPoints, addPointsToUser, createBonus, editBonus, removeBonus } = useApp()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const [rollingId, setRollingId] = useState<string | null>(null)
  const [rollingName, setRollingName] = useState<string | null>(null)
  const [rollingWinner, setRollingWinner] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newRaffle, setNewRaffle] = useState({ title: '', prize: '', prizeValue: '', entryCost: '' })
  const [pointsInput, setPointsInput] = useState('')
  const [selectedUser, setSelectedUser] = useState<RegisteredUser | null>(null)
  const [userPointsInput, setUserPointsInput] = useState('')
  const [showBonusForm, setShowBonusForm] = useState(false)
  const [editingBonus, setEditingBonus] = useState<Bonus | null>(null)
  const [newBonus, setNewBonus] = useState({ platform: 'winna' as 'winna' | 'hypedrop', name: '', code: '', description: '', features: '' })
  const rollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) router.push('/')
  }, [isLoggedIn, isAdmin, router])

  if (!user || !isAdmin) return null

  const handleCreateRaffle = () => {
    if (!newRaffle.title || !newRaffle.prize || !newRaffle.prizeValue || !newRaffle.entryCost) { toast.error('Fill in all fields'); return }
    createRaffle({ title: newRaffle.title, prize: newRaffle.prize, prizeValue: parseInt(newRaffle.prizeValue), entryCost: parseInt(newRaffle.entryCost), endsAt: '2024-12-31' })
    toast.success('Raffle created!')
    setNewRaffle({ title: '', prize: '', prizeValue: '', entryCost: '' })
    setShowCreateForm(false)
  }

  const [reelNames, setReelNames] = useState<string[]>([])
  const [reelOffset, setReelOffset] = useState(0)
  const reelAnimRef = useRef<number | null>(null)

  const handleRoll = async (id: string) => {
    const raffle = raffles.find(r => r.id === id)
    if (!raffle || raffle.entries.length === 0) return
    setRollingId(id)
    setRollingWinner(null)
    const names = raffle.entries.map(e => e.username)
    // Build a long reel: shuffle names many times, winner lands at the end
    const winner = await rollRaffle(id)
    const shuffled: string[] = []
    for (let r = 0; r < 8; r++) {
      const copy = [...names].sort(() => Math.random() - 0.5)
      shuffled.push(...copy)
    }
    shuffled.push(winner)
    setReelNames(shuffled)
    setReelOffset(0)

    const ITEM_H = 56
    const totalDistance = (shuffled.length - 1) * ITEM_H
    const duration = 4000
    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic for deceleration
      const eased = 1 - Math.pow(1 - progress, 3)
      setReelOffset(eased * totalDistance)
      if (progress < 1) {
        reelAnimRef.current = requestAnimationFrame(animate)
      } else {
        setReelOffset(totalDistance)
        setTimeout(() => {
          setRollingName(null)
          setReelNames([])
          setRollingWinner(winner)
          setRollingId(null)
          toast.success(`Winner: ${winner}!`, { duration: 5000 })
        }, 600)
      }
    }
    reelAnimRef.current = requestAnimationFrame(animate)
  }

  const handleSaveBonus = () => {
    const features = newBonus.features.split(',').map(f => f.trim()).filter(Boolean)
    if (!newBonus.name || !newBonus.code) { toast.error('Name and code required'); return }
    if (editingBonus) {
      editBonus(editingBonus.id, { ...newBonus, features })
      toast.success('Bonus updated')
    } else {
      createBonus({ ...newBonus, features, active: true })
      toast.success('Bonus created')
    }
    setNewBonus({ platform: 'winna', name: '', code: '', description: '', features: '' })
    setShowBonusForm(false)
    setEditingBonus(null)
  }

  const startEditBonus = (b: Bonus) => {
    setEditingBonus(b)
    setNewBonus({ platform: b.platform, name: b.name, code: b.code, description: b.description, features: b.features.join(', ') })
    setShowBonusForm(true)
  }

  const totalViewerRefs = registeredUsers.reduce((sum, u) => sum + u.viewerReferrals, 0)
  const totalCasinoRefs = registeredUsers.reduce((sum, u) => sum + u.casinoReferrals, 0)
  const totalCasinoEarned = registeredUsers.reduce((sum, u) => sum + u.totalCasinoEarned, 0)

  const rankColor = (rank: string) =>
    rank === 'VIP' ? 'bg-neon-pink/15 text-neon-pink' :
    rank === 'Diamond' ? 'bg-neon-cyan/15 text-neon-cyan' :
    rank === 'Gold' ? 'bg-accent-gold/15 text-accent-gold' :
    rank === 'Silver' ? 'bg-gray-400/15 text-gray-300' : 'bg-amber-700/15 text-amber-500'

  return (
    <div className="min-h-screen py-16 px-6 relative">
      <div className="absolute inset-0 bg-mesh-1 opacity-20" />
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.25em] text-neon-pink/60 font-semibold mb-3">Control Panel</p>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-neon-pink" />
            <h1 className="text-3xl font-bold">Admin <span className="gradient-text">Dashboard</span></h1>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 p-1 glass rounded-2xl w-fit">
          {ADMIN_TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id ? 'text-white' : 'text-white/30 hover:text-white/50'}`}>
              {activeTab === tab.id && (
                <motion.div layoutId="admin-tab" className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-pink/80 to-neon-purple/80"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />
              )}
              <span className="relative flex items-center gap-2"><tab.icon className="w-3.5 h-3.5" />{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ======================== OVERVIEW TAB ======================== */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
              {[
                { label: 'Users', value: registeredUsers.length, icon: Users, color: 'text-neon-pink', gradient: 'from-neon-pink/20 to-neon-pink/5' },
                { label: 'Viewer Refs', value: totalViewerRefs, icon: Users, color: 'text-neon-purple', gradient: 'from-neon-purple/20 to-neon-purple/5' },
                { label: 'Casino Refs', value: totalCasinoRefs, icon: DollarSign, color: 'text-accent-emerald', gradient: 'from-accent-emerald/20 to-accent-emerald/5' },
                { label: 'Casino $', value: `$${totalCasinoEarned.toLocaleString()}`, icon: DollarSign, color: 'text-accent-gold', gradient: 'from-accent-gold/20 to-accent-gold/5' },
                { label: 'Active Raffles', value: raffles.filter(r => r.status === 'active').length, icon: Ticket, color: 'text-neon-cyan', gradient: 'from-neon-cyan/20 to-neon-cyan/5' },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-xl p-4 text-center group">
                  <div className={`w-8 h-8 mx-auto rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500`}>
                    <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                  </div>
                  <p className="text-lg font-bold stat-number">{s.value}</p>
                  <p className="text-[10px] text-white/25 uppercase tracking-wider">{s.label}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-neon-pink" />
                  <h3 className="font-bold text-sm">Quick Points</h3>
                </div>
                <p className="text-[10px] text-white/30 mb-3">Your points: <span className="text-neon-pink stat-number font-semibold">{user.points.toLocaleString()}</span></p>
                <div className="flex gap-2">
                  <input type="number" value={pointsInput} onChange={e => setPointsInput(e.target.value)} placeholder="Set points..." className={inputClass} />
                  <button onClick={() => { if (pointsInput) { setUserPoints(parseInt(pointsInput)); toast.success('Updated'); setPointsInput('') } }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-neon-pink to-neon-purple font-semibold text-xs shimmer-btn whitespace-nowrap">Set</button>
                  <button onClick={() => { addPoints(500); toast.success('+500') }}
                    className="px-3 py-2 rounded-xl glass text-xs font-medium hover:bg-white/[0.04] transition-all whitespace-nowrap">+500</button>
                </div>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-neon-purple" />
                  <h3 className="font-bold text-sm">Quick Stats</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 text-center">
                    <p className="text-sm font-bold stat-number">{bonuses.filter(b => b.active).length}</p>
                    <p className="text-[9px] text-white/25 uppercase tracking-wider">Bonuses</p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 text-center">
                    <p className="text-sm font-bold stat-number">{raffles.filter(r => r.status === 'ended').length}</p>
                    <p className="text-[9px] text-white/25 uppercase tracking-wider">Ended Raffles</p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 text-center">
                    <p className="text-sm font-bold stat-number">{raffles.reduce((s, r) => s + r.entries.reduce((s2, e) => s2 + e.ticketCount, 0), 0)}</p>
                    <p className="text-[9px] text-white/25 uppercase tracking-wider">Total Tickets</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================== USERS TAB ======================== */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-white/[0.04] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm">All Users</h3>
                  <p className="text-[10px] text-white/30 mt-0.5">{registeredUsers.length} registered — click for details</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      {['User', 'Rank', 'Points', 'Watch', 'Msgs', 'V.Refs', 'C.Refs', 'Casino $', ''].map(h => (
                        <th key={h} className={`px-4 py-2.5 text-[9px] font-semibold text-white/25 uppercase tracking-wider ${h === 'User' || h === 'Rank' ? 'text-left' : 'text-right'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {registeredUsers.map(u => (
                      <tr key={u.username} onClick={() => setSelectedUser(u)} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer">
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-neon-pink/20 to-neon-purple/20 flex items-center justify-center text-[10px] font-bold">{u.username[0]}</div>
                            <span className="text-xs font-medium">{u.username}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5"><span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${rankColor(u.rank)}`}>{u.rank}</span></td>
                        <td className="px-4 py-2.5 text-right text-xs stat-number">{u.points.toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-right text-[10px] text-white/35">{u.watchTimeHours}h</td>
                        <td className="px-4 py-2.5 text-right text-[10px] text-white/35">{u.chatMessages.toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-right text-[10px] text-white/35">{u.viewerReferrals}</td>
                        <td className="px-4 py-2.5 text-right text-[10px] text-white/35">{u.casinoReferrals}</td>
                        <td className="px-4 py-2.5 text-right text-[10px] font-medium text-accent-emerald">${u.totalCasinoEarned.toLocaleString()}</td>
                        <td className="px-4 py-2.5 text-right"><ChevronRight className="w-3 h-3 text-white/15" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* User Detail Drawer */}
            <AnimatePresence>
              {selectedUser && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
                  <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                    className="h-full w-full max-w-md bg-dark-900/95 border-l border-white/[0.06] p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-lg">User Details</h3>
                      <button onClick={() => setSelectedUser(null)} className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-all"><X className="w-4 h-4 text-white/40" /></button>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-pink/20 to-neon-purple/20 flex items-center justify-center text-lg font-bold">{selectedUser.username[0]}</div>
                      <div>
                        <p className="font-bold">{selectedUser.username}</p>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rankColor(selectedUser.rank)}`}>{selectedUser.rank}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {[
                        { label: 'Points', value: selectedUser.points.toLocaleString(), icon: Sparkles, color: 'text-neon-pink' },
                        { label: 'Watch Time', value: `${selectedUser.watchTimeHours}h`, icon: Clock, color: 'text-neon-purple' },
                        { label: 'Messages', value: selectedUser.chatMessages.toLocaleString(), icon: MessageSquare, color: 'text-neon-cyan' },
                        { label: 'Joined', value: selectedUser.joinedAt, icon: Users, color: 'text-white/40' },
                      ].map(s => (
                        <div key={s.label} className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3">
                          <s.icon className={`w-3 h-3 ${s.color} mb-1`} />
                          <p className="text-sm font-bold stat-number">{s.value}</p>
                          <p className="text-[9px] text-white/25 uppercase tracking-wider">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="glass-card rounded-xl p-4 mb-4">
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3 font-semibold">Referrals</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center">
                          <p className="text-lg font-bold stat-number text-neon-pink">{selectedUser.viewerReferrals}</p>
                          <p className="text-[9px] text-white/25">Viewer Refs</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold stat-number text-accent-emerald">{selectedUser.casinoReferrals}</p>
                          <p className="text-[9px] text-white/25">Casino Refs</p>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card rounded-xl p-4 mb-4">
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3 font-semibold">Casino Stats</p>
                      <div className="space-y-2">
                        {[
                          { label: 'Winna', depo: selectedUser.winnaDeposits, wager: selectedUser.winnaWagered, color: 'text-green-400', bg: 'bg-green-500/15' },
                          { label: 'Hypedrop', depo: selectedUser.hypedropDeposits, wager: selectedUser.hypedropWagered, color: 'text-orange-400', bg: 'bg-orange-500/15' },
                        ].map(c => (
                          <div key={c.label} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-md ${c.bg} flex items-center justify-center text-[9px] font-bold ${c.color}`}>{c.label[0]}</div>
                              <span className="text-xs font-medium">{c.label}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-white/40">Depo: <span className="text-white/70 stat-number">${c.depo.toLocaleString()}</span></p>
                              <p className="text-[10px] text-white/40">Wager: <span className="text-white/70 stat-number">${c.wager.toLocaleString()}</span></p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card rounded-xl p-4">
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3 font-semibold">Add Points</p>
                      <div className="flex gap-2">
                        <input type="number" value={userPointsInput} onChange={e => setUserPointsInput(e.target.value)} placeholder="Amount..." className={inputClass} />
                        <button onClick={() => {
                          if (userPointsInput && selectedUser) {
                            addPointsToUser(selectedUser.username, parseInt(userPointsInput))
                            toast.success(`+${userPointsInput} pts to ${selectedUser.username}`)
                            setSelectedUser({ ...selectedUser, points: selectedUser.points + parseInt(userPointsInput) })
                            setUserPointsInput('')
                          }
                        }} className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-pink to-neon-purple font-semibold text-xs whitespace-nowrap">Add</button>
                      </div>
                      <div className="flex gap-1.5 mt-2">
                        {[100, 500, 1000, 5000].map(amt => (
                          <button key={amt} onClick={() => {
                            if (selectedUser) {
                              addPointsToUser(selectedUser.username, amt)
                              toast.success(`+${amt} pts`)
                              setSelectedUser({ ...selectedUser, points: selectedUser.points + amt })
                            }
                          }} className="flex-1 py-1.5 rounded-lg text-[10px] font-medium bg-white/[0.03] border border-white/[0.06] hover:border-neon-pink/20 transition-all">+{amt}</button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ======================== RAFFLES TAB ======================== */}
        {activeTab === 'raffles' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {/* Rolling Animation Overlay */}
            <AnimatePresence>
              {(rollingId || rollingWinner) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                    className="glass-card rounded-3xl p-10 text-center w-full max-w-md mx-auto relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/[0.04] to-neon-purple/[0.04]" />
                    <div className="relative">
                      {rollingWinner ? (
                        <>
                          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
                            className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-neon-pink to-neon-purple flex items-center justify-center mb-5 shadow-neon-xl">
                            <Trophy className="w-7 h-7 text-white" />
                          </motion.div>
                          <p className="text-[10px] text-white/30 uppercase tracking-[0.25em] mb-2">Winner</p>
                          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-2xl font-black gradient-text mb-6">{rollingWinner}</motion.p>
                          <button onClick={() => setRollingWinner(null)} className="px-6 py-2 rounded-xl glass text-xs font-medium hover:bg-white/[0.04] transition-all">Close</button>
                        </>
                      ) : (
                        <>
                          <p className="text-[10px] text-white/30 uppercase tracking-[0.25em] mb-5">Rolling</p>
                          {/* Slot machine reel */}
                          <div className="relative h-14 overflow-hidden rounded-xl bg-white/[0.02] border border-white/[0.06] mx-auto">
                            {/* Selection indicator */}
                            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-neon-pink to-neon-purple rounded-l-xl z-10" />
                            <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-neon-pink to-neon-purple rounded-r-xl z-10" />
                            <div className="absolute inset-0 border border-neon-pink/20 rounded-xl z-10 pointer-events-none" />
                            {/* Reel strip */}
                            <div style={{ transform: `translateY(-${reelOffset}px)` }}>
                              {reelNames.map((name, i) => (
                                <div key={i} className="h-14 flex items-center justify-center">
                                  <span className="text-lg font-bold text-white/80">{name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Top/bottom fade masks */}
                          <div className="relative -mt-14 h-14 pointer-events-none rounded-xl overflow-hidden">
                            <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-dark-900/80 to-transparent z-20" />
                            <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-dark-900/80 to-transparent z-20" />
                          </div>
                          <p className="text-[9px] text-white/15 mt-4 uppercase tracking-widest">Selecting winner...</p>
                        </>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-sm">Raffle Management</h3>
              <button onClick={() => setShowCreateForm(!showCreateForm)} className="px-3 py-1.5 rounded-xl bg-neon-pink/10 text-neon-pink text-xs font-medium hover:bg-neon-pink/20 transition-all flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Create Raffle
              </button>
            </div>

            {showCreateForm && (
              <div className="glass-card rounded-xl p-4 mb-5 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input type="text" value={newRaffle.title} onChange={e => setNewRaffle({ ...newRaffle, title: e.target.value })} placeholder="Title" className={inputClass} />
                  <input type="text" value={newRaffle.prize} onChange={e => setNewRaffle({ ...newRaffle, prize: e.target.value })} placeholder="Prize" className={inputClass} />
                  <input type="number" value={newRaffle.prizeValue} onChange={e => setNewRaffle({ ...newRaffle, prizeValue: e.target.value })} placeholder="Value ($)" className={inputClass} />
                  <input type="number" value={newRaffle.entryCost} onChange={e => setNewRaffle({ ...newRaffle, entryCost: e.target.value })} placeholder="Cost (pts)" className={inputClass} />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleCreateRaffle} className="px-5 py-2 rounded-xl bg-gradient-to-r from-neon-pink to-neon-purple font-semibold text-xs">Create</button>
                  <button onClick={() => setShowCreateForm(false)} className="px-5 py-2 rounded-xl glass text-xs hover:bg-white/[0.04]">Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {raffles.map(raffle => {
                const totalTickets = raffle.entries.reduce((s, e) => s + e.ticketCount, 0)
                return (
                  <div key={raffle.id} className={`glass-card rounded-xl p-4 ${raffle.status !== 'active' ? 'opacity-50' : ''}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-xs">{raffle.title}</h4>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${raffle.status === 'active' ? 'bg-accent-emerald/15 text-accent-emerald' : 'bg-white/[0.06] text-white/30'}`}>{raffle.status}</span>
                        </div>
                        <p className="text-[10px] text-white/30">{raffle.prize} • ${raffle.prizeValue} • {raffle.entryCost} pts/entry</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex gap-4 text-center">
                          <div><p className="text-sm font-bold stat-number">{raffle.entries.length}</p><p className="text-[8px] text-white/20 uppercase">Players</p></div>
                          <div><p className="text-sm font-bold stat-number">{totalTickets}</p><p className="text-[8px] text-white/20 uppercase">Tickets</p></div>
                        </div>
                        {raffle.status === 'active' && (
                          <div className="flex gap-1.5">
                            <button onClick={() => handleRoll(raffle.id)} disabled={rollingId === raffle.id || raffle.entries.length === 0}
                              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-neon-pink to-neon-purple text-xs font-semibold flex items-center gap-1 disabled:opacity-40 shimmer-btn">
                              <Play className="w-3 h-3" />Roll
                            </button>
                            <button onClick={() => { removeRaffle(raffle.id); toast.success('Removed') }}
                              className="px-2 py-1.5 rounded-lg border border-red-400/10 text-red-400/60 hover:bg-red-500/10 transition-all">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {raffle.winner && (
                      <div className="mt-2 pt-2 border-t border-white/[0.04] flex items-center gap-2">
                        <span className="text-[10px] text-white/30">Winner:</span>
                        <span className="text-xs font-bold text-neon-pink">{raffle.winner}</span>
                      </div>
                    )}
                  </div>
                )
              })}
              {raffles.length === 0 && <p className="text-center text-white/20 py-10 text-xs">No raffles yet</p>}
            </div>
          </motion.div>
        )}

        {/* ======================== BONUSES TAB ======================== */}
        {activeTab === 'bonuses' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-sm">Bonus Management</h3>
              <button onClick={() => { setShowBonusForm(true); setEditingBonus(null); setNewBonus({ platform: 'winna', name: '', code: '', description: '', features: '' }) }}
                className="px-3 py-1.5 rounded-xl bg-neon-pink/10 text-neon-pink text-xs font-medium hover:bg-neon-pink/20 transition-all flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Bonus
              </button>
            </div>

            {showBonusForm && (
              <div className="glass-card rounded-xl p-5 mb-5 space-y-3">
                <p className="text-xs font-bold mb-1">{editingBonus ? 'Edit Bonus' : 'New Bonus'}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <select value={newBonus.platform} onChange={e => setNewBonus({ ...newBonus, platform: e.target.value as 'winna' | 'hypedrop' })}
                    className={inputClass + ' appearance-none'}>
                    <option value="winna">Winna</option>
                    <option value="hypedrop">Hypedrop</option>
                  </select>
                  <input type="text" value={newBonus.name} onChange={e => setNewBonus({ ...newBonus, name: e.target.value })} placeholder="Bonus Name" className={inputClass} />
                  <input type="text" value={newBonus.code} onChange={e => setNewBonus({ ...newBonus, code: e.target.value })} placeholder="Code (e.g. LIGHTA)" className={inputClass} />
                  <input type="text" value={newBonus.features} onChange={e => setNewBonus({ ...newBonus, features: e.target.value })} placeholder="Features (comma separated)" className={inputClass} />
                </div>
                <textarea value={newBonus.description} onChange={e => setNewBonus({ ...newBonus, description: e.target.value })} placeholder="Description..."
                  className={inputClass + ' min-h-[60px] resize-none'} />
                <div className="flex gap-2">
                  <button onClick={handleSaveBonus} className="px-5 py-2 rounded-xl bg-gradient-to-r from-neon-pink to-neon-purple font-semibold text-xs">{editingBonus ? 'Save' : 'Create'}</button>
                  <button onClick={() => { setShowBonusForm(false); setEditingBonus(null) }} className="px-5 py-2 rounded-xl glass text-xs hover:bg-white/[0.04]">Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {bonuses.map(bonus => (
                <div key={bonus.id} className={`glass-card rounded-xl p-5 relative overflow-hidden ${!bonus.active ? 'opacity-50' : ''}`}>
                  <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] ${bonus.platform === 'winna' ? 'bg-green-500/[0.04]' : 'bg-orange-500/[0.04]'}`} />
                  <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${bonus.platform === 'winna' ? 'bg-green-500/15 text-green-400' : 'bg-orange-500/15 text-orange-400'}`}>
                          {bonus.platform === 'winna' ? 'W' : 'H'}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{bonus.name}</h4>
                          <p className="text-[10px] text-white/30 capitalize">{bonus.platform}</p>
                        </div>
                        <code className="ml-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neon-pink/10 text-neon-pink">{bonus.code}</code>
                        {bonus.active && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-accent-emerald/15 text-accent-emerald">Active</span>}
                      </div>
                      <p className="text-xs text-white/35 mb-2 leading-relaxed">{bonus.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {bonus.features.map(f => (
                          <span key={f} className="px-2 py-1 rounded-md bg-white/[0.02] border border-white/[0.04] text-[10px] text-white/40">{f}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button onClick={() => startEditBonus(bonus)} className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/70 transition-all">
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button onClick={() => editBonus(bonus.id, { active: !bonus.active })} className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/70 transition-all">
                        <Eye className="w-3 h-3" />
                      </button>
                      <button onClick={() => { removeBonus(bonus.id); toast.success('Bonus removed') }}
                        className="px-2.5 py-1.5 rounded-lg border border-red-400/10 text-red-400/60 hover:bg-red-500/10 transition-all">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {bonuses.length === 0 && <p className="text-center text-white/20 py-10 text-xs">No bonuses configured</p>}
            </div>
          </motion.div>
        )}
        {/* ======================== STREAM TAB ======================== */}
        {activeTab === 'stream' && <AdminStreamTab />}
      </div>
    </div>
  )
}
