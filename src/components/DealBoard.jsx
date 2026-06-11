import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import DealCard from './DealCard'
import DealForm from './DealForm'
import { formatCurrency } from '../lib/utils'

const COLUMNS = ['lead', 'negotiating', 'confirmed', 'live/posted', 'invoiced', 'paid', 'dead']

const COLUMN_LABELS = {
  'lead': 'Lead',
  'negotiating': 'Negotiating',
  'confirmed': 'Confirmed',
  'live/posted': 'Live / Posted',
  'invoiced': 'Invoiced',
  'paid': 'Paid',
  'dead': 'Dead'
}

function DroppableColumn({ id, label, deals, onCardClick }) {
  const { setNodeRef, isOver } = useDroppable({ id })

  const totalValue = deals.reduce((sum, d) => sum + (d.rate_inr || 0), 0)

  return (
    <div className="flex flex-col min-w-[240px] w-[240px]">
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">{label}</span>
          <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">{deals.length}</span>
        </div>
        {totalValue > 0 && (
          <p className="text-xs text-gray-400 mt-0.5">{formatCurrency(totalValue)}</p>
        )}
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 rounded-xl p-2 space-y-2 min-h-[200px] transition-colors ${
          isOver ? 'bg-blue-50' : 'bg-gray-50'
        }`}
      >
        <SortableContext items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
          {deals.map(deal => (
            <DealCard key={deal.id} deal={deal} onClick={() => onCardClick(deal)} />
          ))}
        </SortableContext>

        {deals.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-gray-400">
            No deals
          </div>
        )}
      </div>
    </div>
  )
}

export default function DealBoard({ deals, addDeal, updateDeal, deleteDeal }) {
  const [modalDeal, setModalDeal] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const dealsByColumn = COLUMNS.reduce((acc, col) => {
    acc[col] = deals.filter(d => d.status === col)
    return acc
  }, {})

  const activeDeal = activeId ? deals.find(d => d.id === activeId) : null

  const handleDragStart = ({ active }) => setActiveId(active.id)

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null)
    if (!over) return

    const draggedDeal = deals.find(d => d.id === active.id)
    if (!draggedDeal) return

    // over.id could be a column id or a deal id
    let targetStatus = COLUMNS.includes(over.id) ? over.id : null
    if (!targetStatus) {
      const targetDeal = deals.find(d => d.id === over.id)
      targetStatus = targetDeal?.status
    }

    if (targetStatus && draggedDeal.status !== targetStatus) {
      updateDeal(draggedDeal.id, { status: targetStatus })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Board</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Plus size={16} />
          Add Deal
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map(col => (
            <DroppableColumn
              key={col}
              id={col}
              label={COLUMN_LABELS[col]}
              deals={dealsByColumn[col]}
              onCardClick={setModalDeal}
            />
          ))}
        </div>

        <DragOverlay>
          {activeDeal ? (
            <div className="opacity-90 rotate-2">
              <DealCard deal={activeDeal} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {showCreate && (
        <DealForm
          onSave={addDeal}
          onClose={() => setShowCreate(false)}
        />
      )}

      {modalDeal && (
        <DealForm
          deal={modalDeal}
          onSave={(data) => updateDeal(modalDeal.id, data)}
          onDelete={deleteDeal}
          onClose={() => setModalDeal(null)}
        />
      )}
    </div>
  )
}
