import { formatCurrency } from '../lib/utils'

export default function Dashboard({ deals }) {
  // Get current month
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  // Filter deals for current month
  const currentMonthDeals = deals.filter(deal => {
    const dealDate = new Date(deal.created_at)
    return dealDate.getMonth() === currentMonth && dealDate.getFullYear() === currentYear
  })

  // Metric 1: Total deals this month
  const totalDeals = currentMonthDeals.length

  // Metric 2: ₹ confirmed (Confirmed, Live/Posted, Invoiced, Paid)
  const confirmedAmount = currentMonthDeals
    .filter(d => ['confirmed', 'live/posted', 'invoiced', 'paid'].includes(d.status))
    .reduce((sum, d) => sum + (d.rate_inr || 0), 0)

  // Metric 3: ₹ pending payment (Invoiced)
  const pendingAmount = currentMonthDeals
    .filter(d => d.status === 'invoiced')
    .reduce((sum, d) => sum + (d.rate_inr || 0), 0)

  // Metric 4: Overdue deals
  const overdueDeals = currentMonthDeals.filter(deal => {
    if (deal.payment_date || !deal.invoice_date) return false
    const today = new Date()
    const dueDate = new Date(new Date(deal.invoice_date).getTime() + 30 * 24 * 60 * 60 * 1000)
    return dueDate < today
  }).length

  // Deal count by status for current month
  const statusCounts = {
    lead: currentMonthDeals.filter(d => d.status === 'lead').length,
    negotiating: currentMonthDeals.filter(d => d.status === 'negotiating').length,
    confirmed: currentMonthDeals.filter(d => d.status === 'confirmed').length,
    'live/posted': currentMonthDeals.filter(d => d.status === 'live/posted').length,
    invoiced: currentMonthDeals.filter(d => d.status === 'invoiced').length,
    paid: currentMonthDeals.filter(d => d.status === 'paid').length,
    dead: currentMonthDeals.filter(d => d.status === 'dead').length
  }

  const maxCount = Math.max(...Object.values(statusCounts), 1)

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Dashboard - {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
      </h2>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Total Deals</p>
          <p className="text-3xl font-bold text-gray-900">{totalDeals}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">₹ Confirmed</p>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(confirmedAmount)}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">₹ Pending Payment</p>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(pendingAmount)}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-2">Overdue Deals</p>
          <p className={`text-3xl font-bold ${overdueDeals > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {overdueDeals}
          </p>
        </div>
      </div>

      {/* Status Bar Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Count by Status</h3>
        
        <div className="space-y-4">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {status.replace('/', ' / ')}
                </span>
                <span className="text-sm font-semibold text-gray-700">{count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-900 h-2 rounded-full transition-all"
                  style={{ width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
