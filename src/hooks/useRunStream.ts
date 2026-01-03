import { useEffect, useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createRunStream } from '@/lib/sse'
import { queryKeys } from '@/api/keys'
import type { RunEvent } from '@/types/entities'

export function useRunStream(runId: string | null) {
  const [events, setEvents] = useState<RunEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!runId) {
      setEvents([])
      setIsConnected(false)
      setError(null)
      return
    }

    const stream = createRunStream(runId, {
      onOpen: () => {
        setIsConnected(true)
        setError(null)
      },
      onMessage: (event) => {
        setEvents((prev) => [...prev, event])

        // Invalidate run query on status changes
        if (event.type.startsWith('run.')) {
          queryClient.invalidateQueries({ queryKey: queryKeys.run(runId) })
        }
      },
      onError: () => {
        setIsConnected(false)
        setError(new Error('Connection lost'))
      },
      onClose: () => {
        setIsConnected(false)
      },
    })

    stream.connect()

    return () => {
      stream.disconnect()
    }
  }, [runId, queryClient])

  const clear = useCallback(() => setEvents([]), [])

  return { events, isConnected, error, clear }
}
