import { useState } from 'react'
import { useRuns } from '@/api/runs'
import { useRunStream } from '@/hooks/useRunStream'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Brain, Play, Loader2, Activity } from 'lucide-react'
import { formatDate, formatDuration } from '@/lib/utils'
import type { NodeExecutionEvent } from '@/types/entities'

export function TracesView() {
  const [selectedRunId, setSelectedRunId] = useState<string>('')
  const { data: runs, isLoading } = useRuns()
  const { events, isConnected } = useRunStream(selectedRunId || null)

  // Process events to build execution trace
  const executionSteps = events
    .filter((event) => event.type.includes('node.') || event.type.includes('run.'))
    .map((event) => {
      if (event.type.startsWith('node.')) {
        const nodeEvent = event.data as NodeExecutionEvent
        return {
          id: event.timestamp + nodeEvent.node_id,
          type: 'node',
          nodeId: nodeEvent.node_id,
          status: nodeEvent.status,
          input: nodeEvent.input,
          output: nodeEvent.output,
          error: nodeEvent.error,
          timestamp: event.timestamp,
        }
      } else {
        return {
          id: event.timestamp,
          type: 'run',
          status: event.type.split('.')[1],
          data: event.data,
          timestamp: event.timestamp,
        }
      }
    })

  const selectedRun = runs?.find(
    (run: { run_id: string }) => run.run_id === selectedRunId
  )

  return (
    <div className="flex h-full">
      {/* Run Selection Sidebar */}
      <div className="w-80 border-r border-border bg-background p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-3">Recent Runs</h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : runs?.length ? (
              <div className="space-y-2">
                {runs
                  .slice(0, 20)
                  .map(
                    (run: {
                      run_id: string
                      status: string
                      created_at: string
                      completed_at?: string
                    }) => (
                  <Card
                    key={run.run_id}
                    className={`cursor-pointer transition-colors hover:bg-muted ${
                      selectedRunId === run.run_id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedRunId(run.run_id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant={
                            run.status === 'completed'
                              ? 'default'
                              : run.status === 'failed'
                                ? 'destructive'
                                : 'secondary'
                          }
                        >
                          {run.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(run.created_at, run.completed_at)}
                        </span>
                      </div>
                      <p className="text-sm font-mono truncate">{run.run_id.slice(0, 12)}...</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(run.created_at)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No runs found</p>
            )}
          </div>

          {selectedRunId && (
            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={isConnected ? 'default' : 'secondary'}>
                  {isConnected ? 'Live' : 'Static'}
                </Badge>
                <span className="text-sm text-muted-foreground">{events.length} events</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trace Visualization */}
      <div className="flex-1 p-6">
        {selectedRun ? (
          <div className="space-y-6">
            {/* Run Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Run Details</CardTitle>
                  <Badge
                    variant={
                      selectedRun.status === 'completed'
                        ? 'default'
                        : selectedRun.status === 'failed'
                          ? 'destructive'
                          : 'secondary'
                    }
                  >
                    {selectedRun.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Run ID</p>
                    <p className="text-sm text-muted-foreground font-mono">{selectedRun.run_id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDuration(selectedRun.created_at, selectedRun.completed_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Thread</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {selectedRun.thread_id.slice(0, 8)}...
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedRun.created_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Execution Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Execution Trace</CardTitle>
              </CardHeader>
              <CardContent>
                {executionSteps.length > 0 ? (
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {executionSteps.map((step, index) => (
                        <div key={step.id} className="flex items-start gap-4">
                          {/* Timeline connector */}
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                step.type === 'run' ? 'bg-primary' : 'bg-secondary'
                              }`}
                            >
                              {step.type === 'node' && step.nodeId ? (
                                // Try to infer node type from nodeId or use generic icon
                                <Brain className="h-4 w-4 text-primary-foreground" />
                              ) : (
                                <Play className="h-4 w-4 text-primary-foreground" />
                              )}
                            </div>
                            {index < executionSteps.length - 1 && (
                              <div className="w-px h-8 bg-border mt-1" />
                            )}
                          </div>

                          {/* Step details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium">
                                {step.type === 'node'
                                  ? `Node: ${step.nodeId}`
                                  : `Run ${step.status}`}
                              </p>
                              <Badge variant="outline">{step.status}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(step.timestamp)}
                              </span>
                            </div>

                            {step.type === 'node' && (
                              <div className="space-y-2">
                                {step.input && (
                                  <details className="text-sm">
                                    <summary className="cursor-pointer text-muted-foreground">
                                      Input
                                    </summary>
                                    <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto">
                                      {JSON.stringify(step.input, null, 2)}
                                    </pre>
                                  </details>
                                )}
                                {step.output && (
                                  <details className="text-sm">
                                    <summary className="cursor-pointer text-muted-foreground">
                                      Output
                                    </summary>
                                    <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto">
                                      {JSON.stringify(step.output, null, 2)}
                                    </pre>
                                  </details>
                                )}
                                {step.error && (
                                  <div className="text-sm">
                                    <p className="text-destructive font-medium">Error:</p>
                                    <pre className="mt-1 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs">
                                      {step.error}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <p>No execution events yet</p>
                    {isConnected && (
                      <p className="text-sm mt-1">Events will appear here as the run executes</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a run to view its execution trace</p>
              <p className="text-sm mt-2">See how your AI agents think and execute step by step</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
