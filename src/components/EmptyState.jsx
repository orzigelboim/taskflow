const messages = [
  { icon: '🌱', text: 'Nothing here yet. Add your first task!' },
  { icon: '✨', text: 'A fresh start. What are you working on?' },
  { icon: '🎯', text: 'No tasks yet. Let\'s get something done.' },
  { icon: '📋', text: 'All clear! Add a task to get started.' },
]

export default function EmptyState({ listName, accentColor }) {
  const msg = messages[Math.abs(listName?.charCodeAt(0) ?? 0) % messages.length]

  return (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center select-none">
      <div className="text-4xl mb-4">{msg.icon}</div>
      <p className="text-tx-secondary text-sm leading-relaxed max-w-xs">{msg.text}</p>
      <div
        className="mt-6 h-px w-12 rounded opacity-30"
        style={{ backgroundColor: accentColor ?? '#6366f1' }}
      />
    </div>
  )
}
