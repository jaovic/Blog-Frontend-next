import { api } from "@/lib/api"
import { Post } from "@/types"
import Link from "next/link"
import { notFound } from "next/navigation"

async function getPost(id: string): Promise<Post | null> {
  try {
    const { data } = await api.get(`/posts/${id}`)
    return data
  } catch {
    return null
  }
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getPost(id)

  if (!post) return notFound()

  return (
    <div className="max-w-2xl">
      <Link href="/" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 mb-8">
        ← Voltar aos posts
      </Link>
      <article className="bg-white rounded-xl border border-slate-200 p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">{post.title}</h1>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-8 pb-6 border-b border-slate-100">
          {new Date(post.created_at).toLocaleDateString("pt-PT", {
            day: "numeric", month: "long", year: "numeric"
          })}
        </p>
        <div className="text-slate-700 leading-7 text-base whitespace-pre-wrap">
          {post.content}
        </div>
      </article>
    </div>
  )
}
