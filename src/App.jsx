import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Nav from './components/Nav'
import DealBoard from './components/DealBoard'
import CalendarView from './components/CalendarView'
import PaymentTracker from './components/PaymentTracker'
import Dashboard from './components/Dashboard'
import { useDeals } from './hooks/useDeals'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('board')
  const { deals, loading: dealsLoading, error, addDeal, updateDeal, deleteDeal } = useDeals()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        if (!user) {
          window.location.href = '/'
        }
      } catch (err) {
        console.error('Auth error:', err)
        window.location.href = '/'
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription?.unsubscribe()
  }, [])

  if (loading || dealsLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading DealBook...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-auto">
        {activeTab === 'board' && (
          <DealBoard 
            deals={deals} 
            onAddDeal={addDeal}
            onUpdateDeal={updateDeal}
            onDeleteDeal={deleteDeal}
          />
        )}
        {activeTab === 'calendar' && (
          <CalendarView 
            deals={deals}
            onUpdateDeal={updateDeal}
          />
        )}
        {activeTab === 'payments' && (
          <PaymentTracker 
            deals={deals}
            onUpdateDeal={updateDeal}
          />
        )}
        {activeTab === 'dashboard' && (
          <Dashboard deals={deals} />
        )}
      </main>
    </div>
  )
}