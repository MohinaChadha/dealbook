# DealBook

Brand deal CRM for Content Creators on Instagram and YouTube.

## The problem

Most creators manage brand deals across WhatsApp, Gmail, Notes, and spreadsheets simultaneously. There's no single place to track who contacted them, what was agreed, when content is due, and whether they've been paid.

## What DealBook does

- **Kanban board** — track every deal from first contact to payment received
- **Calendar view** — see content deadlines and payment due dates in one place
- **Payment tracker** — know exactly who owes you money and how overdue they are
- **Dashboard** — monthly summary of deals confirmed, revenue pending, and overdue payments

## Built for Indian creators

- All amounts in ₹ with Indian number formatting
- Designed around the WhatsApp-first, brand-deal-heavy workflow of mid-size Indian creators
- GST invoice generation coming in v2

## Tech stack

- React + Vite + Tailwind CSS
- Supabase (database + auth)
- react-big-calendar
- @dnd-kit/core
- Vercel (hosting)

## Running locally

1. Clone the repo

```bash
   git clone https://github.com/YOUR_USERNAME/dealbook.git
   cd dealbook
```

2. Install dependencies

```bash
   npm install
```

3. Create a `.env.local` file in the root
