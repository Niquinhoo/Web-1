import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchClient } from '../api/client'

export function useFetch(endpoint, dependencies = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const dependencyKey = dependencies.join('|')
  const dataRef = useRef(null)

  useEffect(() => {
    dataRef.current = data
  }, [data])

  const loadData = useCallback(async () => {
    if (!endpoint) return

    if (!dataRef.current) {
      setLoading(true)
    }
    setError(null)

    try {
      const response = await fetchClient(endpoint)
      setData(response)
    } catch (fetchError) {
      setError(fetchError.message)
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadData()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadData, dependencyKey])

  return { data, setData, loading, error, refetch: loadData }
}
