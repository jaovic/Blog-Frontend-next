"use client"

import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api"

const ROLES = ["author", "editor", "admin"]

export default function RoleManager({ userId, token }: { userId: string; token: string }) {
  const router = useRouter()

  async function assignRole(role: string) {
    await authApi(token).patch(`/users/${userId}/roles`, { roles: [role] })
    router.refresh()
  }

  return (
    <select
      onChange={(e) => { if (e.target.value) assignRole(e.target.value) }}
      defaultValue=""
      className="text-sm font-medium border border-slate-300 bg-white text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
    >
      <option value="" disabled>Selecionar...</option>
      {ROLES.map(role => (
        <option key={role} value={role}>{role}</option>
      ))}
    </select>
  )
}
