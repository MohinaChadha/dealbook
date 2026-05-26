import { supabase } from '../lib/supabase'

export default function Nav({ user, activeTab, setActiveTab }) {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const tabs = [
    { id: 'board', label: 'Board' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'payments', label: 'Payments' },
    { id: 'dashboard', label: 'Dashboard' }
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-gray-900">DealBook</h1>
          <div className="flex gap-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-gray-900 border-b-2 border-gray-900 pb-1'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {user?.user_metadata?.avatar_url && (
            <img 
              src={user.user_metadata.avatar_url}
              alt={user.user_metadata.full_name}
              className="w-10 h-10 rounded-full"
            />
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-gray-900 hover:bg-gray-100 rounded-md transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
