'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Square, Trash2, Plus, MessageSquare, BarChart3, Zap, Trophy, Hash, Radio } from 'lucide-react'
import toast from 'react-hot-toast'

interface ChatMsg {
  id: string
  username: string
  message: string
  isCommand: boolean
  color: string
  timestamp: number
}

interface PollOption {
  label: string
  votes: number
  color: string
}

interface Poll {
  id: string
  question: string
  command: string
  options: PollOption[]
  status: 'active' | 'ended'
  totalVotes: number
}

const CHAT_COLORS = [
  'text-neon-pink', 'text-neon-purple', 'text-neon-cyan', 'text-accent-gold',
  'text-accent-emerald', 'text-red-400', 'text-blue-400', 'text-green-400',
  'text-orange-400', 'text-yellow-300', 'text-pink-400', 'text-violet-400',
]

const MOCK_USERNAMES = [
  'HighRoller77', 'xGambler99', 'NeonBet_King', 'SlotMaster_X', 'LuckyViewer',
  'BoxKing_X', 'CryptoGamble', 'SpinWin99', 'DiceRoller22', 'CardShark',
  'MysteryPro', 'RoulettePro', 'WhaleBet420', 'GoldSeeker', 'CrateMaster',
  'PackOpener', 'LootDrop_22', 'NightOwl_TV', 'BonusHunter', 'StreamFan42',
]

const REGULAR_MESSAGES = [
  'lets gooo', 'W stream', 'this is fire 🔥', 'yooo', 'LFGGG', 'nice one',
  'big hit incoming', 'lets get it', 'send it!', 'full send', 'sheeeesh',
  'nah thats crazy', 'hahaha', 'unlucky', 'rip balance', 'cmon bonus',
  'trust the process', 'easy money', 'no way', 'chat we winning', 'GGs',
  'W W W', 'ez clap', 'dead game jk', 'do it again', 'KEKW', 'OMEGALUL',
]

const POLL_PRESETS = [
  {
    label: 'Slot Pick',
    question: 'What slot should we play?',
    command: '!slot',
    options: [
      { label: 'Sweet Bonanza', votes: 0, color: 'from-pink-500 to-red-500' },
      { label: 'Gates of Olympus', votes: 0, color: 'from-yellow-400 to-amber-600' },
      { label: 'Sugar Rush', votes: 0, color: 'from-purple-500 to-pink-500' },
      { label: 'Book of Dead', votes: 0, color: 'from-amber-600 to-yellow-800' },
      { label: 'Wanted Dead', votes: 0, color: 'from-red-600 to-orange-500' },
    ],
  },
  {
    label: 'Bet Size',
    question: 'What bet size?',
    command: '!bet',
    options: [
      { label: '$1', votes: 0, color: 'from-gray-400 to-gray-600' },
      { label: '$5', votes: 0, color: 'from-green-400 to-emerald-600' },
      { label: '$10', votes: 0, color: 'from-blue-400 to-blue-600' },
      { label: '$25', votes: 0, color: 'from-purple-400 to-purple-600' },
      { label: '$50', votes: 0, color: 'from-neon-pink to-neon-purple' },
    ],
  },
  {
    label: 'Game Mode',
    question: 'What should we play?',
    command: '!game',
    options: [
      { label: 'Slots', votes: 0, color: 'from-neon-pink to-rose-600' },
      { label: 'Crazy Time', votes: 0, color: 'from-yellow-400 to-orange-500' },
      { label: 'Blackjack', votes: 0, color: 'from-green-500 to-emerald-600' },
      { label: 'Roulette', votes: 0, color: 'from-red-500 to-red-700' },
      { label: 'Plinko', votes: 0, color: 'from-cyan-400 to-blue-500' },
    ],
  },
  {
    label: 'Challenge',
    question: 'What challenge do we do?',
    command: '!challenge',
    options: [
      { label: '$100 to $1000', votes: 0, color: 'from-accent-gold to-yellow-600' },
      { label: 'Max Bet Spin', votes: 0, color: 'from-red-500 to-neon-pink' },
      { label: 'Bonus Hunt', votes: 0, color: 'from-purple-500 to-violet-600' },
      { label: '10 Spin Battle', votes: 0, color: 'from-cyan-400 to-blue-500' },
    ],
  },
]

const inputClass = "px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] focus:border-neon-pink/30 outline-none text-xs transition-colors w-full"

export default function AdminStreamTab() {
  const [chatRunning, setChatRunning] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([])
  const [activePoll, setActivePoll] = useState<Poll | null>(null)
  const [pollHistory, setPollHistory] = useState<Poll[]>([])
  const [chatSpeed, setChatSpeed] = useState<'slow' | 'normal' | 'fast'>('normal')
  const [totalMessages, setTotalMessages] = useState(0)
  const [totalCommands, setTotalCommands] = useState(0)
  const chatRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const speedMs = chatSpeed === 'slow' ? 2000 : chatSpeed === 'normal' ? 800 : 300

  useEffect(() => {
    if (!chatRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      const username = MOCK_USERNAMES[Math.floor(Math.random() * MOCK_USERNAMES.length)]
      const color = CHAT_COLORS[Math.floor(Math.random() * CHAT_COLORS.length)]

      let message: string
      let isCommand = false

      // 40% chance of command if poll is active
      if (activePoll && activePoll.status === 'active' && Math.random() < 0.4) {
        const opt = activePoll.options[Math.floor(Math.random() * activePoll.options.length)]
        message = `${activePoll.command} ${opt.label}`
        isCommand = true

        // Count vote
        setActivePoll(prev => {
          if (!prev || prev.status !== 'active') return prev
          const newOptions = prev.options.map(o =>
            o.label === opt.label ? { ...o, votes: o.votes + 1 } : o
          )
          return { ...prev, options: newOptions, totalVotes: prev.totalVotes + 1 }
        })
        setTotalCommands(c => c + 1)
      } else {
        message = REGULAR_MESSAGES[Math.floor(Math.random() * REGULAR_MESSAGES.length)]
      }

      const newMsg: ChatMsg = {
        id: Date.now().toString() + Math.random(),
        username,
        message,
        isCommand,
        color,
        timestamp: Date.now(),
      }

      setChatMessages(prev => [...prev.slice(-80), newMsg])
      setTotalMessages(t => t + 1)
    }, speedMs)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [chatRunning, speedMs, activePoll])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [chatMessages])

  const startPoll = (preset: typeof POLL_PRESETS[0]) => {
    if (activePoll?.status === 'active') {
      endPoll()
    }
    const poll: Poll = {
      id: Date.now().toString(),
      question: preset.question,
      command: preset.command,
      options: preset.options.map(o => ({ ...o, votes: 0 })),
      status: 'active',
      totalVotes: 0,
    }
    setActivePoll(poll)
    toast.success(`Poll started: ${preset.question}`)
  }

  const endPoll = () => {
    if (!activePoll) return
    const ended = { ...activePoll, status: 'ended' as const }
    setActivePoll(ended)
    setPollHistory(prev => [ended, ...prev.slice(0, 4)])
    const winner = ended.options.reduce((a, b) => a.votes > b.votes ? a : b)
    toast.success(`Poll ended! Winner: ${winner.label}`, { icon: '🏆', duration: 4000 })
  }

  const clearPoll = () => {
    setActivePoll(null)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Stream Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold ${chatRunning ? 'bg-accent-emerald/10 text-accent-emerald' : 'bg-white/[0.03] text-white/30'}`}>
            <span className="relative flex h-2 w-2">
              {chatRunning && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75" />}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${chatRunning ? 'bg-accent-emerald' : 'bg-white/20'}`} />
            </span>
            {chatRunning ? 'Chat Active' : 'Chat Paused'}
          </div>
          <button onClick={() => setChatRunning(!chatRunning)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${chatRunning ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-gradient-to-r from-neon-pink to-neon-purple text-white shimmer-btn'}`}>
            {chatRunning ? <><Square className="w-3 h-3" />Stop</> : <><Play className="w-3 h-3" />Start Demo</>}
          </button>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-white/30">
            <MessageSquare className="w-3 h-3" />
            <span className="stat-number font-bold text-white/60">{totalMessages}</span> msgs
          </div>
          <div className="flex items-center gap-1.5 text-white/30">
            <Hash className="w-3 h-3" />
            <span className="stat-number font-bold text-neon-pink">{totalCommands}</span> commands
          </div>
          <div className="flex gap-1">
            {(['slow', 'normal', 'fast'] as const).map(s => (
              <button key={s} onClick={() => setChatSpeed(s)}
                className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${chatSpeed === s ? 'bg-neon-pink/15 text-neon-pink' : 'bg-white/[0.03] text-white/20 hover:text-white/40'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chat Feed */}
        <div className="lg:col-span-1 glass-card rounded-2xl overflow-hidden flex flex-col" style={{ height: '520px' }}>
          <div className="p-3 border-b border-white/[0.04] flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-neon-pink" />
            <span className="text-xs font-bold">Kick Chat</span>
            <span className="text-[9px] text-white/20 ml-auto">{chatMessages.length} msgs</span>
          </div>
          <div ref={chatRef} className="flex-1 overflow-y-auto p-3 space-y-1">
            <AnimatePresence initial={false}>
              {chatMessages.map(msg => (
                <motion.div key={msg.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`text-[11px] leading-relaxed ${msg.isCommand ? 'bg-neon-pink/[0.06] rounded-md px-2 py-1 border border-neon-pink/10' : ''}`}
                >
                  <span className={`font-bold ${msg.color}`}>{msg.username}</span>
                  <span className="text-white/15 mx-1">:</span>
                  <span className={msg.isCommand ? 'text-neon-pink/80 font-medium' : 'text-white/40'}>{msg.message}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {chatMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageSquare className="w-6 h-6 text-white/10 mb-2" />
                <p className="text-[10px] text-white/20">Start the demo to see chat</p>
              </div>
            )}
          </div>
        </div>

        {/* Poll + Controls */}
        <div className="lg:col-span-2 space-y-4">
          {/* Poll Presets */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-neon-pink" />
              <h3 className="font-bold text-sm">Quick Polls</h3>
              <span className="text-[9px] text-white/20 ml-1">Click to start a chat poll</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {POLL_PRESETS.map(preset => (
                <button key={preset.label} onClick={() => startPoll(preset)}
                  className="glass rounded-xl p-3 text-center hover:bg-white/[0.03] hover:border-neon-pink/15 transition-all group">
                  <p className="text-sm mb-1">{preset.label.split(' ')[0]}</p>
                  <p className="text-[10px] font-bold">{preset.label.split(' ').slice(1).join(' ')}</p>
                  <p className="text-[9px] text-white/20 mt-1 font-mono">{preset.command}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Active Poll */}
          {activePoll && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-60 h-60 bg-neon-pink/[0.03] rounded-full blur-[100px]" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="w-4 h-4 text-neon-pink" />
                      <h3 className="font-bold text-sm">{activePoll.question}</h3>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${activePoll.status === 'active' ? 'bg-accent-emerald/15 text-accent-emerald' : 'bg-white/[0.06] text-white/30'}`}>
                        {activePoll.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/25">
                      Command: <code className="text-neon-pink font-mono">{activePoll.command} [option]</code>
                      <span className="ml-3">{activePoll.totalVotes} total votes</span>
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {activePoll.status === 'active' && (
                      <button onClick={endPoll} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-neon-pink to-neon-purple text-xs font-bold flex items-center gap-1">
                        <Trophy className="w-3 h-3" />End Poll
                      </button>
                    )}
                    <button onClick={clearPoll} className="px-2.5 py-1.5 rounded-lg border border-white/[0.06] text-white/30 hover:text-white/60 transition-all">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {activePoll.options.map((opt, i) => {
                    const pct = activePoll.totalVotes > 0 ? (opt.votes / activePoll.totalVotes) * 100 : 0
                    const isWinner = activePoll.status === 'ended' && opt.votes === Math.max(...activePoll.options.map(o => o.votes)) && opt.votes > 0
                    return (
                      <div key={opt.label} className={`relative rounded-xl overflow-hidden ${isWinner ? 'ring-1 ring-neon-pink/30' : ''}`}>
                        <div className="absolute inset-0 bg-white/[0.02]" />
                        <motion.div
                          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${opt.color} opacity-15`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        />
                        <div className="relative flex items-center justify-between p-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-md bg-white/[0.05] flex items-center justify-center text-[9px] font-bold text-white/40">{i + 1}</span>
                            <span className={`text-xs font-bold ${isWinner ? 'text-neon-pink' : ''}`}>{opt.label}</span>
                            {isWinner && <Trophy className="w-3 h-3 text-accent-gold" />}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs stat-number font-bold">{opt.votes}</span>
                            <span className="text-[10px] text-white/25 stat-number w-10 text-right">{pct.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* No active poll placeholder */}
          {!activePoll && (
            <div className="glass-card rounded-2xl p-10 text-center">
              <BarChart3 className="w-8 h-8 text-white/10 mx-auto mb-3" />
              <p className="text-xs text-white/20 mb-1">No active poll</p>
              <p className="text-[10px] text-white/10">Start a quick poll above to see live chat votes</p>
            </div>
          )}

          {/* Poll History */}
          {pollHistory.length > 0 && (
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-xs font-bold text-white/40 mb-3">Recent Polls</h3>
              <div className="space-y-2">
                {pollHistory.map(poll => {
                  const winner = poll.options.reduce((a, b) => a.votes > b.votes ? a : b)
                  return (
                    <div key={poll.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div>
                        <p className="text-xs font-medium">{poll.question}</p>
                        <p className="text-[10px] text-white/25">{poll.totalVotes} votes</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-3 h-3 text-accent-gold" />
                        <span className="text-xs font-bold text-neon-pink">{winner.label}</span>
                        <span className="text-[10px] text-white/25 stat-number">({winner.votes})</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
