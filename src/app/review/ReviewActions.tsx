"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api"
import ConfirmModal from "@/components/ui/ConfirmModal"

type PendingAction = "approve" | "reject" | null

export default function ReviewActions({ postId, token }: { postId: number; token: string }) {
  const router = useRouter()
  const [pending, setPending] = useState<PendingAction>(null)
  const [loading, setLoading] = useState(false)

  async function confirm() {
    if (!pending) return
    setLoading(true)
    try {
      await authApi(token).post(`/posts/${postId}/${pending}`)
      setPending(null)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => setPending("approve")}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          ✓ Aprovar
        </button>
        <button
          onClick={() => setPending("reject")}
          className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          ✕ Rejeitar
        </button>
      </div>

      {pending === "approve" && (
        <ConfirmModal
          title="Aprovar post?"
          message="O post vai ser publicado e ficará visível para todos os leitores."
          confirmLabel={loading ? "A aprovar…" : "Sim, publicar"}
          confirmClass="bg-emerald-600 hover:bg-emerald-700 text-white"
          onConfirm={confirm}
          onCancel={() => setPending(null)}
        />
      )}

      {pending === "reject" && (
        <ConfirmModal
          title="Rejeitar post?"
          message="O post vai ser devolvido ao autor como rascunho para revisão."
          confirmLabel={loading ? "A rejeitar…" : "Sim, rejeitar"}
          confirmClass="bg-red-600 hover:bg-red-700 text-white"
          onConfirm={confirm}
          onCancel={() => setPending(null)}
        />
      )}
    </>
  )
}
