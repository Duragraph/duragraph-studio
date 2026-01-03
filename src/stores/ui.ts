import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  activeView: 'chat' | 'traces' | 'approvals'
  setSidebarOpen: (open: boolean) => void
  setActiveView: (view: 'chat' | 'traces' | 'approvals') => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeView: 'chat',
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveView: (view) => set({ activeView: view }),
}))