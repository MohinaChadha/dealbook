import { useState, useEffect } from 'react'

const STATUSES = ['lead', 'negotiating', 'confirmed', 'live/posted', 'invoiced', 'paid', 'dead']
const PLATFORMS = ['Instagram', 'YouTube', 'Both']
const DELIVERABLES = ['Reel', 'Story', 'Dedicated Video', 'YouTube Integration', 'YouTube Dedicated', 'Other']

export default function DealForm({ deal, onSave, onDelete, onClose }) {
  const [formData, setFormData] = useState(
    deal || {
      brand_name: '',
      contact_name: '',
      contact_whatsapp: '',
      platform: '',
      deliverable: '',
      rate_inr: '',
      status: 'lead',
      deadline: '',
      posted_date: '',
      invoice_date: '',
      payment_date: '',
      notes: ''
    }
  )

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.brand_name.trim()) newErrors.brand_name = 'Brand name is required'
    if (formData.rate_inr && isNaN(formData.rate_inr)) newErrors.rate_inr = 'Rate must be a number'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    try {
      await onSave(formData)
    } catch (err) {
      console.error('Form save error:', err)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      await onDelete()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {deal ? 'Edit Deal' : 'Add New Deal'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Brand Name *
              </label>
              <input
                type="text"
                name="brand_name"
                value={formData.brand_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                  errors.brand_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.brand_name && <p className="text-red-500 text-sm mt-1">{errors.brand_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Platform
              </label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="">Select platform</option>
                {PLATFORMS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Contact Name
              </label>
              <input
                type="text"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Deliverable
              </label>
              <select
                name="deliverable"
                value={formData.deliverable}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="">Select deliverable</option>
                {DELIVERABLES.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Contact WhatsApp
              </label>
              <input
                type="text"
                name="contact_whatsapp"
                value={formData.contact_whatsapp}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Rate (₹)
              </label>
              <input
                type="number"
                name="rate_inr"
                value={formData.rate_inr}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
                  errors.rate_inr ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.rate_inr && <p className="text-red-500 text-sm mt-1">{errors.rate_inr}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s.replace('/', ' / ')}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Posted Date
              </label>
              <input
                type="date"
                name="posted_date"
                value={formData.posted_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Invoice Date
              </label>
              <input
                type="date"
                name="invoice_date"
                value={formData.invoice_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                name="payment_date"
                value={formData.payment_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2 justify-end pt-6 border-t border-gray-200">
            {deal && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition-colors font-medium"
            >
              {deal ? 'Update Deal' : 'Add Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
