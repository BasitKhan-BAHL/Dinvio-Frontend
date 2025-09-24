import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
  }),
  getters: {
    username: (state) => state.user?.username || null,
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(username, password) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.post('http://localhost:8050/auth/login', {
          username,
          password,
        })

        if (res.data.success) {
          this.user = res.data.data
          this.token = res.data.data.token
          localStorage.setItem('token', this.token)
          localStorage.setItem('user', JSON.stringify(this.user))
        } else {
          this.error = res.data.message
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Something went wrong'
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    initializeAuth() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
      }
    },
  },
})
