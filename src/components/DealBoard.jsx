import { useState } from 'react'
import { formatCurrency } from '../lib/utils'
import DealCard from './DealCard'
import DealForm from './DealForm'

const STATUSES = ['lead', 'negotiating', 'confirmed', 'live/posted', 'invoiced', 'paid', 'dead']

export default function DealBoard({ deals, onAddDeal, onUpdateDeal, onDeleteDeal }) {
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [draggedDeal, setDraggedDeal] = useState(null)

  const getDealsInStatus = (status) => deals.filter(d => d.status === status)

  const getTotalForStatus = (status) => {
    return getDealsInStatus(status).reduce((sum, d) => sum + (d.rate_inr || 0), 0)
  }

  const handleDragStart = (deal) => {
    setDraggedDeal(deal)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (status) => {
    if (draggedDeal && draggedDeal.status !== status) {
      onUpdateDeal(draggedDeal.id, { status })
    }
    setDraggedDeal(null)
  }

  const handleCardClick = (deal) => {
    setSelectedDeal(deal)
    setIsFormOpen(true)
  }

  const handleAddDeal = () => {
    setSelectedDeal(null)
    setIsFormOpen(true)
  }

  const handleFormSave = async (formData) => {
    if (selectedDeal) {
      await onUpdateDeal(selectedDeal.id, formData)
    } else {
      await onAddDeal(formData)
    }
    setIsFormOpen(false)
  }

  const handleFormDelete = async () => {
    if (selectedDeal) {
      await onDeleteDeal(selectedDeal.id)
      setIsFormOpen(false)
    }
  }

  if (deals.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[calc(100vh-60px)]">
        <p className="text-gray-500 text-lg mb-4">No deals yet. Start by adding your first deal!</p>
        <button
          onClick={handleAddDeal}
          className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          + Add Deal
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Deal Board</h2>
        <button
          onClick={handleAddDeal}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          + Add Deal
        </button>
      </div>

      <div className="flex gap-4 pb-4">
        {STATUSES.map(status => (
          <div
            key={status}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(status)}
            className="flex-shrink-0 w-72 bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 capitalize">{status.replace('/', ' / ')}</h3>
              <p className="text-sm text-gray-600">
                {getDealsInStatus(status).length} deals • {formatCurrency(getTotalForStatus(status))}
              </p>
            </div>

            <div className="space-y-3">
              {getDealsInStatus(status).map(deal => (
                <div
                  key={deal.id}
                  draggable
                  onDragStart={() => handleDragStart(deal)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <DealCard 
                    deal={deal} 
                    onClick={() => handleCardClick(deal)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <DealForm
          deal={selectedDeal}
          onSave={handleFormSave}
          onDelete={handleFormDelete}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  )
}
