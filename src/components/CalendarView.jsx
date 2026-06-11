import { useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enIN } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { getCalendarEvents, getEventStyle } from '../lib/calendarUtils'
import DealForm from './DealForm'

const locales = { 'en-IN': enIN }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
})

export default function CalendarView({ deals, updateDeal, deleteDeal }) {
  const [modalDeal, setModalDeal] = useState(null)

  const events = getCalendarEvents(deals)

  const handleSelectEvent = (event) => {
    setModalDeal(event.deal)
  }

  if (deals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <p className="text-lg font-medium">No deals yet</p>
        <p className="text-sm mt-1">Add deals on the Board to see deadlines and payment dates here.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Calendar</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-4" style={{ height: 600 }}>
        <Calendar
          localizer={localizer}
          events={events}
          defaultView="month"
          views={['month']}
          eventPropGetter={getEventStyle}
          onSelectEvent={handleSelectEvent}
          style={{ height: '100%' }}
        />
      </div>

      <div className="flex gap-4 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#FAEEDA', border: '1px solid #633806' }} />
          <span className="text-xs text-gray-600">Content deadline</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#EAF3DE', border: '1px solid #27500A' }} />
          <span className="text-xs text-gray-600">Payment due</span>
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
