import { auth } from "@/lib/auth"
import { authApi } from "@/lib/api"
import { Post } from "@/types"
import ReviewActions from "./ReviewActions"

async function getPendingPosts(token: string): Promise<Post[]> {
  try {
    const { data } = await authApi(token).get("/posts/pending")
    return data as Post[]
  } catch {
    return []
  }
}

export default async function ReviewPage() {
  const session = await auth()
  const posts = await getPendingPosts(session?.accessToken as string)

  return (
    <div>
      <div className="mb-8 pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">Revisão</h1>
        <p className="text-slate-500 mt-1 text-sm">Posts aguardando aprovação</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500 font-medium">Nenhum post aguardando revisão.</p>
          <p className="text-slate-400 text-sm mt-1">Tudo em ordem!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl border border-amber-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-bold text-slate-900">{post.title}</h2>
                <span className="text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-full ml-3 shrink-0">
                  Em revisão
                </span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-5">{post.content}</p>
              <ReviewActions postId={post.id} token={session?.accessToken as string} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
