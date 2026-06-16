export type PostStatus = "draft" | "pending_review" | "published"

export interface Post {
  id: number
  title: string
  content: string
  author_id: string
  status: PostStatus
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  enabled: boolean
  roles: string[]
}
