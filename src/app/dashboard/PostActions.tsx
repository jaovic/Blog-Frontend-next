"use client"

import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api"

interface Props {
  postId: number
  status: string
  token: string
}

export default function PostActions({ postId, status, token }: Props) {
  const router = useRouter()

  async function submit() {
    await authApi(token).post(`/posts/${postId}/submit`)
    router.refresh()
  }

  if (status !== "draft") return null

  return (
    <button
      onClick={submit}
      className="text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg transition-colors"
    >
      Submeter →
    </button>
  )
}
