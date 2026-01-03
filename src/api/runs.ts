import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './keys'
import { api } from '@/lib/api'
import type { CreateRunRequest } from '@/types/requests'
import type { ToolOutput, Run } from '@/types/entities'

export function useRuns(filters?: Record<string, unknown>) {
  return useQuery<Run[]>({
    queryKey: queryKeys.runsList(filters),
    queryFn: () => api.get('/runs'),
  })
}

export function useRun(id: string) {
  return useQuery<Run>({
    queryKey: queryKeys.run(id),
    queryFn: () => api.get(`/runs/${id}`),
    enabled: !!id,
  })
}

export function useCreateRun() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRunRequest) => api.post('/runs', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.runs })
    },
  })
}

export function useSubmitToolOutputs(runId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (outputs: ToolOutput[]) =>
      api.post(`/runs/${runId}/submit_tool_outputs`, { tool_outputs: outputs }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.run(runId) })
    },
  })
}

export function useCancelRun(runId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => api.post(`/runs/${runId}/cancel`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.run(runId) })
    },
  })
}