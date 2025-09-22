import { defineStore } from 'pinia'
import axios from '@/api/axios'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchCategories() {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get('/category/all')
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

    // Helper method to get category by ID
    getCategoryById(categoryId) {
      return this.categories.find(cat => cat.categoryId === categoryId)
    },

    // Helper method to get category by name
    getCategoryByName(name) {
      return this.categories.find(cat => cat.name === name)
    },
  },
})
