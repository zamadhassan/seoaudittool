'use client'

import { motion } from 'framer-motion'
import { Activity, Gauge, ShieldCheck } from 'lucide-react'

const cards = [
  { icon: Gauge, title: 'SEO Score', value: '86', tone: 'text-nexora-yellow' },
  { icon: Activity, title: 'Issues Found', value: '14', tone: 'text-blue-200' },
  { icon: ShieldCheck, title: 'Security', value: 'Good', tone: 'text-emerald-200' }
]

export function HeroPreviewCards() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-28 mx-auto hidden max-w-[1500px] justify-between px-8 lg:flex">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -8, 0] }}
          transition={{ opacity: { delay: index * 0.14 }, y: { duration: 5, repeat: Infinity, delay: index * 0.4 } }}
          className={`glass-card w-44 rounded-[10px] p-4 ${index === 1 ? 'mt-40' : 'mt-8'}`}
        >
          <card.icon className={`h-5 w-5 ${card.tone}`} />
          <div className="mt-4 text-3xl font-black text-white">{card.value}</div>
          <div className="text-sm text-zinc-400">{card.title}</div>
        </motion.div>
      ))}
    </div>
  )
}
