import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Login from './components/Login'
import Nav from './components/Nav'
import DealBoard from './components/DealBoard'
import CalendarView from './components/CalendarView'
import PaymentTracker from './components/PaymentTracker'
import Dashboard from './components/Dashboard'
import { useDeals } from './hooks/useDeals'

function AppInner({ user }) {
  const [activeTab, setActiveTab] = useState('Board')
  const { deals, loading, addDeal, updateDeal, deleteDeal } = useDeals()

  const renderTab = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-400">
          Loading deals...
        </div>
      )
    }

    switch (activeTab) {
      case 'Board':
        return <DealBoard deals={deals} addDeal={addDeal} updateDeal={updateDeal} deleteDeal={deleteDeal} />
      case 'Calendar':
        return <CalendarView deals={deals} updateDeal={updateDeal} deleteDeal={deleteDeal} />
      case 'Payments':
        return <PaymentTracker deals={deals} updateDeal={updateDeal} deleteDeal={deleteDeal} />
      case 'Dashboard':
        return <Dashboard deals={deals} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav user={user} activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderTab()}
      </main>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )
    return () => subscription?.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading...
      </div>
    )
  }

  return user ? <AppInner user={user} /> : <Login />
}
