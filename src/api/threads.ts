import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './keys'
import { api } from '@/lib/api'
import type { CreateThreadRequest, AddMessageRequest } from '@/types/requests'

export function useThreads(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.threadsList(filters),
    queryFn: () => api.get('/threads'),
  })
}

export function useThread(id: string) {
  return useQuery({
    queryKey: queryKeys.thread(id),
    queryFn: () => api.get(`/threads/${id}`),
    enabled: !!id,
  })
}

export function useThreadRuns(id: string) {
  return useQuery({
    queryKey: queryKeys.threadRuns(id),
    queryFn: () => api.get(`/threads/${id}/runs`),
    enabled: !!id,
  })
}

export function useCreateThread() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateThreadRequest = {}) => api.post('/threads', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threads })
    },
  })
}

export function useAddMessage(threadId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AddMessageRequest) => api.post(`/threads/${threadId}/messages`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.thread(threadId) })
    },
  })
}

export function useDeleteThread(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => api.delete(`/threads/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threads })
    },
  })
}
