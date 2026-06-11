import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const PLATFORMS = ['Instagram', 'YouTube', 'Both']
const DELIVERABLES = ['Reel', 'Story', 'Dedicated Video', 'YouTube Integration', 'YouTube Dedicated', 'Other']
const STATUSES = ['lead', 'negotiating', 'confirmed', 'live/posted', 'invoiced', 'paid', 'dead']

const EMPTY_FORM = {
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

export default function DealForm({ deal, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const isEdit = !!deal

  useEffect(() => {
    if (deal) {
      setForm({
        brand_name: deal.brand_name || '',
        contact_name: deal.contact_name || '',
        contact_whatsapp: deal.contact_whatsapp || '',
        platform: deal.platform || '',
        deliverable: deal.deliverable || '',
        rate_inr: deal.rate_inr || '',
        status: deal.status || 'lead',
        deadline: deal.deadline || '',
        posted_date: deal.posted_date || '',
        invoice_date: deal.invoice_date || '',
        payment_date: deal.payment_date || '',
        notes: deal.notes || ''
      })
    }
  }, [deal])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.brand_name.trim()) return
    setSaving(true)
    try {
      const payload = {
        ...form,
        rate_inr: form.rate_inr ? Number(form.rate_inr) : null,
        deadline: form.deadline || null,
        posted_date: form.posted_date || null,
        invoice_date: form.invoice_date || null,
        payment_date: form.payment_date || null,
        contact_name: form.contact_name || null,
        contact_whatsapp: form.contact_whatsapp || null,
        notes: form.notes || null
      }
      await onSave(payload)
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    try {
      await onDelete(deal.id)
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-semibold">{isEdit ? 'Edit Deal' : 'Add Deal'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name *</label>
            <input
              name="brand_name"
              value={form.brand_name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="e.g. Myntra"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
              <input
                name="contact_name"
                value={form.contact_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input
                name="contact_whatsapp"
                value={form.contact_whatsapp}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="+91..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
              <select
                name="platform"
                value={form.platform}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="">Select...</option>
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deliverable</label>
              <select
                name="deliverable"
                value={form.deliverable}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="">Select...</option>
                {DELIVERABLES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rate (₹)</label>
              <input
                name="rate_inr"
                type="number"
                value={form.rate_inr}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Posted Date</label>
              <input
                name="posted_date"
                type="date"
                value={form.posted_date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
              <input
                name="invoice_date"
                type="date"
                value={form.invoice_date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
              <input
                name="payment_date"
                type="date"
                value={form.payment_date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {isEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
                  confirmDelete
                    ? 'bg-red-600 text-white border-red-600'
                    : 'border-red-300 text-red-600 hover:bg-red-50'
                }`}
              >
                {confirmDelete ? 'Confirm Delete' : 'Delete'}
              </button>
            ) : <div />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
