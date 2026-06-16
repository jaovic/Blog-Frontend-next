"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api"

const ROLES = ["author", "editor", "admin"] as const
type Role = typeof ROLES[number]

const ROLE_STYLE: Record<Role, { active: string; inactive: string }> = {
  author: {
    active:   "bg-blue-600 text-white border-blue-600 shadow-sm",
    inactive: "bg-white text-slate-400 border-slate-200 hover:border-blue-400 hover:text-blue-500",
  },
  editor: {
    active:   "bg-violet-600 text-white border-violet-600 shadow-sm",
    inactive: "bg-white text-slate-400 border-slate-200 hover:border-violet-400 hover:text-violet-500",
  },
  admin: {
    active:   "bg-rose-600 text-white border-rose-600 shadow-sm",
    inactive: "bg-white text-slate-400 border-slate-200 hover:border-rose-400 hover:text-rose-500",
  },
}

interface Props {
  userId: string
  token: string
  currentRoles: string[]
}

export default function RoleManager({ userId, token, currentRoles }: Props) {
  const router = useRouter()
  const initial = ROLES.filter(r => currentRoles.includes(r))
  const [active, setActive] = useState<Role[]>(initial)
  const [saving, setSaving] = useState(false)

  async function toggle(role: Role) {
    const next = active.includes(role)
      ? active.filter(r => r !== role)
      : [...active, role]

    // precisa de ter pelo menos 1 role
    if (next.length === 0) return

    setSaving(true)
    try {
      await authApi(token).patch(`/users/${userId}/roles`, { roles: next })
      setActive(next)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={`flex gap-1.5 transition-opacity ${saving ? "opacity-50 pointer-events-none" : ""}`}>
      {ROLES.map(role => {
        const isActive = active.includes(role)
        const style = ROLE_STYLE[role]
        return (
          <button
            key={role}
            onClick={() => toggle(role)}
            title={isActive ? `Remover role ${role}` : `Atribuir role ${role}`}
            className={`
              text-xs font-semibold px-2.5 py-1 rounded-full border transition-all duration-150 cursor-pointer
              ${isActive ? style.active : style.inactive}
            `}
          >
            {role}
          </button>
        )
      })}
    </div>
  )
}
