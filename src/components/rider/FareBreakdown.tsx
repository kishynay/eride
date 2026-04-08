import { FareBreakdown as FareBreakdownType } from "@/types"
import { formatCurrency } from "@/utils"

interface FareBreakdownProps {
  breakdown: FareBreakdownType
}

export function FareBreakdown({ breakdown }: FareBreakdownProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-white font-semibold mb-3">💰 Fare Breakdown</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-300">
          <span>Base Fare</span>
          <span>{formatCurrency(breakdown.base_fare)}</span>
        </div>
        <div className="flex justify-between text-gray-300">
          <span>Distance ({breakdown.distance_km} km × {formatCurrency(breakdown.per_km_rate)}/km)</span>
          <span>{formatCurrency(breakdown.per_km_rate * breakdown.distance_km)}</span>
        </div>
        <div className="border-t border-gray-700 pt-2 mt-2">
          <div className="flex justify-between text-white font-bold text-lg">
            <span>Total</span>
            <span>{formatCurrency(breakdown.total_fare)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
