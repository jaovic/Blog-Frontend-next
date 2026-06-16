import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { auth } from "@/lib/auth"
import Navbar from "@/components/layout/Navbar"
import Providers from "@/components/layout/Providers"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Blog Platform",
  description: "Plataforma de blog multi-autor",
  icons: { icon: "/favicon.ico" },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <html lang="pt">
      <body className={`${geist.className} min-h-screen bg-gray-50`}>
        <Providers>
          <Navbar session={session} />
          <main className="max-w-4xl mx-auto px-4 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
