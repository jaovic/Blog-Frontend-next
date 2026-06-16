"use client"

import { useState } from "react"
import Link from "next/link"
import { Session } from "next-auth"
import { signIn, signOut } from "next-auth/react"

interface NavbarProps {
  session: Session | null
}

export default function Navbar({ session }: NavbarProps) {
  const roles: string[] = session?.roles ?? []
  const [open, setOpen] = useState(false)

  const navLinks = session ? [
    { href: "/dashboard", label: "Dashboard", show: true },
    { href: "/review",    label: "Revisão",   show: roles.includes("editor") || roles.includes("admin") },
    { href: "/admin/users", label: "Admin",   show: roles.includes("admin") },
  ].filter(l => l.show) : []

  return (
    <nav className="bg-slate-900 border-b border-slate-700">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-lg text-white tracking-tight">
            ✍️ Blog
          </Link>

          {/* links desktop */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} className="text-sm text-slate-300 hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* direita desktop */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-slate-400 font-medium truncate max-w-[160px]">
                {session.user?.name}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-100 px-3 py-1.5 rounded-md transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/register" className="text-sm text-slate-300 hover:text-white transition-colors">
                Criar conta
              </Link>
              <button
                onClick={() => signIn("keycloak")}
                className="text-sm bg-blue-500 hover:bg-blue-400 text-white font-medium px-4 py-1.5 rounded-md transition-colors"
              >
                Entrar
              </button>
            </>
          )}
        </div>

        {/* hamburger mobile */}
        <button
          onClick={() => setOpen(o => !o)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
          aria-label="Menu"
        >
          <span className={`block w-5 h-0.5 bg-slate-300 transition-transform duration-200 ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-slate-300 transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-slate-300 transition-transform duration-200 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* menu mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-slate-700 bg-slate-900 px-4 pb-4 pt-3 space-y-1">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm text-slate-300 hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-700 mt-2">
            {session ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 truncate max-w-[200px]">{session.user?.name}</span>
                <button
                  onClick={() => { signOut(); setOpen(false) }}
                  className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-100 px-3 py-1.5 rounded-md transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="text-sm text-slate-300 hover:text-white transition-colors py-1"
                >
                  Criar conta
                </Link>
                <button
                  onClick={() => { signIn("keycloak"); setOpen(false) }}
                  className="w-full text-sm bg-blue-500 hover:bg-blue-400 text-white font-medium px-4 py-2 rounded-md transition-colors"
                >
                  Entrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
