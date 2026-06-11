import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export const useDeals = () => {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setDeals([])
        return
      }

      const { data, error: fetchError } = await supabase
        .from('deals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setDeals(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching deals:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDeals()
  }, [fetchDeals])

  const addDeal = useCallback(async (dealData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not logged in')

      const tempId = 'temp_' + Math.random().toString(36).substr(2, 9)
      const tempDeal = { id: tempId, ...dealData, user_id: user.id, created_at: new Date().toISOString() }
      setDeals(prev => [tempDeal, ...prev])

      const { data, error } = await supabase
        .from('deals')
        .insert([{ ...dealData, user_id: user.id }])
        .select()

      if (error) throw error
      setDeals(prev => prev.map(d => d.id === tempId ? data[0] : d))
      return data[0]
    } catch (err) {
      console.error('Error adding deal:', err)
      setError(err.message)
      fetchDeals()
      throw err
    }
  }, [fetchDeals])

  const updateDeal = useCallback(async (id, dealData) => {
    try {
      setDeals(prev => prev.map(d => d.id === id ? { ...d, ...dealData } : d))

      const { data, error } = await supabase
        .from('deals')
        .update(dealData)
        .eq('id', id)
        .select()

      if (error) throw error
      setDeals(prev => prev.map(d => d.id === id ? data[0] : d))
      return data[0]
    } catch (err) {
      console.error('Error updating deal:', err)
      setError(err.message)
      fetchDeals()
      throw err
    }
  }, [fetchDeals])

  const deleteDeal = useCallback(async (id) => {
    try {
      setDeals(prev => prev.filter(d => d.id !== id))

      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      console.error('Error deleting deal:', err)
      setError(err.message)
      fetchDeals()
      throw err
    }
  }, [fetchDeals])

  return { deals, loading, error, addDeal, updateDeal, deleteDeal, refetch: fetchDeals }
}
