"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api"
import ConfirmModal from "@/components/ui/ConfirmModal"

interface Props {
  postId: number
  status: string
  token: string
}

export default function PostActions({ postId, status, token }: Props) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  async function confirm() {
    setLoading(true)
    try {
      await authApi(token).post(`/posts/${postId}/submit`)
      setShowModal(false)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  if (status !== "draft") return null

  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setShowModal(true) }}
        className="relative z-10 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg transition-colors"
      >
        Submeter →
      </button>

      {showModal && (
        <ConfirmModal
          title="Submeter para revisão?"
          message="O post vai ser enviado para revisão. Não poderás editá-lo enquanto estiver em revisão."
          confirmLabel={loading ? "A submeter…" : "Sim, submeter"}
          confirmClass="bg-amber-500 hover:bg-amber-600 text-white"
          onConfirm={confirm}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  )
}
