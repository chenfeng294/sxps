import { create } from 'zustand'

interface User {
  id: string
  username: string
  email?: string
  phone?: string
  role?: {
    id: string
    name: string
  }
}

interface Store {
  token: string | null
  user: User | null
  tenantId: string
  setToken: (token: string | null) => void
  setUser: (user: User | null) => void
  setTenantId: (tenantId: string) => void
  logout: () => void
}

const useStore = create<Store>((set) => ({
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  tenantId: localStorage.getItem('tenantId') || 'default',

  setToken: (token) => {
    set({ token })
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  },

  setUser: (user) => {
    set({ user })
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  },

  setTenantId: (tenantId) => {
    set({ tenantId })
    localStorage.setItem('tenantId', tenantId)
  },

  logout: () => {
    set({ token: null, user: null })
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}))

export default useStore
