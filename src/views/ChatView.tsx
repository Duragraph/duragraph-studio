import React, { useState } from 'react'
import { useChatStore } from '@/stores/chat'
import { useCreateRun } from '@/api/runs'
import { useRunStream } from '@/hooks/useRunStream'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Send, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { formatDate } from '@/lib/utils'

export function ChatView() {
  const [message, setMessage] = useState('')
  const [currentRunId, setCurrentRunId] = useState<string | null>(null)
  
  const { selectedThreadId, selectedAssistantId, messages, addMessage, isStreaming, setIsStreaming } = useChatStore()
  const createRun = useCreateRun()
  const { events, isConnected } = useRunStream(currentRunId)

  const canSend = selectedThreadId && selectedAssistantId && message.trim() && !isStreaming

  const handleSend = async () => {
    if (!canSend) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message.trim(),
      timestamp: new Date().toISOString(),
    }

    addMessage(userMessage)
    setMessage('')
    setIsStreaming(true)

    try {
      const run = await createRun.mutateAsync({
        thread_id: selectedThreadId!,
        assistant_id: selectedAssistantId!,
        input: { message: userMessage.content },
      })

      setCurrentRunId(run.run_id)
      
      // Add a placeholder assistant message that will be updated via SSE
      addMessage({
        id: run.run_id,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
      })

    } catch (error) {
      console.error('Failed to create run:', error)
      setIsStreaming(false)
    }
  }

  // Process SSE events to update chat
  React.useEffect(() => {
    const lastEvent = events[events.length - 1]
    if (!lastEvent) return

    if (lastEvent.type === 'run.completed') {
      setIsStreaming(false)
      // Update the assistant message with final output
      if (lastEvent.data && typeof lastEvent.data === 'object' && 'output' in lastEvent.data) {
        const output = lastEvent.data.output as any
        if (output?.content) {
          // Find and update the assistant message
          // This is a simple approach - in production you'd want more robust state management
        }
      }
    } else if (lastEvent.type === 'run.failed') {
      setIsStreaming(false)
      addMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.',
        timestamp: new Date().toISOString(),
      })
    } else if (lastEvent.type === 'output.chunk') {
      // Handle streaming output chunks
      // This would append to the current assistant message
    }
  }, [events])

  if (!selectedThreadId || !selectedAssistantId) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-lg">Welcome to DuraGraph Studio</p>
          <p className="mt-2 text-sm">
            Select a thread and assistant to start a conversation
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Connection Status */}
      {currentRunId && (
        <div className="border-b border-border px-6 py-2">
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
            {isStreaming && (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Assistant is thinking...</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 px-6 py-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
                    {msg.content || 'Thinking...'}
                  </ReactMarkdown>
                ) : (
                  <p>{msg.content}</p>
                )}
                <p className="mt-1 text-xs opacity-70">
                  {formatDate(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Type your message..."
              disabled={isStreaming}
            />
            <Button onClick={handleSend} disabled={!canSend}>
              {isStreaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}