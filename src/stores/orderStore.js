import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    loading: false,
    error: null,
  }),

  actions: {
    async placeOrder(order) {
      try {
        const res = await api.post('/orders/place', order)
        if (res.data.success) {
          this.orders.push(res.data.data)
        }
        return res.data
      } catch (err) {
        this.error = err.response?.data?.message || err.message
      }
    },

    async fetchOrders() {
      this.loading = true
      try {
        const res = await api.get('/orders')
        if (res.data.success) {
          this.orders = res.data.data
        }
      } catch (err) {
        this.error = err.response?.data?.message || err.message
      } finally {
        this.loading = false
      }
    },
  },
})
