import { supabase } from '../lib/supabase'

export default function Login() {
  const handleGoogleLogin = async () => {
    try {
      console.log('Starting Google login...')
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
      console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`
        }
      })

      if (error) {
        console.error('Login error:', error)
        alert('Login error: ' + error.message)
      }
      if (data) {
        console.log('Login successful:', data)
      }
    } catch (err) {
      console.error('Exception:', err)
      alert('Exception: ' + err.message)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">DealBook</h1>
        <p className="text-gray-600 mb-8">Manage your influencer deals efficiently</p>
        <button
          onClick={handleGoogleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
        >
          Login with Google
        </button>
      </div>
    </div>
  )
}