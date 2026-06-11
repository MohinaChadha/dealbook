import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { formatCurrency, getPlatformColor, isDeadlineSoon, isDeadlinePassed, formatDate } from '../lib/utils'

export default function DealCard({ deal, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: deal.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const deadlineSoon = isDeadlineSoon(deal.deadline)
  const deadlinePassed = isDeadlinePassed(deal.deadline)

  const deadlineColor = deadlinePassed
    ? 'text-red-600'
    : deadlineSoon
    ? 'text-orange-500'
    : 'text-gray-500'

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow select-none"
    >
      <div className="flex items-start justify-between mb-2">
        <p className="font-semibold text-gray-900 text-sm leading-tight">{deal.brand_name}</p>
        {deal.platform && (
          <span className={`text-xs text-white px-2 py-0.5 rounded-full ml-2 shrink-0 ${getPlatformColor(deal.platform)}`}>
            {deal.platform}
          </span>
        )}
      </div>

      {deal.deliverable && (
        <p className="text-xs text-gray-500 mb-2">{deal.deliverable}</p>
      )}

      <div className="flex items-center justify-between">
        {deal.rate_inr ? (
          <span className="text-sm font-medium text-gray-800">{formatCurrency(deal.rate_inr)}</span>
        ) : (
          <span className="text-xs text-gray-400">No rate</span>
        )}

        {deal.deadline && (
          <span className={`text-xs ${deadlineColor}`}>
            {deadlinePassed ? 'Overdue' : deadlineSoon ? 'Due soon' : ''} {formatDate(deal.deadline)}
          </span>
        )}
      </div>
    </div>
  )
}
