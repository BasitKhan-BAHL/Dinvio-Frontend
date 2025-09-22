<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { useMenuStore } from '@/stores/menuStore'
import { useCategoryStore } from '@/stores/categoryStore'

import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import ReceiptTemplate from '@/components/ReceiptTemplate.vue'
import html2pdf from 'html2pdf.js'

const menuStore = useMenuStore()
const categoryStore = useCategoryStore()

const activeName = ref('all')
const selectedItems = ref([])
const searchQuery = ref('')
const currentTime = ref(new Date())
const showReceiptModal = ref(false)
const receiptNumber = ref('')
const timeInterval = ref(null)

onMounted(async () => {
  // Start clock
  timeInterval.value = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)

  // Fetch categories and menu items from backend
  await Promise.all([
    categoryStore.fetchCategories(),
    menuStore.fetchMenu()
  ])

  // Debug logging
  console.log('Categories loaded:', categoryStore.categories)
  console.log('Menu items loaded:', menuStore.menuItems)
  console.log('Dynamic categories:', dynamicCategories.value)

  prepareMenuData()
})

onUnmounted(() => {
  if (timeInterval.value) clearInterval(timeInterval.value)
})

// This will store the menu categorized dynamically
const menu = reactive({
  all: []
})

// Counts for each category
const counts = reactive({
  all: []
})

// Dynamic categories from API
const dynamicCategories = computed(() => {
  return categoryStore.categories.map(category => ({
    id: category.categoryId,
    name: category.name,
    icon: category.icon,
    description: category.description,
    key: category.name.toLowerCase().replace(/\s+/g, '_')
  }))
})

function prepareMenuData() {
  console.log('Preparing menu data...')
  console.log('Dynamic categories:', dynamicCategories.value)
  console.log('Menu items:', menuStore.menuItems)

  // Clear existing dynamic menu categories
  dynamicCategories.value.forEach(category => {
    menu[category.key] = []
    counts[category.key] = []
  })

  // Group menu items into dynamic categories using categoryId
  dynamicCategories.value.forEach(category => {
    const itemsInCategory = menuStore.menuItems.filter((item) =>
      item.categoryId === category.id
    )
    console.log(`Category ${category.name} (${category.id}):`, itemsInCategory)
    menu[category.key] = itemsInCategory
  })

  // Populate "all" with originalTab info
  menu.all = []
  dynamicCategories.value.forEach(category => {
    menu.all.push(...menu[category.key].map((item) => ({
      ...item,
      originalTab: category.key
    })))
  })

  // Init counts array lengths
  Object.keys(menu).forEach((key) => {
    counts[key] = Array(menu[key].length).fill(0)
  })

  console.log('Final menu object:', menu)
  console.log('Counts object:', counts)
}

// Watch for changes in categories or menu items and update the menu
watch(
  () => [categoryStore.categories, menuStore.menuItems],
  () => {
    if (categoryStore.categories.length > 0 && menuStore.menuItems.length > 0) {
      console.log('Data changed, re-preparing menu...')
      prepareMenuData()
    }
  },
  { deep: true }
)

const filteredItems = computed(() => {
  const currentMenu = menu[activeName.value] || []
  console.log(`Filtered items for ${activeName.value}:`, currentMenu)
  if (!searchQuery.value.trim()) return currentMenu

  const query = searchQuery.value.toLowerCase()
  const filtered = currentMenu.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      (categoryStore.getCategoryById(item.categoryId)?.name || '').toLowerCase().includes(query),
  )
  console.log('Filtered results:', filtered)
  return filtered
})

function handleClick(tab) {
  activeName.value = tab
  searchQuery.value = ''
}

function addItem(tab, idx) {
  counts[tab][idx]++
  updateSelectedItems()
}

function removeItem(tab, idx) {
  if (counts[tab][idx] > 0) {
    counts[tab][idx]--
    updateSelectedItems()
  }
}

function removeItemCompletely(tab, idx) {
  counts[tab][idx] = 0
  updateSelectedItems()
}

function updateSelectedItems() {
  selectedItems.value = []
  Object.keys(counts).forEach((tabKey) => {
    counts[tabKey].forEach((count, idx) => {
      if (count > 0) {
        const item = menu[tabKey][idx]
        if (item) {
          selectedItems.value.push({
            ...item,
            tab: tabKey,
            idx,
            count,
          })
        }
      }
    })
  })
}

const totalPrice = computed(() =>
  selectedItems.value.reduce((total, item) => total + item.price * item.count, 0),
)

function generateReceiptNumber() {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `RCP-${timestamp}-${random}`
}

function placeOrder() {
  if (selectedItems.value.length === 0) {
    alert('Please add items to your order first!')
    return
  }
  receiptNumber.value = generateReceiptNumber()
  showReceiptModal.value = true
}

function closeReceiptModal() {
  showReceiptModal.value = false
}

function printReceipt() {
  const receiptElement = document.getElementById('receipt-content')
  if (receiptElement) {
    const opt = {
      margin: 0,
      filename: `receipt-${receiptNumber.value}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }
    html2pdf().set(opt).from(receiptElement).save()
  }
}

function clearAllItems() {
  Object.keys(counts).forEach((tabKey) => {
    counts[tabKey].forEach((_, idx) => (counts[tabKey][idx] = 0))
  })
  updateSelectedItems()
}

// Dynamic tabs based on categories from API
const tabs = computed(() => {
  const baseTabs = [
    { key: 'all', label: 'All Items', icon: '🍽️', color: 'from-purple-400 to-indigo-500' }
  ]

  const categoryTabs = dynamicCategories.value.map((category, index) => {
    const colors = [
      'from-amber-400 to-orange-500',
      'from-pink-400 to-rose-500',
      'from-blue-400 to-indigo-500',
      'from-green-400 to-emerald-500',
      'from-red-400 to-pink-500',
      'from-yellow-400 to-orange-500',
      'from-indigo-400 to-purple-500',
      'from-teal-400 to-blue-500'
    ]

    return {
      key: category.key,
      label: category.name,
      icon: category.icon || '🍽️',
      color: colors[index % colors.length]
    }
  })

  return [...baseTabs, ...categoryTabs]
})
</script>

<template>
  <Navbar />

  <main>
    <section class="px-4 sm:px-6 lg:px-14 pt-10 pb-12">
      <div
        class="flex items-center justify-between mb-4 flex-col sm:flex-row text-center sm:text-left"
      >
        <div>
          <h1 class="font-bold font-primary text-2xl">Welcome User,</h1>
          <p class="mt-2 text-gray-400 text-base font-primary font-semibold">
            Ready to craft amazing experiences, one order at a time ✨
          </p>
        </div>
      </div>

      <div class="w-full min-h-[400px] flex flex-col lg:flex-row gap-4">
        <!-- Tabs Content -->
        <div class="w-full lg:w-[70%] pr-0 lg:pr-4 py-4">
          <!-- Modern Tabs -->
          <div class="mb-6">
            <!-- Tab Headers -->
            <div class="flex bg-white rounded-2xl shadow-lg p-2 border border-gray-100 flex-wrap">
              <div
                v-for="tab in tabs"
                :key="tab.key"
                @click="handleClick(tab.key)"
                class="flex-1 min-w-[100px] relative cursor-pointer transition-all duration-300 ease-in-out"
              >
                <div
                  v-if="activeName === tab.key"
                  class="absolute inset-0 bg-gradient-to-r rounded-xl shadow-md transition-all duration-500 ease-out"
                  :class="tab.color"
                ></div>

                <div class="relative z-10 flex flex-col items-center justify-center py-3 px-2">
                  <span class="text-2xl mb-1">{{ tab.icon }}</span>
                  <span
                    class="text-sm font-semibold transition-colors duration-300"
                    :class="activeName === tab.key ? 'text-white' : 'text-gray-600'"
                  >
                    {{ tab.label }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="mb-6">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search for items, descriptions, or categories..."
                class="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 text-gray-700"
              />
              <div v-if="searchQuery" class="absolute inset-y-0 right-0 pr-4 flex items-center">
                <button
                  @click="searchQuery = ''"
                  class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div v-if="searchQuery" class="mt-2 text-sm text-gray-500">
              <span class="font-medium">{{ filteredItems.length }}</span>
              {{ filteredItems.length === 1 ? 'item' : 'items' }} found
              <span v-if="filteredItems.length === 0" class="text-red-500">
                - Try a different search term</span
              >
            </div>
          </div>

          <!-- Tab Content -->
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <!-- Loading State -->
            <div v-if="menuStore.loading || categoryStore.loading" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p class="mt-2 text-gray-600">Loading menu items...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="menuStore.error || categoryStore.error" class="text-center py-8">
              <p class="text-red-600">Error loading data: {{ menuStore.error || categoryStore.error }}</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="filteredItems.length === 0" class="text-center py-8">
              <p class="text-gray-600">No items found for this category.</p>
              <p class="text-sm text-gray-500 mt-2">Debug: Categories: {{ categoryStore.categories.length }}, Menu Items: {{ menuStore.menuItems.length }}</p>
              <p class="text-sm text-gray-500">Active tab: {{ activeName }}</p>
            </div>

            <!-- Menu Grid -->
            <transition v-else name="fade" mode="out-in">
              <div
                :key="`${activeName}-${searchQuery}`"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <div
                  v-for="(item, idx) in filteredItems"
                  :key="`${item.name}-${idx}`"
                  class="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 flex flex-col overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1"
                >
                  <!-- Category Badge -->
                  <div class="absolute top-2 left-2 z-20">
                    <span
                      class="px-2 py-1 text-xs font-semibold rounded-full bg-white/90 backdrop-blur-sm text-gray-600 shadow-sm"
                    >
                      {{ categoryStore.getCategoryById(item.categoryId)?.name || 'Category' }}
                    </span>
                  </div>

                  <!-- Card Header with Gradient -->
                  <div
                    class="h-28 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center group-hover:from-gray-100 group-hover:via-gray-200 group-hover:to-gray-300 transition-all duration-500 relative overflow-hidden"
                  >
                    <!-- Animated background pattern -->
                    <div
                      class="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                    >
                      <div
                        class="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full -translate-x-8 -translate-y-8"
                      ></div>
                      <div
                        class="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-full translate-x-6 translate-y-6"
                      ></div>
                    </div>
                    <img
                      :src="item.img"
                      :alt="item.name"
                      class="h-16 object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <!-- Card Content -->
                  <div class="p-4 flex-1 flex flex-col">
                    <div class="flex items-start justify-between mb-2">
                      <h3
                        class="text-sm font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300 line-clamp-2"
                      >
                        {{ item.name }}
                      </h3>
                      <span class="text-sm font-bold text-green-600 ml-2"
                        >${{ item.price.toFixed(2) }}</span
                      >
                    </div>

                    <p class="text-gray-600 text-xs mb-3 flex-1 line-clamp-2">
                      {{ item.description }}
                    </p>

                    <!-- Quantity Controls -->
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-1">
                        <button
                          @click="removeItem(activeName, idx)"
                          class="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110 text-xs"
                          :class="{
                            'opacity-50 cursor-not-allowed': counts[activeName][idx] === 0,
                          }"
                          :disabled="counts[activeName][idx] === 0"
                        >
                          <span class="text-xs font-bold">−</span>
                        </button>

                        <span class="text-sm font-bold text-gray-700 min-w-[1.5rem] text-center">{{
                          counts[activeName][idx]
                        }}</span>

                        <button
                          @click="addItem(activeName, idx)"
                          class="w-6 h-6 rounded-full bg-green-100 hover:bg-green-200 text-green-600 flex items-center justify-center transition-all duration-300 hover:scale-110 text-xs"
                        >
                          <span class="text-xs font-bold">+</span>
                        </button>
                      </div>

                      <button
                        @click="addItem(activeName, idx)"
                        class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Sidebar / Preview Panel -->
        <div class="w-full lg:w-[30%] p-0 lg:p-4">
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-full">
            <div class="flex items-center mb-6">
              <div class="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
              <p class="text-gray-700 text-lg font-semibold">Your Order</p>
            </div>

            <!-- Active Tab Info -->
            <div
              class="bg-gradient-to-r rounded-xl p-4 mb-6"
              :class="tabs.find((t) => t.key === activeName)?.color"
            >
              <div class="flex items-center">
                <span class="text-2xl mr-3">{{
                  tabs.find((t) => t.key === activeName)?.icon
                }}</span>
                <div>
                  <p class="text-white font-semibold">
                    {{ tabs.find((t) => t.key === activeName)?.label }}
                  </p>
                  <p class="text-white/80 text-sm">{{ filteredItems.length }} items available</p>
                </div>
              </div>
            </div>

            <!-- Selected Items -->
            <div class="space-y-4 mb-6">
              <div v-if="selectedItems.length > 0" class="flex justify-end mb-2">
                <button
                  @click="clearAllItems"
                  class="flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm"
                  title="Remove all items"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Remove All
                </button>
              </div>
              <h3 class="text-gray-700 font-semibold text-sm uppercase tracking-wide">
                Selected Items
              </h3>

              <div v-if="selectedItems.length === 0" class="text-center py-8">
                <div class="text-gray-400 text-4xl mb-2">🛒</div>
                <p class="text-gray-500 text-sm">No items selected yet</p>
                <p class="text-gray-400 text-xs mt-1">Add items from the menu to see them here</p>
              </div>

              <div v-else class="space-y-3 max-h-64 overflow-y-auto">
                <div
                  v-for="item in selectedItems"
                  :key="`${item.tab}-${item.idx}`"
                  class="bg-gray-50 rounded-xl p-3 border border-gray-200 hover:border-gray-300 transition-all duration-300"
                >
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-semibold text-gray-800 text-sm">{{ item.name }}</h4>
                    <span class="text-green-600 font-bold text-sm"
                      >${{ (item.price * item.count).toFixed(2) }}</span
                    >
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <button
                        @click="removeItem(item.tab, item.idx)"
                        class="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-all duration-300 text-xs"
                      >
                        −
                      </button>

                      <span class="text-sm font-bold text-gray-700 min-w-[1.5rem] text-center">{{
                        item.count
                      }}</span>

                      <button
                        @click="addItem(item.tab, item.idx)"
                        class="w-6 h-6 rounded-full bg-green-100 hover:bg-green-200 text-green-600 flex items-center justify-center transition-all duration-300 text-xs"
                      >
                        +
                      </button>
                    </div>

                    <button
                      @click="removeItemCompletely(item.tab, item.idx)"
                      class="text-red-500 hover:text-red-700 text-xs font-medium transition-colors duration-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Summary -->
            <div v-if="selectedItems.length > 0" class="border-t border-gray-200 pt-4">
              <div class="flex justify-between items-center mb-4">
                <span class="text-gray-700 font-semibold">Total:</span>
                <span class="text-2xl font-bold text-green-600">${{ totalPrice.toFixed(2) }}</span>
              </div>

              <button
                @click="placeOrder"
                class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Receipt Modal -->
    <div
      v-if="showReceiptModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-800">Order Receipt</h2>
          <button
            @click="closeReceiptModal"
            class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Receipt Content -->
        <div class="p-6">
          <div id="receipt-content">
            <ReceiptTemplate :order-items="selectedItems" :receipt-number="receiptNumber" />
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            @click="closeReceiptModal"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            Close
          </button>
          <button
            @click="printReceipt"
            class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  </main>

  <Footer />
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Smooth animations for card hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Enhanced button animations */
button:active {
  transform: scale(0.95);
}

/* Line clamp for text truncation */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
