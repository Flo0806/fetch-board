declare module '#auth-utils' {
  interface User {
    id: string
    login: string
    name: string | null
    avatar: string
  }

  interface UserSession {
    user: User
  }
}

export {}
