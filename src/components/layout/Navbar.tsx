"use client"

import Link from "next/link"
import { Session } from "next-auth"
import { signIn, signOut } from "next-auth/react"

interface NavbarProps {
  session: Session | null
}

export default function Navbar({ session }: NavbarProps) {
  const roles: string[] = session?.roles ?? []

  return (
    <nav className="bg-slate-900 border-b border-slate-700">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-lg text-white tracking-tight">
            ✍️ Blog
          </Link>
          {session && (
            <>
              <Link href="/dashboard" className="text-sm text-slate-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              {(roles.includes("editor") || roles.includes("admin")) && (
                <Link href="/review" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Revisão
                </Link>
              )}
              {roles.includes("admin") && (
                <Link href="/admin/users" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Admin
                </Link>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-slate-400 font-medium">{session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-100 px-3 py-1.5 rounded-md transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("keycloak")}
              className="text-sm bg-blue-500 hover:bg-blue-400 text-white font-medium px-4 py-1.5 rounded-md transition-colors"
            >
              Entrar
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
