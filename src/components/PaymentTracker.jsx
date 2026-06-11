import { useState } from 'react'
import { formatCurrency, formatDate, calculateDaysOverdue, getPaymentDueDate } from '../lib/utils'
import DealForm from './DealForm'

export default function PaymentTracker({ deals, updateDeal, deleteDeal }) {
  const [modalDeal, setModalDeal] = useState(null)

  const paymentDeals = deals
    .filter(d => d.status === 'invoiced' || d.status === 'paid')
    .map(d => ({
      ...d,
      daysOverdue: calculateDaysOverdue(d.invoice_date, d.payment_date),
      paymentDueDate: getPaymentDueDate(d.invoice_date)
    }))
    .sort((a, b) => {
      // Overdue first
      if (a.daysOverdue && !b.daysOverdue) return -1
      if (!a.daysOverdue && b.daysOverdue) return 1
      // Then by payment due date ascending
      if (a.paymentDueDate && b.paymentDueDate) return a.paymentDueDate - b.paymentDueDate
      return 0
    })

  const handleMarkPaid = async (deal) => {
    const today = new Date().toISOString().split('T')[0]
    await updateDeal(deal.id, { payment_date: today, status: 'paid' })
  }

  if (paymentDeals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <p className="text-lg font-medium">No invoiced or paid deals</p>
        <p className="text-sm mt-1">Deals will appear here once marked as Invoiced or Paid.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Payments</h2>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-600">Brand</th>
                <th className="px-4 py-3 font-medium text-gray-600">Deliverable</th>
                <th className="px-4 py-3 font-medium text-gray-600">Rate</th>
                <th className="px-4 py-3 font-medium text-gray-600">Invoice Date</th>
                <th className="px-4 py-3 font-medium text-gray-600">Payment Due</th>
                <th className="px-4 py-3 font-medium text-gray-600">Overdue</th>
                <th className="px-4 py-3 font-medium text-gray-600">Payment Date</th>
                <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paymentDeals.map(deal => (
                <tr
                  key={deal.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setModalDeal(deal)}
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{deal.brand_name}</td>
                  <td className="px-4 py-3 text-gray-600">{deal.deliverable || '—'}</td>
                  <td className="px-4 py-3 text-gray-800">{formatCurrency(deal.rate_inr)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(deal.invoice_date) || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(deal.paymentDueDate) || '—'}</td>
                  <td className="px-4 py-3">
                    {deal.daysOverdue ? (
                      <span className="text-red-600 font-medium">{deal.daysOverdue}d</span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {deal.payment_date ? formatDate(deal.payment_date) : (
                      <span className="text-gray-400 italic">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      deal.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {deal.status === 'paid' ? 'Paid' : 'Invoiced'}
                    </span>
                  </td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    {deal.status === 'invoiced' && (
                      <button
                        onClick={() => handleMarkPaid(deal)}
                        className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
