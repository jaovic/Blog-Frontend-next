import Link from "next/link"
import { api } from "@/lib/api"
import { Post } from "@/types"

async function getPosts(): Promise<Post[]> {
  try {
    const { data } = await api.get("/posts")
    return data
  } catch {
    return []
  }
}

export default async function HomePage() {
  const posts = await getPosts()

  return (
    <div>
      <div className="mb-8 pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">Últimos artigos</h1>
        <p className="text-slate-500 mt-1 text-sm">Posts publicados pela comunidade</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-400 text-lg font-medium">Nenhum post publicado ainda.</p>
          <p className="text-slate-400 text-sm mt-1">Faz login para criares o primeiro!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-md transition-all">
              <Link href={`/posts/${post.id}`}>
                <h2 className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
              </Link>
              <p className="text-slate-600 mt-2 text-sm leading-relaxed line-clamp-2">{post.content}</p>
              <div className="mt-4 text-xs font-medium text-slate-400 uppercase tracking-wide">
                {new Date(post.created_at).toLocaleDateString("pt-PT", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
