import { useState } from 'react'
import { formatCurrency, formatDate, calculateDaysOverdue } from '../lib/utils'
import DealForm from './DealForm'

export default function PaymentTracker({ deals, onUpdateDeal }) {
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Filter deals with status invoiced or paid
  const paymentDeals = deals.filter(d => ['invoiced', 'paid'].includes(d.status))

  // Sort: overdue first, then by payment due date
  const sortedDeals = [...paymentDeals].sort((a, b) => {
    const aOverdue = calculateDaysOverdue(a.invoice_date, a.payment_date)
    const bOverdue = calculateDaysOverdue(b.invoice_date, b.payment_date)

    if (aOverdue && !bOverdue) return -1
    if (!aOverdue && bOverdue) return 1

    const aDueDate = new Date(new Date(a.invoice_date).getTime() + 30 * 24 * 60 * 60 * 1000)
    const bDueDate = new Date(new Date(b.invoice_date).getTime() + 30 * 24 * 60 * 60 * 1000)
    return aDueDate - bDueDate
  })

  const handleCardClick = (deal) => {
    setSelectedDeal(deal)
    setIsFormOpen(true)
  }

  const handleFormSave = async (formData) => {
    if (selectedDeal) {
      await onUpdateDeal(selectedDeal.id, formData)
    }
    setIsFormOpen(false)
  }

  const handleMarkAsPaid = async (deal) => {
    const today = new Date().toISOString().split('T')[0]
    await onUpdateDeal(deal.id, { 
      payment_date: today,
      status: 'paid'
    })
  }

  if (paymentDeals.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[calc(100vh-60px)]">
        <p className="text-gray-500 text-lg">No invoiced or paid deals yet</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Tracker</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Brand Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Deliverable</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Rate</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Invoice Date</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Payment Due</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Days Overdue</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Payment Date</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedDeals.map(deal => {
              const daysOverdue = calculateDaysOverdue(deal.invoice_date, deal.payment_date)
              const dueDate = new Date(new Date(deal.invoice_date).getTime() + 30 * 24 * 60 * 60 * 1000)
              return (
                <tr key={deal.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900 font-medium cursor-pointer" onClick={() => handleCardClick(deal)}>
                    {deal.brand_name}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{deal.deliverable}</td>
                  <td className="py-3 px-4 text-gray-900 font-semibold">{formatCurrency(deal.rate_inr)}</td>
                  <td className="py-3 px-4 text-gray-700">{formatDate(deal.invoice_date)}</td>
                  <td className="py-3 px-4 text-gray-700">{dueDate.toLocaleDateString('en-IN')}</td>
                  <td className={`py-3 px-4 font-semibold ${daysOverdue ? 'text-red-600' : 'text-gray-700'}`}>
                    {daysOverdue ? `${daysOverdue} days` : '-'}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {deal.payment_date ? formatDate(deal.payment_date) : 'Pending'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      deal.status === 'paid' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {deal.status === 'paid' ? 'Paid' : 'Invoiced'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {deal.status === 'invoiced' && (
                      <button
                        onClick={() => handleMarkAsPaid(deal)}
                        className="px-3 py-1 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700 transition-colors"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {isFormOpen && selectedDeal && (
        <DealForm
          deal={selectedDeal}
          onSave={handleFormSave}
          onDelete={() => setIsFormOpen(false)}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  )
}
