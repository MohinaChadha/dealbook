# DealBook - Brand Deal CRM for Indian Creators

A web app to help Indian content creators track their brand deals from first contact to payment received.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Supabase

Create a table in Supabase with the following SQL:

```sql
create table deals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  brand_name text not null,
  contact_name text,
  contact_whatsapp text,
  platform text,
  deliverable text,
  rate_inr numeric,
  status text default 'lead',
  deadline date,
  posted_date date,
  invoice_date date,
  payment_date date,
  notes text,
  created_at timestamptz default now()
);

alter table deals enable row level security;
create policy "own deals" on deals
  using (auth.uid() = user_id);
```

Also enable Google OAuth in Supabase Authentication settings.

### 4. Run Development Server

```bash
npm run dev
```

The app will open at http://localhost:5173

## Features

- **Board Tab**: Kanban board with drag-and-drop to manage deal status
- **Calendar Tab**: Monthly calendar view showing deadlines and payment dates
- **Payments Tab**: Track invoiced and paid deals with overdue indicators
- **Dashboard Tab**: Monthly metrics and deal status overview

## Tech Stack

- React + Vite
- Tailwind CSS
- Supabase (authentication + database)
- react-big-calendar
- @dnd-kit (drag and drop)

## Deployment

Deploy to Vercel:
```bash
npm run build
# Push to GitHub and connect with Vercel
```
