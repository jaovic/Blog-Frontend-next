import NextAuth from "next-auth"
import Keycloak from "next-auth/providers/keycloak"

function extractRoles(accessToken?: string): string[] {
  if (!accessToken) return []
  try {
    const payload = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64").toString())
    return payload?.realm_access?.roles ?? []
  } catch {
    return []
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.AUTH_KEYCLOAK_ID!,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET!,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER!,
      authorization: {
        params: {
          // força o Keycloak a mostrar sempre o ecrã de login
          prompt: "login",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.roles = extractRoles(account.access_token)
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.roles = token.roles as string[]
      return session
    },
  },
})
