import { formatCurrency, calculateDaysOverdue } from '../lib/utils'

const CONFIRMED_STATUSES = ['confirmed', 'live/posted', 'invoiced', 'paid']

export default function Dashboard({ deals }) {
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()

  const monthDeals = deals.filter(d => {
    const created = new Date(d.created_at)
    return created.getMonth() === thisMonth && created.getFullYear() === thisYear
  })

  const totalDeals = monthDeals.length

  const confirmedRevenue = monthDeals
    .filter(d => CONFIRMED_STATUSES.includes(d.status))
    .reduce((sum, d) => sum + (d.rate_inr || 0), 0)

  const pendingPayment = monthDeals
    .filter(d => d.status === 'invoiced')
    .reduce((sum, d) => sum + (d.rate_inr || 0), 0)

  const overdueDeals = deals.filter(d => calculateDaysOverdue(d.invoice_date, d.payment_date) !== null).length

  // Bar chart by status across all deals
  const STATUS_ORDER = ['lead', 'negotiating', 'confirmed', 'live/posted', 'invoiced', 'paid', 'dead']
  const STATUS_LABELS = {
    'lead': 'Lead',
    'negotiating': 'Negotiating',
    'confirmed': 'Confirmed',
    'live/posted': 'Live/Posted',
    'invoiced': 'Invoiced',
    'paid': 'Paid',
    'dead': 'Dead'
  }
  const STATUS_COLORS = {
    'lead': 'bg-gray-400',
    'negotiating': 'bg-blue-400',
    'confirmed': 'bg-green-400',
    'live/posted': 'bg-purple-400',
    'invoiced': 'bg-indigo-400',
    'paid': 'bg-emerald-500',
    'dead': 'bg-red-400'
  }

  const monthStatusCounts = STATUS_ORDER.map(s => ({
    status: s,
    label: STATUS_LABELS[s],
    count: monthDeals.filter(d => d.status === s).length,
    color: STATUS_COLORS[s]
  }))

  const maxCount = Math.max(...monthStatusCounts.map(s => s.count), 1)

  const metrics = [
    { label: 'Total deals this month', value: totalDeals, sub: 'deals tracked' },
    { label: '₹ Confirmed', value: formatCurrency(confirmedRevenue), sub: 'confirmed + live + invoiced + paid' },
    { label: '₹ Pending payment', value: formatCurrency(pendingPayment), sub: 'invoiced, not yet paid' },
    { label: 'Overdue deals', value: overdueDeals, sub: 'payment >30 days overdue', alert: overdueDeals > 0 }
  ]

  if (deals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <p className="text-lg font-medium">No deals yet</p>
        <p className="text-sm mt-1">Add your first deal on the Board to see your dashboard.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Dashboard — {now.toLocaleString('en-IN', { month: 'long', year: 'numeric' })}</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metrics.map(m => (
          <div key={m.label} className={`bg-white border rounded-xl p-5 ${m.alert ? 'border-red-300' : 'border-gray-200'}`}>
            <p className="text-2xl font-bold text-gray-900">{m.value}</p>
            <p className="text-sm font-medium text-gray-700 mt-1">{m.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Deals by status this month</h3>
        <div className="space-y-3">
          {monthStatusCounts.map(s => (
            <div key={s.status} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-24 shrink-0">{s.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                <div
                  className={`h-5 rounded-full ${s.color} transition-all`}
                  style={{ width: s.count === 0 ? '0%' : `${(s.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700 w-6 text-right">{s.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
