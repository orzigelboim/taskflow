import { NavLink, useNavigate } from 'react-router-dom'
import { Archive, Settings, CheckSquare } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

export default function Sidebar() {
  const { lists, tasks } = useApp()

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors mx-2 ${
      isActive
        ? 'bg-bg-elevated text-tx-primary font-medium'
        : 'text-tx-secondary hover:text-tx-primary hover:bg-bg-elevated/50'
    }`

  return (
    <div className="flex flex-col h-full py-4 gap-1">
      <div className="flex items-center gap-2.5 px-6 pb-4 mb-1 border-b border-border">
        <CheckSquare size={18} className="text-indigo-400" />
        <span className="text-tx-primary font-semibold text-sm tracking-wide">TaskFlow</span>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {lists.length === 0 && (
          <p className="text-tx-muted text-xs px-6 py-2">No lists yet</p>
        )}
        {lists.map(list => {
          const count = tasks.filter(t => t.list_id === list.id).length
          return (
            <NavLink key={list.id} to={`/list/${list.id}`} className={linkClass}>
              {count > 0 ? (
                <span
                  className="text-xs font-bold w-4 text-center shrink-0 leading-none"
                  style={{ color: list.accent_color }}
                >
                  {count}
                </span>
              ) : (
                <span className="w-4 flex justify-center shrink-0">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: list.accent_color }}
                  />
                </span>
              )}
              <span className="truncate">{list.name}</span>
            </NavLink>
          )
        })}
      </div>

      <div className="border-t border-border pt-2 mt-1">
        <NavLink to="/archive" className={linkClass}>
          <Archive size={15} className="shrink-0" />
          Archive
        </NavLink>
        <NavLink to="/settings" className={linkClass}>
          <Settings size={15} className="shrink-0" />
          Settings
        </NavLink>
      </div>
    </div>
  )
}
