import { useState } from 'react'
import { useRuns } from '@/api/runs'
import { useSubmitToolOutputs } from '@/api/runs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Clock, CheckCircle, Loader2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Run } from '@/types/entities'

export function ApprovalsView() {
  const { data: runs, isLoading } = useRuns()
  const [toolOutputs, setToolOutputs] = useState<Record<string, string>>({})
  
  // Filter runs that require action
  const pendingRuns = runs?.filter((run: Run) => run.status === 'requires_action') || []

  const handleToolOutput = (runId: string, toolCallId: string, output: string) => {
    setToolOutputs(prev => ({
      ...prev,
      [`${runId}:${toolCallId}`]: output,
    }))
  }

  const ToolOutputForm = ({ run }: { run: Run }) => {
    const submitToolOutputs = useSubmitToolOutputs(run.run_id)
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!run.required_action?.submit_tool_outputs) {
      return null
    }

    const toolCalls = run.required_action.submit_tool_outputs.tool_calls

    const handleSubmit = async () => {
      setIsSubmitting(true)
      try {
        const outputs = toolCalls.map(toolCall => ({
          tool_call_id: toolCall.id,
          output: toolOutputs[`${run.run_id}:${toolCall.id}`] || '',
        }))

        await submitToolOutputs.mutateAsync(outputs)
        
        // Clear the form
        toolCalls.forEach(toolCall => {
          setToolOutputs(prev => {
            const newOutputs = { ...prev }
            delete newOutputs[`${run.run_id}:${toolCall.id}`]
            return newOutputs
          })
        })
      } catch (error) {
        console.error('Failed to submit tool outputs:', error)
      } finally {
        setIsSubmitting(false)
      }
    }

    const allOutputsProvided = toolCalls.every(
      toolCall => toolOutputs[`${run.run_id}:${toolCall.id}`]?.trim()
    )

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <p className="text-sm text-amber-800">
            This run needs tool outputs to continue execution.
          </p>
        </div>

        {toolCalls.map((toolCall) => {
          const outputKey = `${run.run_id}:${toolCall.id}`
          let parsedArgs = {}
          
          try {
            parsedArgs = JSON.parse(toolCall.function.arguments)
          } catch (e) {
            // Ignore parsing errors
          }

          return (
            <Card key={toolCall.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{toolCall.function.name}</CardTitle>
                  <Badge variant="outline">Function Call</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">Arguments:</p>
                  <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                    {JSON.stringify(parsedArgs, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <label className="text-sm font-medium">
                    Provide output for this tool call:
                  </label>
                  <Textarea
                    placeholder="Enter the result of this function call..."
                    value={toolOutputs[outputKey] || ''}
                    onChange={(e) => handleToolOutput(run.run_id, toolCall.id, e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}

        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleSubmit}
            disabled={!allOutputsProvided || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Tool Outputs'
            )}
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Approvals</h1>
        <p className="text-muted-foreground mt-1">
          Review and approve pending human-in-the-loop actions
        </p>
      </div>

      {pendingRuns.length > 0 ? (
        <div className="space-y-6">
          {pendingRuns.map((run) => (
            <Card key={run.run_id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-amber-600" />
                      Run Pending Approval
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(run.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">requires_action</Badge>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      {run.run_id.slice(0, 12)}...
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ToolOutputForm run={run} />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-12">
          <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No pending approvals</p>
          <p className="text-sm mt-2">
            All runs are executing normally without human intervention
          </p>
        </div>
      )}
    </div>
  )
}