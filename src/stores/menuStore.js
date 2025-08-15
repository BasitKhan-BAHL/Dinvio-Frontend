import { defineStore } from 'pinia'
import axios from 'axios'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menuItems: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchMenu() {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('token') // from login
        const res = await axios.get('http://localhost:8050/menu/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.data.success) {
          this.menuItems = res.data.data
        } else {
          this.error = res.data.message || 'Failed to fetch menu'
        }
      } catch (err) {
        this.error = err.message || 'Something went wrong'
      } finally {
        this.loading = false
      }
    },
  },
})
