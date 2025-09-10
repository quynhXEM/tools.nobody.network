"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface SwapSettingsProps {
  slippage: string
  onSlippageChange: (value: string) => void
}

export function SwapSettings({ slippage, onSlippageChange }: SwapSettingsProps) {
  const presetSlippages = ["0.1", "0.5", "1.0", "3.0"]

  return (
    <div className="bg-slate-900/30 rounded-lg p-4 space-y-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-white">Slippage Tolerance</h4>
        <div className="flex gap-2">
          {presetSlippages.map((preset) => (
            <Button
              key={preset}
              variant={slippage === preset ? "default" : "outline"}
              size="sm"
              onClick={() => onSlippageChange(preset)}
              className={
                slippage === preset
                  ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                  : "border-slate-600 text-slate-300 hover:bg-slate-700/50"
              }
            >
              {preset}%
            </Button>
          ))}
          <div className="flex items-center">
            <Input
              type="number"
              placeholder="Custom"
              value={slippage}
              onChange={(e) => onSlippageChange(e.target.value)}
              className="w-20 h-8 text-xs bg-slate-800 border-slate-600 text-white"
              step="0.1"
              min="0.1"
              max="50"
            />
            <span className="text-xs text-slate-400 ml-1">%</span>
          </div>
        </div>
      </div>

      <Separator className="bg-slate-700" />

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-white">Transaction Speed</h4>
        <div className="flex gap-2">
          <Badge variant="outline" className="border-slate-600 text-slate-300">
            Standard
          </Badge>
          <Badge variant="outline" className="border-slate-600 text-slate-300">
            Fast
          </Badge>
          <Badge variant="outline" className="border-slate-600 text-slate-300">
            Instant
          </Badge>
        </div>
      </div>
    </div>
  )
}
