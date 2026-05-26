import { formatCurrency, isDeadlineSoon, isDeadlinePassed, getPlatformColor } from '../lib/utils'

export default function DealCard({ deal, onClick }) {
  const deadline = deal.deadline ? new Date(deal.deadline) : null
  const isSoon = isDeadlineSoon(deal.deadline)
  const isPassed = isDeadlinePassed(deal.deadline)

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <h3 className="font-bold text-gray-900 mb-2">{deal.brand_name}</h3>
      
      <p className="text-sm text-gray-600 mb-3">{deal.deliverable}</p>
      
      <div className="flex items-center gap-2 mb-3">
        <span className={`${getPlatformColor(deal.platform)} text-white text-xs font-semibold px-2 py-1 rounded`}>
          {deal.platform}
        </span>
      </div>
      
      <div className="mb-3">
        <p className="text-lg font-semibold text-gray-900">{formatCurrency(deal.rate_inr)}</p>
      </div>
      
      {deadline && (
        <p className={`text-xs font-medium ${
          isPassed ? 'text-red-600' : isSoon ? 'text-orange-600' : 'text-gray-500'
        }`}>
          {deadline.toLocaleDateString('en-IN')}
        </p>
      )}
    </div>
  )
}
