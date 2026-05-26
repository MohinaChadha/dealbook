import { useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import enIN from 'date-fns/locale/en-IN'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { getCalendarEvents, getEventStyle } from '../lib/calendarUtils'
import DealForm from './DealForm'

const locales = {
  'en-IN': enIN,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export default function CalendarView({ deals, onUpdateDeal }) {
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const events = getCalendarEvents(deals)

  const handleSelectEvent = (event) => {
    setSelectedDeal(event.deal)
    setIsFormOpen(true)
  }

  const handleFormSave = async (formData) => {
    if (selectedDeal) {
      await onUpdateDeal(selectedDeal.id, formData)
    }
    setIsFormOpen(false)
  }

  if (deals.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[calc(100vh-60px)]">
        <p className="text-gray-500 text-lg">No deals to display in calendar yet</p>
      </div>
    )
  }

  return (
    <div className="p-6 h-[calc(100vh-60px)]">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Calendar</h2>
      
      <div style={{ height: 'calc(100% - 50px)' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={(event) => getEventStyle(event)}
          popup
        />
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
