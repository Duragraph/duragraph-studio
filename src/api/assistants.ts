import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './keys'
import { api } from '@/lib/api'
import type { CreateAssistantRequest } from '@/types/requests'

export function useAssistants(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.assistantsList(filters),
    queryFn: () => api.get('/assistants'),
  })
}

export function useAssistant(id: string) {
  return useQuery({
    queryKey: queryKeys.assistant(id),
    queryFn: () => api.get(`/assistants/${id}`),
    enabled: !!id,
  })
}

export function useCreateAssistant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAssistantRequest) => api.post('/assistants', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assistants })
    },
  })
}

export function useUpdateAssistant(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<CreateAssistantRequest>) => api.patch(`/assistants/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assistant(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.assistants })
    },
  })
}

export function useDeleteAssistant(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => api.delete(`/assistants/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assistants })
    },
  })
}