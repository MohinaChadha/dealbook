export const formatCurrency = (amount) => {
  if (!amount) return '₹0'
  return `₹${Number(amount).toLocaleString('en-IN')}`
}

export const isDeadlineSoon = (deadline) => {
  if (!deadline) return false
  const today = new Date()
  const deadlineDate = new Date(deadline)
  const daysUntil = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24))
  return daysUntil <= 3 && daysUntil >= 0
}

export const isDeadlinePassed = (deadline) => {
  if (!deadline) return false
  const today = new Date()
  const deadlineDate = new Date(deadline)
  return deadlineDate < today
}

export const getPlatformColor = (platform) => {
  const colors = {
    'Instagram': 'bg-platform-instagram',
    'YouTube': 'bg-platform-youtube',
    'Both': 'bg-gray-600'
  }
  return colors[platform] || 'bg-gray-400'
}

export const getStatusColor = (status) => {
  const colors = {
    'lead': 'bg-gray-100 text-gray-800',
    'negotiating': 'bg-blue-100 text-blue-800',
    'confirmed': 'bg-green-100 text-green-800',
    'live': 'bg-purple-100 text-purple-800',
    'live/posted': 'bg-purple-100 text-purple-800',
    'invoiced': 'bg-indigo-100 text-indigo-800',
    'paid': 'bg-emerald-100 text-emerald-800',
    'dead': 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-IN')
}

export const calculateDaysOverdue = (invoiceDate, paymentDate) => {
  if (paymentDate || !invoiceDate) return null
  const today = new Date()
  const dueDate = new Date(new Date(invoiceDate).getTime() + 30 * 24 * 60 * 60 * 1000)
  const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))
  return daysOverdue > 0 ? daysOverdue : null
}
