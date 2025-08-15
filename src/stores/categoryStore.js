import { defineStore } from 'pinia'
import axios from 'axios'

export const useMenuStore = defineStore('category', {
  state: () => ({
    categories: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchCategory() {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get('http://localhost:8050/category/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.data.success) {
          this.categories = res.data.data
        } else {
          this.error = res.data.message || 'Failed to fetch categories'
        }
      } catch (err) {
        this.error = err.message || 'Something went wrong'
      } finally {
        this.loading = false
      }
    },
  },
})
