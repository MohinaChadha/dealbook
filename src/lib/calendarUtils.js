import { addDays } from 'date-fns'

export const getCalendarEvents = (deals) => {
  const events = []

  deals.forEach(deal => {
    if (deal.deadline && !['paid', 'dead'].includes(deal.status)) {
      events.push({
        title: `${deal.brand_name} – ${deal.deliverable}`,
        start: new Date(deal.deadline),
        end: new Date(deal.deadline),
        type: 'deadline',
        deal
      })
    }

    if (deal.invoice_date && !deal.payment_date) {
      const paymentDue = addDays(new Date(deal.invoice_date), 30)
      events.push({
        title: `${deal.brand_name} – payment due`,
        start: paymentDue,
        end: paymentDue,
        type: 'payment',
        deal
      })
    }
  })

  return events
}

export const getEventStyle = (event) => {
  if (event.type === 'deadline') {
    return {
      style: {
        backgroundColor: '#FAEEDA',
        borderRadius: '4px',
        opacity: 0.9,
        color: '#633806',
        border: 'none',
        display: 'block'
      }
    }
  }
  if (event.type === 'payment') {
    return {
      style: {
        backgroundColor: '#EAF3DE',
        borderRadius: '4px',
        opacity: 0.9,
        color: '#27500A',
        border: 'none',
        display: 'block'
      }
    }
  }
  return {}
}
