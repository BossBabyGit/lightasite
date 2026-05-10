'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type RankTier = 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'VIP'

export interface CasinoAccountStats {
  deposited: number
  wagered: number
  profit: number
}

export interface User {
  username: string
  rank: RankTier
  points: number
  watchTimeHours: number
  chatMessages: number
  referralCode: string
  connectedAccounts: {
    hypedrop: boolean
    winna: boolean
  }
  casinoStats: {
    winna: CasinoAccountStats | null
    hypedrop: CasinoAccountStats | null
  }
  viewerReferrals: ViewerReferral[]
  casinoReferrals: CasinoReferral[]
}

export interface Bonus {
  id: string
  platform: 'winna' | 'hypedrop'
  name: string
  code: string
  description: string
  features: string[]
  active: boolean
}

export interface ViewerReferral {
  username: string
  joinedAt: string
  watchTimeHours: number
  chatMessages: number
  qualified: boolean
}

export interface CasinoReferral {
  username: string
  platform: 'winna' | 'hypedrop'
  deposited: number
  wagered: number
  qualified: boolean
  earnedUSD: number
}

export interface Raffle {
  id: string
  title: string
  prize: string
  prizeValue: number
  entryCost: number
  entries: RaffleEntry[]
  status: 'active' | 'ended'
  winner: string | null
  endsAt: string
}

export interface RaffleEntry {
  username: string
  ticketCount: number
}

export interface LeaderboardEntry {
  rank: number
  username: string
  wagered: number
  prize: number
}

export interface RegisteredUser {
  username: string
  rank: RankTier
  points: number
  watchTimeHours: number
  chatMessages: number
  joinedAt: string
  viewerReferrals: number
  casinoReferrals: number
  totalCasinoEarned: number
  winnaDeposits: number
  winnaWagered: number
  hypedropDeposits: number
  hypedropWagered: number
}

export interface PlatformStats {
  totalGivenAway: number
  totalCasinoRefEarnings: number
  totalViewerRefPoints: number
  totalUsers: number
  totalRafflesRun: number
}

interface AppContextType {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  isAdmin: boolean
  raffles: Raffle[]
  bonuses: Bonus[]
  platformStats: PlatformStats
  registeredUsers: RegisteredUser[]
  winnaLeaderboard: LeaderboardEntry[]
  hypedropLeaderboard: LeaderboardEntry[]
  login: () => void
  logout: () => void
  toggleAdmin: () => void
  addPoints: (amount: number) => void
  connectAccount: (account: 'hypedrop' | 'winna') => void
  disconnectAccount: (account: 'hypedrop' | 'winna') => void
  enterRaffle: (raffleId: string, tickets: number) => void
  createRaffle: (raffle: Omit<Raffle, 'id' | 'entries' | 'status' | 'winner'>) => void
  editRaffle: (id: string, updates: Partial<Raffle>) => void
  removeRaffle: (id: string) => void
  rollRaffle: (id: string) => Promise<string>
  simulateViewerRef: () => void
  simulateCasinoRef: (platform: 'winna' | 'hypedrop') => void
  setUserPoints: (amount: number) => void
  addPointsToUser: (username: string, amount: number) => void
  createBonus: (bonus: Omit<Bonus, 'id'>) => void
  editBonus: (id: string, updates: Partial<Bonus>) => void
  removeBonus: (id: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const RANKS: Array<{ name: RankTier; minHours: number; minMessages: number }> = [
  { name: 'Bronze', minHours: 0, minMessages: 0 },
  { name: 'Silver', minHours: 10, minMessages: 100 },
  { name: 'Gold', minHours: 50, minMessages: 500 },
  { name: 'Diamond', minHours: 150, minMessages: 2000 },
  { name: 'VIP', minHours: 500, minMessages: 5000 },
]

function getRank(hours: number, messages: number): RankTier {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (hours >= RANKS[i].minHours && messages >= RANKS[i].minMessages) return RANKS[i].name
  }
  return 'Bronze'
}

const MOCK_WINNA_LB: LeaderboardEntry[] = [
  { rank: 1, username: 'HighRoller77', wagered: 245000, prize: 5000 },
  { rank: 2, username: 'xGambler99', wagered: 198000, prize: 3000 },
  { rank: 3, username: 'NeonBet_King', wagered: 156000, prize: 1500 },
  { rank: 4, username: 'SlotMaster_X', wagered: 112000, prize: 750 },
  { rank: 5, username: 'CryptoGamble', wagered: 94000, prize: 500 },
  { rank: 6, username: 'LuckyViewer', wagered: 78000, prize: 300 },
  { rank: 7, username: 'CardShark', wagered: 65000, prize: 200 },
  { rank: 8, username: 'DiceRoller22', wagered: 52000, prize: 150 },
  { rank: 9, username: 'SpinWin99', wagered: 41000, prize: 100 },
  { rank: 10, username: 'RoulettePro', wagered: 32000, prize: 50 },
]

const MOCK_HYPEDROP_LB: LeaderboardEntry[] = [
  { rank: 1, username: 'BoxKing_X', wagered: 180000, prize: 4000 },
  { rank: 2, username: 'MysteryPro', wagered: 145000, prize: 2500 },
  { rank: 3, username: 'UnboxGod99', wagered: 120000, prize: 1200 },
  { rank: 4, username: 'xGambler99', wagered: 98000, prize: 600 },
  { rank: 5, username: 'HighRoller77', wagered: 85000, prize: 400 },
  { rank: 6, username: 'CrateMaster', wagered: 72000, prize: 250 },
  { rank: 7, username: 'LootDrop_22', wagered: 58000, prize: 150 },
  { rank: 8, username: 'PackOpener', wagered: 44000, prize: 100 },
  { rank: 9, username: 'NeonBet_King', wagered: 36000, prize: 75 },
  { rank: 10, username: 'GoldSeeker', wagered: 28000, prize: 50 },
]

const MOCK_RAFFLES: Raffle[] = [
  {
    id: 'raffle-1',
    title: '$500 Cash Giveaway',
    prize: '$500 Cash',
    prizeValue: 500,
    entryCost: 50,
    entries: [
      { username: 'HighRoller77', ticketCount: 10 },
      { username: 'xGambler99', ticketCount: 5 },
      { username: 'NeonBet_King', ticketCount: 8 },
      { username: 'LuckyViewer', ticketCount: 3 },
      { username: 'CardShark', ticketCount: 6 },
    ],
    status: 'active',
    winner: null,
    endsAt: '2024-04-15',
  },
  {
    id: 'raffle-2',
    title: 'Hypedrop $1000 Box',
    prize: '$1000 Mystery Box',
    prizeValue: 1000,
    entryCost: 100,
    entries: [
      { username: 'BoxKing_X', ticketCount: 12 },
      { username: 'MysteryPro', ticketCount: 7 },
      { username: 'HighRoller77', ticketCount: 4 },
    ],
    status: 'active',
    winner: null,
    endsAt: '2024-04-20',
  },
  {
    id: 'raffle-3',
    title: 'Weekly $200 Raffle',
    prize: '$200 Cash',
    prizeValue: 200,
    entryCost: 25,
    entries: [
      { username: 'SpinWin99', ticketCount: 15 },
      { username: 'DiceRoller22', ticketCount: 8 },
      { username: 'RoulettePro', ticketCount: 20 },
      { username: 'LuckyViewer', ticketCount: 5 },
    ],
    status: 'active',
    winner: null,
    endsAt: '2024-04-12',
  },
]

const MOCK_USERS: RegisteredUser[] = [
  { username: 'HighRoller77', rank: 'VIP', points: 15420, watchTimeHours: 620, chatMessages: 8400, joinedAt: '2023-11-01', viewerReferrals: 12, casinoReferrals: 5, totalCasinoEarned: 2400, winnaDeposits: 18000, winnaWagered: 245000, hypedropDeposits: 8000, hypedropWagered: 85000 },
  { username: 'xGambler99', rank: 'Diamond', points: 12850, watchTimeHours: 280, chatMessages: 3200, joinedAt: '2023-12-15', viewerReferrals: 8, casinoReferrals: 3, totalCasinoEarned: 1500, winnaDeposits: 14000, winnaWagered: 198000, hypedropDeposits: 7500, hypedropWagered: 98000 },
  { username: 'NeonBet_King', rank: 'Gold', points: 9340, watchTimeHours: 95, chatMessages: 1200, joinedAt: '2024-01-05', viewerReferrals: 5, casinoReferrals: 2, totalCasinoEarned: 800, winnaDeposits: 9500, winnaWagered: 156000, hypedropDeposits: 2800, hypedropWagered: 36000 },
  { username: 'SlotMaster_X', rank: 'Gold', points: 7210, watchTimeHours: 72, chatMessages: 890, joinedAt: '2024-01-20', viewerReferrals: 3, casinoReferrals: 1, totalCasinoEarned: 400, winnaDeposits: 6000, winnaWagered: 112000, hypedropDeposits: 0, hypedropWagered: 0 },
  { username: 'LuckyViewer', rank: 'Silver', points: 4560, watchTimeHours: 35, chatMessages: 420, joinedAt: '2024-02-01', viewerReferrals: 2, casinoReferrals: 1, totalCasinoEarned: 200, winnaDeposits: 3200, winnaWagered: 78000, hypedropDeposits: 0, hypedropWagered: 0 },
  { username: 'CardShark', rank: 'Silver', points: 3890, watchTimeHours: 28, chatMessages: 310, joinedAt: '2024-02-10', viewerReferrals: 1, casinoReferrals: 0, totalCasinoEarned: 0, winnaDeposits: 0, winnaWagered: 0, hypedropDeposits: 0, hypedropWagered: 0 },
  { username: 'BoxKing_X', rank: 'Gold', points: 6200, watchTimeHours: 82, chatMessages: 750, joinedAt: '2024-01-12', viewerReferrals: 4, casinoReferrals: 2, totalCasinoEarned: 650, winnaDeposits: 0, winnaWagered: 0, hypedropDeposits: 12000, hypedropWagered: 180000 },
  { username: 'MysteryPro', rank: 'Silver', points: 3100, watchTimeHours: 22, chatMessages: 280, joinedAt: '2024-02-20', viewerReferrals: 1, casinoReferrals: 0, totalCasinoEarned: 0, winnaDeposits: 0, winnaWagered: 0, hypedropDeposits: 4500, hypedropWagered: 145000 },
  { username: 'DiceRoller22', rank: 'Bronze', points: 1200, watchTimeHours: 8, chatMessages: 95, joinedAt: '2024-03-01', viewerReferrals: 0, casinoReferrals: 0, totalCasinoEarned: 0, winnaDeposits: 500, winnaWagered: 8000, hypedropDeposits: 0, hypedropWagered: 0 },
  { username: 'SpinWin99', rank: 'Bronze', points: 800, watchTimeHours: 5, chatMessages: 60, joinedAt: '2024-03-10', viewerReferrals: 0, casinoReferrals: 0, totalCasinoEarned: 0, winnaDeposits: 0, winnaWagered: 0, hypedropDeposits: 200, hypedropWagered: 3000 },
]

const MOCK_BONUSES: Bonus[] = [
  {
    id: 'bonus-1',
    platform: 'winna',
    name: 'Winna Exclusive',
    code: 'LIGHTA',
    description: 'Exclusive deposit bonus + rakeback on all games. Premium casino with the best slots, live games, and instant crypto payouts.',
    features: ['Instant withdrawals', 'Provably fair games', 'Weekly leaderboard prizes', '24/7 Live support'],
    active: true,
  },
  {
    id: 'bonus-2',
    platform: 'hypedrop',
    name: 'Hypedrop Free Box',
    code: 'LIGHTA',
    description: 'Free mystery box on signup. The #1 mystery box platform. Open boxes, battle friends, and win real items.',
    features: ['Mystery boxes', 'Guaranteed value', 'Case battles', 'Box upgrades'],
    active: true,
  },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [raffles, setRaffles] = useState<Raffle[]>(MOCK_RAFFLES)
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(MOCK_USERS)
  const [bonuses, setBonuses] = useState<Bonus[]>(MOCK_BONUSES)
  const [winnaLeaderboard] = useState<LeaderboardEntry[]>(MOCK_WINNA_LB)
  const [hypedropLeaderboard] = useState<LeaderboardEntry[]>(MOCK_HYPEDROP_LB)

  const platformStats: PlatformStats = {
    totalGivenAway: 42500,
    totalCasinoRefEarnings: 18750,
    totalViewerRefPoints: 284000,
    totalUsers: 1247,
    totalRafflesRun: 38,
  }

  useEffect(() => {
    const savedUser = localStorage.getItem('lighta_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem('lighta_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('lighta_user')
    }
  }, [user])

  const login = () => {
    setIsLoading(true)
    setTimeout(() => {
      const newUser: User = {
        username: 'LightaViewer01',
        rank: 'Silver',
        points: 1250,
        watchTimeHours: 24,
        chatMessages: 340,
        referralCode: 'LIGHTA-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        connectedAccounts: { hypedrop: false, winna: false },
        casinoStats: { winna: null, hypedrop: null },
        viewerReferrals: [
          { username: 'FriendA', joinedAt: '2024-03-10', watchTimeHours: 3.5, chatMessages: 45, qualified: true },
          { username: 'FriendB', joinedAt: '2024-03-18', watchTimeHours: 0.5, chatMessages: 8, qualified: false },
        ],
        casinoReferrals: [
          { username: 'CasinoFriend1', platform: 'winna', deposited: 1500, wagered: 12000, qualified: true, earnedUSD: 150 },
          { username: 'CasinoFriend2', platform: 'hypedrop', deposited: 400, wagered: 3000, qualified: false, earnedUSD: 0 },
        ],
      }
      setUser(newUser)
      setIsLoading(false)
    }, 1500)
  }

  const logout = () => {
    setUser(null)
    setIsAdmin(false)
  }

  const toggleAdmin = () => setIsAdmin(!isAdmin)

  const addPoints = (amount: number) => {
    if (!user) return
    setUser({ ...user, points: user.points + amount })
  }

  const setUserPoints = (amount: number) => {
    if (!user) return
    setUser({ ...user, points: amount })
  }

  const connectAccount = (account: 'hypedrop' | 'winna') => {
    if (!user) return
    const mockStats: CasinoAccountStats = account === 'winna'
      ? { deposited: 2400, wagered: 48200, profit: 1850 }
      : { deposited: 1800, wagered: 32400, profit: -420 }
    setUser({
      ...user,
      connectedAccounts: { ...user.connectedAccounts, [account]: true },
      casinoStats: { ...user.casinoStats, [account]: mockStats },
    })
  }

  const disconnectAccount = (account: 'hypedrop' | 'winna') => {
    if (!user) return
    setUser({
      ...user,
      connectedAccounts: { ...user.connectedAccounts, [account]: false },
      casinoStats: { ...user.casinoStats, [account]: null },
    })
  }

  const enterRaffle = (raffleId: string, tickets: number) => {
    if (!user) return
    const cost = tickets * (raffles.find(r => r.id === raffleId)?.entryCost || 0)
    if (user.points < cost) return

    setUser({ ...user, points: user.points - cost })
    setRaffles(prev => prev.map(r => {
      if (r.id !== raffleId) return r
      const existing = r.entries.find(e => e.username === user.username)
      if (existing) {
        return { ...r, entries: r.entries.map(e => e.username === user.username ? { ...e, ticketCount: e.ticketCount + tickets } : e) }
      }
      return { ...r, entries: [...r.entries, { username: user.username, ticketCount: tickets }] }
    }))
  }

  const createRaffle = (raffle: Omit<Raffle, 'id' | 'entries' | 'status' | 'winner'>) => {
    const newRaffle: Raffle = {
      ...raffle,
      id: 'raffle-' + Date.now(),
      entries: [],
      status: 'active',
      winner: null,
    }
    setRaffles(prev => [...prev, newRaffle])
  }

  const editRaffle = (id: string, updates: Partial<Raffle>) => {
    setRaffles(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r))
  }

  const removeRaffle = (id: string) => {
    setRaffles(prev => prev.filter(r => r.id !== id))
  }

  const rollRaffle = (id: string): Promise<string> => {
    return new Promise(resolve => {
      const raffle = raffles.find(r => r.id === id)
      if (!raffle || raffle.entries.length === 0) { resolve('No participants'); return }

      const totalTickets = raffle.entries.reduce((sum, e) => sum + e.ticketCount, 0)
      let random = Math.floor(Math.random() * totalTickets)
      let winner = raffle.entries[0].username
      for (const entry of raffle.entries) {
        random -= entry.ticketCount
        if (random <= 0) { winner = entry.username; break }
      }

      setTimeout(() => {
        setRaffles(prev => prev.map(r => r.id === id ? { ...r, status: 'ended', winner } : r))
        resolve(winner)
      }, 3000)
    })
  }

  const simulateViewerRef = () => {
    if (!user) return
    const names = ['Viewer_', 'KickFan_', 'Watcher_', 'Chatter_', 'StreamPal_']
    const name = names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 999)
    const watchTime = Math.random() * 4
    const msgs = Math.floor(Math.random() * 40)
    const qualified = watchTime >= 2 && msgs >= 20

    const newRef: ViewerReferral = {
      username: name,
      joinedAt: new Date().toISOString().split('T')[0],
      watchTimeHours: parseFloat(watchTime.toFixed(1)),
      chatMessages: msgs,
      qualified,
    }
    const newPoints = qualified ? user.points + 50 : user.points
    setUser({ ...user, viewerReferrals: [newRef, ...user.viewerReferrals], points: newPoints })
  }

  const simulateCasinoRef = (platform: 'winna' | 'hypedrop') => {
    if (!user) return
    const names = ['Player_', 'Gambler_', 'Bettor_', 'Whale_']
    const name = names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 999)
    const deposited = Math.floor(Math.random() * 3000)
    const wagered = deposited * (2 + Math.random() * 8)
    const qualified = deposited >= 1000 && wagered >= 10000
    const earned = qualified ? 100 + Math.floor((wagered - 10000) * 0.01) : 0

    const newRef: CasinoReferral = {
      username: name,
      platform,
      deposited,
      wagered: Math.floor(wagered),
      qualified,
      earnedUSD: earned,
    }
    setUser({ ...user, casinoReferrals: [newRef, ...user.casinoReferrals] })
  }

  const addPointsToUser = (username: string, amount: number) => {
    setRegisteredUsers(prev => prev.map(u => u.username === username ? { ...u, points: u.points + amount } : u))
    if (user && user.username === username) setUser({ ...user, points: user.points + amount })
  }

  const createBonus = (bonus: Omit<Bonus, 'id'>) => {
    setBonuses(prev => [...prev, { ...bonus, id: 'bonus-' + Date.now() }])
  }

  const editBonus = (id: string, updates: Partial<Bonus>) => {
    setBonuses(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
  }

  const removeBonus = (id: string) => {
    setBonuses(prev => prev.filter(b => b.id !== id))
  }

  return (
    <AppContext.Provider value={{
      user,
      isLoggedIn: !!user,
      isLoading,
      isAdmin,
      raffles,
      bonuses,
      platformStats,
      registeredUsers,
      winnaLeaderboard,
      hypedropLeaderboard,
      login,
      logout,
      toggleAdmin,
      addPoints,
      connectAccount,
      disconnectAccount,
      enterRaffle,
      createRaffle,
      editRaffle,
      removeRaffle,
      rollRaffle,
      simulateViewerRef,
      simulateCasinoRef,
      setUserPoints,
      addPointsToUser,
      createBonus,
      editBonus,
      removeBonus,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}

export { RANKS, getRank }
