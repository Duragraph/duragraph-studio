import { Link, useLocation } from '@tanstack/react-router'
import { MessageSquare, Activity, UserCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Chat', href: '/', icon: MessageSquare },
  { name: 'Traces', href: '/traces', icon: Activity },
  { name: 'Approvals', href: '/approvals', icon: UserCheck },
]

export function Header() {
  const location = useLocation()

  return (
    <header className="border-b border-border bg-background px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-semibold">DuraGraph Studio</h1>
          <nav className="flex gap-6">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-2 text-sm font-medium transition-colors',
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
