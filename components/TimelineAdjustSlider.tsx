'use client'

import { motion } from 'framer-motion'

interface TimelineAdjustSliderProps {
  timelineYears: number
  onTimelineChange: (years: number) => void
}

export function TimelineAdjustSlider({ timelineYears, onTimelineChange }: TimelineAdjustSliderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="glass rounded-xl p-8 mt-8"
    >
      <h2 className="text-2xl font-bold text-gold mb-6">⏱️ Adjust Goal Timeline</h2>
      <p className="text-gray-300 mb-6">Use this slider to compress or expand all goal timelines simultaneously</p>

      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold text-gray-300">Timeline Adjustment</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent">
            {timelineYears} years
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="15"
          step="0.5"
          value={timelineYears}
          onChange={(e) => onTimelineChange(parseFloat(e.target.value))}
          className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, rgba(201, 169, 110, 0.5) 0%, rgba(201, 169, 110, 0.5) ${(timelineYears / 15) * 100}%, rgba(255,255,255,0.1) ${(timelineYears / 15) * 100}%, rgba(255,255,255,0.1) 100%)`,
          }}
        />

        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>1 year</span>
          <span>8 years</span>
          <span>15 years</span>
        </div>

        <div className="mt-6 p-4 bg-white/5 border border-gold/30 rounded-lg">
          <p className="text-sm text-gray-300 mb-2">
            <strong className="text-gold">What this does:</strong>
          </p>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>✓ Adjusts all savings goal timelines</li>
            <li>✓ Recalculates monthly contributions needed</li>
            <li>✓ Updates retirement projections</li>
            <li>✓ Affects overall financial plan</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
