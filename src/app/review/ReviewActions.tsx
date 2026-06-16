"use client"

import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api"

export default function ReviewActions({ postId, token }: { postId: number; token: string }) {
  const router = useRouter()

  async function handle(action: "approve" | "reject") {
    await authApi(token).post(`/posts/${postId}/${action}`)
    router.refresh()
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handle("approve")}
        className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        ✓ Aprovar
      </button>
      <button
        onClick={() => handle("reject")}
        className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        ✕ Rejeitar
      </button>
    </div>
  )
}
