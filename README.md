# DuraGraph Studio

Interactive UI for AI agent interaction, reasoning visualization, and human-in-the-loop workflows.

[![DuraGraph](https://img.shields.io/badge/DuraGraph-v0.5.0-blue)](https://github.com/Duragraph/duragraph)
[![License](https://img.shields.io/badge/License-Apache%202.0-green)](LICENSE)

## Overview

DuraGraph Studio is a React-based UI for interacting with AI agents powered by DuraGraph. Unlike the admin dashboard (for monitoring and management), Studio focuses on the **end-user experience** of working with agents.

### Key Features

- **Chat Interface** - Conversational interaction with streaming responses
- **Agent Reasoning** - Visualize agent thinking, steps, and tool calls in real-time
- **Human-in-the-Loop** - Handle approval workflows and user decisions
- **Run Inspector** - Debug and inspect agent execution

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Running DuraGraph server (see main repository)

### Development Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# The studio will be available at http://localhost:3001
```

### Using Docker (Recommended)

```bash
docker run -p 3000:80 \
  -e VITE_DURAGRAPH_API_URL=http://localhost:8081 \
  ghcr.io/duragraph/duragraph-studio:latest
```

Open http://localhost:3000

## Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `VITE_DURAGRAPH_API_URL` | `http://localhost:8081` | DuraGraph API URL |

## Features Implemented

### ✅ v0.5 Milestone Complete

1. **Chat Interface with Streaming** (Issue #10)
   - Real-time conversational UI
   - Server-Sent Events (SSE) integration
   - Markdown message rendering
   - Thread and assistant selection

2. **Agent Trace Visualization** (Issue #11)
   - Step-by-step execution timeline
   - Node-level input/output inspection
   - Real-time execution updates
   - Error and status tracking

3. **Thread/Run Selection** (Issue #12)
   - Thread management and creation
   - Run history per thread
   - Assistant selection interface
   - Quick thread switching

## Tech Stack

- **Framework:** React 19
- **Build:** Vite
- **Language:** TypeScript
- **Styling:** TailwindCSS + shadcn/ui
- **State:** TanStack Query + Zustand
- **Routing:** TanStack Router

## Views

### Chat

Primary conversational interface with streaming responses, markdown rendering, and thread management.

**Features:**
- Real-time message streaming via SSE
- Thread and assistant selection
- Message history
- Markdown rendering for rich responses
- Connection status indicators

### Traces

Visualize agent reasoning like in Cursor - see steps appearing as the agent thinks, tool calls with inputs/outputs.

**Features:**
- Run selection from recent executions
- Step-by-step execution timeline
- Node input/output inspection
- Error tracking and visualization
- Real-time execution updates

### Approvals

Handle human-in-the-loop workflows - approve actions, make choices, provide input when agents need human guidance.

**Features:**
- Pending approvals dashboard
- Tool output form submission
- Function call details and arguments
- Action approval/rejection interface

## Architecture

```
src/
├── components/
│   ├── ui/           # shadcn/ui primitives
│   └── layout/       # Header, Sidebar components
├── views/            # Main page components (Chat, Traces, Approvals)
├── hooks/            # Custom React hooks (SSE streaming)
├── stores/           # Zustand stores (UI, Chat state)
├── api/              # React Query hooks for API calls
├── lib/              # Utilities (API client, SSE client, formatters)
├── types/            # TypeScript type definitions
└── routes/           # TanStack Router file-based routes
```

## Integration with DuraGraph

Studio connects to DuraGraph via:

- **REST API** - Create runs, fetch threads, submit approvals
- **SSE Streaming** - Real-time updates for agent execution

```typescript
// Example: Using the chat store
const { selectedThreadId, selectedAssistantId, messages } = useChatStore()

// Example: Creating a run
const createRun = useCreateRun()
await createRun.mutateAsync({
  thread_id: threadId,
  assistant_id: assistantId,
  input: { message: userInput },
})
```

## Development Commands

```bash
# Install dependencies
npm install

# Run dev server with hot reload
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Build production bundle
npm run build

# Preview production build
npm run preview
```

## API Integration

The studio integrates with the DuraGraph API at:

- **Base URL:** `/api/v1` (proxied through Vite dev server)
- **SSE Endpoint:** `/api/v1/stream?run_id={id}` for real-time updates

### Key API Endpoints Used

| Endpoint | Method | Purpose |
|----------|---------|----------|
| `/api/v1/runs` | POST | Create new run |
| `/api/v1/runs/:run_id` | GET | Get run details |
| `/api/v1/assistants` | GET | List assistants |
| `/api/v1/threads` | GET/POST | Manage threads |
| `/api/v1/stream?run_id={id}` | SSE | Real-time run events |

## State Management

### Zustand Stores

- **UI Store** - Sidebar state, active view
- **Chat Store** - Selected thread/assistant, messages, streaming state

### TanStack Query

- Caches API responses
- Invalidates on mutations
- Provides loading/error states
- Background refetching

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for development guidelines.

## Related Projects

- [DuraGraph](https://github.com/Duragraph/duragraph) - Control plane
- [DuraGraph Examples](https://github.com/Duragraph/duragraph-examples) - Example agents

## License

Apache 2.0 - See [LICENSE](LICENSE) for details.
