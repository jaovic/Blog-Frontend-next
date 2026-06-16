"use client"

import { signIn } from "next-auth/react"
import { useEffect } from "react"

export default function LoginPage() {
  useEffect(() => {
    signIn("keycloak")
  }, [])

  return (
    <div className="flex items-center justify-center py-32">
      <p className="text-slate-400 text-sm animate-pulse">A redirecionar para o login…</p>
    </div>
  )
}
