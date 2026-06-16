import { auth } from "@/lib/auth"
import { authApi } from "@/lib/api"
import { Post } from "@/types"
import { notFound } from "next/navigation"
import EditForm from "./EditForm"

async function getPost(id: string, token: string): Promise<Post | null> {
  try {
    const { data } = await authApi(token).get(`/posts/${id}`)
    return data
  } catch {
    return null
  }
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  const post = await getPost(id, session?.accessToken as string)

  if (!post) return notFound()

  return (
    <EditForm
      id={id}
      initialTitle={post.title}
      initialContent={post.content}
      token={session?.accessToken as string}
    />
  )
}
