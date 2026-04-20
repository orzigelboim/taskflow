import { NavLink, useLocation } from 'react-router-dom'
import { Archive, Settings } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

export default function BottomNav() {
  const { lists, tasks } = useApp()
  const location = useLocation()

  const isListActive = (id) => location.pathname === `/list/${id}`

  return (
    <div className="flex items-end h-16">
      <div className="flex-1 flex items-center overflow-x-auto no-scrollbar h-full px-1">
        {lists.map(list => {
          const active = isListActive(list.id)
          const count = tasks.filter(t => t.list_id === list.id).length
          return (
            <NavLink
              key={list.id}
              to={`/list/${list.id}`}
              className="flex flex-col items-center justify-center min-w-[60px] px-3 h-full gap-0.5 shrink-0"
            >
              <span
                className="text-xs font-bold leading-none min-h-[14px]"
                style={{ color: list.accent_color, opacity: active ? 1 : 0.45 }}
              >
                {count > 0 ? count : ''}
              </span>
              <span
                className="text-[11px] font-medium truncate max-w-[72px] transition-colors"
                style={{ color: active ? list.accent_color : `${list.accent_color}99` }}
              >
                {list.name}
              </span>
            </NavLink>
          )
        })}
      </div>

      <div className="flex items-center h-full border-l border-border shrink-0">
        <NavLink
          to="/archive"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-12 h-full gap-0.5 ${isActive ? 'text-tx-primary' : 'text-tx-muted'}`
          }
        >
          <Archive size={17} />
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-12 h-full gap-0.5 ${isActive ? 'text-tx-primary' : 'text-tx-muted'}`
          }
        >
          <Settings size={17} />
        </NavLink>
      </div>
    </div>
  )
}
