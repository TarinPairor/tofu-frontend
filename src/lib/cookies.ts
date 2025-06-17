interface UserCookie {
  id: number
  username: string
}

export const cookies = {
  setUser(user: UserCookie) {
    document.cookie = `user=${JSON.stringify(user)}; path=/; max-age=2592000` // 30 days
  },

  getUser(): UserCookie | null {
    const userCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('user='))
    
    if (!userCookie) return null
    
    try {
      return JSON.parse(userCookie.split('=')[1])
    } catch {
      return null
    }
  },

  removeUser() {
    document.cookie = 'user=; path=/; max-age=0'
  }
} 