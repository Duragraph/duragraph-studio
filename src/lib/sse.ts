import type { RunEvent } from '@/types/entities'

export interface SSEOptions {
  onMessage?: (event: RunEvent) => void
  onError?: (error: Event) => void
  onOpen?: () => void
  onClose?: () => void
}

export class SSEClient {
  private eventSource: EventSource | null = null
  private url: string
  private options: SSEOptions

  constructor(url: string, options: SSEOptions = {}) {
    this.url = url
    this.options = options
  }

  connect() {
    if (this.eventSource) {
      this.disconnect()
    }

    this.eventSource = new EventSource(this.url)

    this.eventSource.onopen = () => {
      this.options.onOpen?.()
    }

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as RunEvent
        this.options.onMessage?.(data)
      } catch (error) {
        console.error('Failed to parse SSE message:', error)
      }
    }

    this.eventSource.onerror = (error) => {
      this.options.onError?.(error)
    }

    return this.eventSource
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
      this.options.onClose?.()
    }
  }

  get readyState() {
    return this.eventSource?.readyState || EventSource.CLOSED
  }
}

export function createRunStream(runId: string, options: SSEOptions = {}) {
  const API_BASE = import.meta.env.VITE_DURAGRAPH_API_URL || 'http://localhost:8081'
  const url = `${API_BASE}/api/v1/stream?run_id=${runId}`
  
  return new SSEClient(url, options)
}