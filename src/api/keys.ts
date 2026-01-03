export const queryKeys = {
  // Runs
  runs: ['runs'] as const,
  runsList: (filters?: Record<string, unknown>) => ['runs', 'list', filters] as const,
  run: (id: string) => ['runs', id] as const,
  runEvents: (id: string) => ['runs', id, 'events'] as const,

  // Assistants
  assistants: ['assistants'] as const,
  assistantsList: (filters?: Record<string, unknown>) => ['assistants', 'list', filters] as const,
  assistant: (id: string) => ['assistants', id] as const,

  // Threads
  threads: ['threads'] as const,
  threadsList: (filters?: Record<string, unknown>) => ['threads', 'list', filters] as const,
  thread: (id: string) => ['threads', id] as const,
  threadRuns: (id: string) => ['threads', id, 'runs'] as const,
}