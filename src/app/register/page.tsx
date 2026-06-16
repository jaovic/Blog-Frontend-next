"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { api } from "@/lib/api"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    username: "", email: "", password: "", firstName: "", lastName: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await api.post("/users/register", form)
      // após registo, faz login automático
      await signIn("keycloak", { callbackUrl: "/dashboard" })
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao criar conta")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Criar conta</h1>
          <p className="text-slate-500 mt-2 text-sm">Junta-te à plataforma como autor</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={e => set("firstName", e.target.value)}
                  required
                  placeholder="João"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Apelido</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={e => set("lastName", e.target.value)}
                  required
                  placeholder="Silva"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={e => set("username", e.target.value)}
                required
                placeholder="joaosilva"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set("email", e.target.value)}
                required
                placeholder="joao@exemplo.com"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => set("password", e.target.value)}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors mt-2"
            >
              {loading ? "A criar conta…" : "Criar conta"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Já tens conta?{" "}
            <button
              onClick={() => signIn("keycloak")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Entrar
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
