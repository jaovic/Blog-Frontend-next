import { auth } from "@/lib/auth"
import { authApi } from "@/lib/api"
import { User } from "@/types"
import RoleManager from "./RoleManager"

async function getUsers(token: string): Promise<User[]> {
  try {
    const { data } = await authApi(token).get("/users")
    return data
  } catch {
    return []
  }
}

export default async function AdminUsersPage() {
  const session = await auth()
  const users = await getUsers(session?.accessToken as string)

  return (
    <div>
      <div className="mb-8 pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">Utilizadores</h1>
        <p className="text-slate-500 mt-1 text-sm">Gestão de utilizadores e roles — clica nas pills para atribuir ou remover</p>
      </div>

      {/* tabela — desktop */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-700">Utilizador</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-700">Email</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-700">Roles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => {
              const userRoles = (user.roles ?? []).filter(r => ["author", "editor", "admin"].includes(r))
              return (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-900">{user.username}</td>
                  <td className="px-5 py-4 text-slate-600">{user.email}</td>
                  <td className="px-5 py-4">
                    <RoleManager userId={user.id} token={session?.accessToken as string} currentRoles={userRoles} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* cards — mobile */}
      <div className="md:hidden space-y-3">
        {users.map((user) => {
          const userRoles = (user.roles ?? []).filter(r => ["author", "editor", "admin"].includes(r))
          return (
            <div key={user.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <div>
                <p className="font-semibold text-slate-900">{user.username}</p>
                <p className="text-sm text-slate-500 truncate">{user.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Roles</p>
                <RoleManager userId={user.id} token={session?.accessToken as string} currentRoles={userRoles} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
