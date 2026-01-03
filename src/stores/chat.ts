import { create } from 'zustand'

interface ChatState {
  selectedThreadId: string | null
  selectedAssistantId: string | null
  messages: Array<{
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: string
  }>
  isStreaming: boolean
  setSelectedThreadId: (id: string | null) => void
  setSelectedAssistantId: (id: string | null) => void
  addMessage: (message: {
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: string
  }) => void
  setIsStreaming: (streaming: boolean) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  selectedThreadId: null,
  selectedAssistantId: null,
  messages: [],
  isStreaming: false,
  setSelectedThreadId: (id) => set({ selectedThreadId: id }),
  setSelectedAssistantId: (id) => set({ selectedAssistantId: id }),
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),
  setIsStreaming: (streaming) => set({ isStreaming: streaming }),
  clearMessages: () => set({ messages: [] }),
}))