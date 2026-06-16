import { auth } from "@/lib/auth"
import { authApi } from "@/lib/api"
import { Post } from "@/types"
import Link from "next/link"
import PostActions from "./PostActions"

const STATUS_LABEL: Record<string, string> = {
  draft: "Rascunho",
  pending_review: "Em revisão",
  published: "Publicado",
}

const STATUS_COLOR: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700 border border-slate-300",
  pending_review: "bg-amber-100 text-amber-800 border border-amber-300",
  published: "bg-emerald-100 text-emerald-800 border border-emerald-300",
}

async function getMyPosts(token: string): Promise<Post[]> {
  try {
    const { data } = await authApi(token).get("/posts/mine")
    return data
  } catch {
    return []
  }
}

export default async function DashboardPage() {
  const session = await auth()
  const posts = await getMyPosts(session?.accessToken as string)

  return (
    <div>
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm">Gere os teus posts</p>
        </div>
        <Link
          href="/dashboard/posts/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Novo post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500 font-medium">Ainda não tens posts.</p>
          <Link href="/dashboard/posts/new" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
            Cria o primeiro →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative bg-white rounded-xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
            >
              {/* overlay que torna o card inteiro clicável */}
              <Link href={`/posts/${post.id}`} className="absolute inset-0 rounded-xl" aria-label={post.title} />

              <div className="min-w-0">
                <h2 className="font-semibold text-slate-900 truncate">{post.title}</h2>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  Atualizado em {new Date(post.updated_at).toLocaleDateString("pt-PT")}
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-3 shrink-0">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_COLOR[post.status]}`}>
                  {STATUS_LABEL[post.status]}
                </span>
                {post.status === "draft" && (
                  <Link
                    href={`/dashboard/posts/${post.id}`}
                    className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Editar
                  </Link>
                )}
                <PostActions
                  postId={post.id}
                  status={post.status}
                  token={session?.accessToken as string}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
