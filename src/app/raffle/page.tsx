'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { Ticket, Trophy, DollarSign, Users, Minus, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function RafflePage() {
  const { user, isLoggedIn, raffles, enterRaffle } = useApp()
  const router = useRouter()
  const [ticketAmounts, setTicketAmounts] = useState<Record<string, number>>({})

  useEffect(() => {
    if (!isLoggedIn) router.push('/')
  }, [isLoggedIn, router])

  if (!user) return null

  const activeRaffles = raffles.filter(r => r.status === 'active')
  const endedRaffles = raffles.filter(r => r.status === 'ended')

  const getTicketAmount = (id: string) => ticketAmounts[id] || 1
  const setTicketAmount = (id: string, val: number) => {
    if (val < 1) val = 1
    setTicketAmounts(prev => ({ ...prev, [id]: val }))
  }

  const handleEnter = (raffleId: string) => {
    const raffle = raffles.find(r => r.id === raffleId)
    if (!raffle) return
    const tickets = getTicketAmount(raffleId)
    const cost = tickets * raffle.entryCost
    if (user.points < cost) {
      toast.error(`Not enough points! Need ${cost} pts, you have ${user.points}`)
      return
    }
    enterRaffle(raffleId, tickets)
    toast.success(`Entered ${tickets} ticket(s) for ${cost} points!`)
  }

  const getUserChance = (raffleId: string) => {
    const raffle = raffles.find(r => r.id === raffleId)
    if (!raffle) return 0
    const totalTickets = raffle.entries.reduce((sum, e) => sum + e.ticketCount, 0)
    const myEntry = raffle.entries.find(e => e.username === user.username)
    if (!myEntry || totalTickets === 0) return 0
    return (myEntry.ticketCount / totalTickets) * 100
  }

  const getUserTickets = (raffleId: string) => {
    const raffle = raffles.find(r => r.id === raffleId)
    return raffle?.entries.find(e => e.username === user.username)?.ticketCount || 0
  }

  return (
    <div className="min-h-screen py-16 px-6 relative">
      <div className="absolute inset-0 bg-mesh-1 opacity-30" />
      <div className="relative max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <p className="text-[10px] uppercase tracking-[0.25em] text-neon-pink/60 font-semibold mb-3">Giveaways</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Active <span className="gradient-text">Raffles</span>
          </h1>
          <p className="text-white/40">Spend points on entries — unlimited entries per raffle</p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full glass-card text-xs">
            <span className="text-white/40">Your balance:</span>
            <span className="text-neon-pink font-bold stat-number">{user.points.toLocaleString()} pts</span>
          </div>
        </motion.div>

        {/* Active Raffles */}
        {activeRaffles.length === 0 && (
          <div className="text-center text-white/20 py-20 glass-card rounded-2xl">No active raffles right now. Check back soon!</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {activeRaffles.map((raffle, i) => {
            const totalTickets = raffle.entries.reduce((sum, e) => sum + e.ticketCount, 0)
            const myTickets = getUserTickets(raffle.id)
            const myChance = getUserChance(raffle.id)
            const ticketsToBuy = getTicketAmount(raffle.id)
            const cost = ticketsToBuy * raffle.entryCost

            return (
              <motion.div
                key={raffle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{raffle.title}</h3>
                    <p className="text-white/50 text-sm">{raffle.prize}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-accent-emerald stat-number">${raffle.prizeValue}</p>
                    <p className="text-xs text-white/30">Prize value</p>
                  </div>
                </div>

                {/* Info row */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 text-center">
                    <Ticket className="w-3.5 h-3.5 mx-auto mb-1 text-neon-pink" />
                    <p className="text-sm font-bold stat-number">{totalTickets}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">Entries</p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 text-center">
                    <Users className="w-3.5 h-3.5 mx-auto mb-1 text-neon-purple" />
                    <p className="text-sm font-bold stat-number">{raffle.entries.length}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">Players</p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 text-center">
                    <DollarSign className="w-3.5 h-3.5 mx-auto mb-1 text-accent-gold" />
                    <p className="text-sm font-bold stat-number">{raffle.entryCost}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">Pts/Entry</p>
                  </div>
                </div>

                {/* My stats */}
                {myTickets > 0 && (
                  <div className="bg-neon-pink/5 border border-neon-pink/10 rounded-xl p-3 mb-5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/50">Your entries: <strong className="text-white">{myTickets}</strong></span>
                      <span className="text-xs font-bold text-neon-pink">Win chance: {myChance.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-dark-700 mt-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(myChance, 100)}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-neon-pink to-neon-purple"
                      />
                    </div>
                  </div>
                )}

                {/* Entry controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 glass rounded-xl overflow-hidden">
                    <button onClick={() => setTicketAmount(raffle.id, ticketsToBuy - 1)} className="px-3 py-2.5 hover:bg-white/5 transition-colors">
                      <Minus className="w-4 h-4 text-white/50" />
                    </button>
                    <span className="px-3 text-sm font-bold min-w-[40px] text-center">{ticketsToBuy}</span>
                    <button onClick={() => setTicketAmount(raffle.id, ticketsToBuy + 1)} className="px-3 py-2.5 hover:bg-white/5 transition-colors">
                      <Plus className="w-4 h-4 text-white/50" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleEnter(raffle.id)}
                    disabled={user.points < cost}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-neon-pink to-neon-purple font-semibold text-sm hover:shadow-neon-lg transition-all duration-500 disabled:opacity-40 shimmer-btn"
                  >
                    Enter ({cost} pts)
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Ended Raffles */}
        {endedRaffles.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-6">Past Raffles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {endedRaffles.map((raffle) => (
                <div key={raffle.id} className="glass-card rounded-2xl p-5 opacity-60">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <h3 className="font-bold text-sm">{raffle.title}</h3>
                  </div>
                  <p className="text-green-400 font-bold">{raffle.prize}</p>
                  <p className="text-xs text-white/40 mt-2">Winner: <span className="text-neon-pink font-semibold">{raffle.winner}</span></p>
                  <p className="text-xs text-white/30 mt-1">{raffle.entries.reduce((s, e) => s + e.ticketCount, 0)} total entries</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
