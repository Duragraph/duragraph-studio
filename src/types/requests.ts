import type { ToolOutput } from './entities'

export interface CreateRunRequest {
  thread_id: string
  assistant_id: string
  input: Record<string, unknown>
  config?: Record<string, unknown>
}

export interface CreateAssistantRequest {
  name: string
  description?: string
  graph_id: string
  config?: Record<string, unknown>
  metadata?: Record<string, unknown>
}

export interface CreateThreadRequest {
  metadata?: Record<string, unknown>
}

export interface AddMessageRequest {
  role: 'user' | 'system'
  content: string
}

export interface SubmitToolOutputsRequest {
  tool_outputs: ToolOutput[]
}