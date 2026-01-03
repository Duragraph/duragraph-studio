import { useThreads } from '@/api/threads'
import { useAssistants } from '@/api/assistants'
import { useChatStore } from '@/stores/chat'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { useCreateThread } from '@/api/threads'

export function Sidebar() {
  const { selectedThreadId, selectedAssistantId, setSelectedThreadId, setSelectedAssistantId } =
    useChatStore()
  const { data: threads, isLoading: threadsLoading } = useThreads()
  const { data: assistants, isLoading: assistantsLoading } = useAssistants()
  const createThread = useCreateThread()

  const handleCreateThread = () => {
    createThread.mutate(
      {},
      {
        onSuccess: (thread) => {
          setSelectedThreadId(thread.thread_id)
        },
      }
    )
  }

  return (
    <aside className="w-64 border-r border-border bg-background p-4">
      <div className="space-y-4">
        {/* Thread Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Thread</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCreateThread}
              disabled={createThread.isPending}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Select value={selectedThreadId || ''} onValueChange={setSelectedThreadId}>
            <SelectTrigger>
              <SelectValue placeholder="Select thread..." />
            </SelectTrigger>
            <SelectContent>
              {threadsLoading ? (
                <SelectItem value="loading" disabled>
                  Loading...
                </SelectItem>
              ) : threads?.length ? (
                threads.map((thread: { thread_id: string }) => (
                  <SelectItem key={thread.thread_id} value={thread.thread_id}>
                    {thread.thread_id.slice(0, 8)}...
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="empty" disabled>
                  No threads
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Assistant Selection */}
        <div>
          <label className="text-sm font-medium mb-2 block">Assistant</label>
          <Select value={selectedAssistantId || ''} onValueChange={setSelectedAssistantId}>
            <SelectTrigger>
              <SelectValue placeholder="Select assistant..." />
            </SelectTrigger>
            <SelectContent>
              {assistantsLoading ? (
                <SelectItem value="loading" disabled>
                  Loading...
                </SelectItem>
              ) : assistants?.length ? (
                assistants.map((assistant: { assistant_id: string; name: string }) => (
                  <SelectItem key={assistant.assistant_id} value={assistant.assistant_id}>
                    {assistant.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="empty" disabled>
                  No assistants
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </aside>
  )
}
