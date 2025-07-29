<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import ReceiptTemplate from '@/components/ReceiptTemplate.vue'
import html2pdf from 'html2pdf.js'

const activeName = ref('all')
const selectedItems = ref([])
const searchQuery = ref('')
const currentTime = ref(new Date())
const showReceiptModal = ref(false)
const receiptNumber = ref('')

const timeInterval = ref(null)

onMounted(() => {
  timeInterval.value = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timeInterval.value) {
    clearInterval(timeInterval.value)
  }
})

const handleClick = (tab) => {
  activeName.value = tab
  searchQuery.value = '' // Clear search when switching tabs
}

const dinvioIcon = new URL('@/assets/images/burger.png', import.meta.url).href

const menu = {
  all: [], // Will be populated with all items
  first: [
    {
      name: 'Espresso',
      img: dinvioIcon,
      price: 3.5,
      description: 'Rich and bold Italian coffee',
      category: 'Beverages',
    },
    {
      name: 'Latte',
      img: dinvioIcon,
      price: 4.2,
      description: 'Smooth espresso with steamed milk',
      category: 'Beverages',
    },
    {
      name: 'Cappuccino',
      img: dinvioIcon,
      price: 4.0,
      description: 'Perfect balance of espresso and foam',
      category: 'Beverages',
    },
    {
      name: 'Hot Chocolate',
      img: dinvioIcon,
      price: 3.8,
      description: 'Rich and creamy chocolate drink',
      category: 'Beverages',
    },
    {
      name: 'Iced Coffee',
      img: dinvioIcon,
      price: 4.5,
      description: 'Refreshing cold brew coffee',
      category: 'Beverages',
    },
  ],
  second: [
    {
      name: 'Chocolate Croissant',
      img: dinvioIcon,
      price: 3.2,
      description: 'Buttery pastry with chocolate',
      category: 'Pastries',
    },
    {
      name: 'Blueberry Muffin',
      img: dinvioIcon,
      price: 2.8,
      description: 'Fresh blueberries in soft muffin',
      category: 'Pastries',
    },
    {
      name: 'Almond Danish',
      img: dinvioIcon,
      price: 3.5,
      description: 'Flaky pastry with almond filling',
      category: 'Pastries',
    },
    {
      name: 'Cinnamon Roll',
      img: dinvioIcon,
      price: 3.0,
      description: 'Sweet cinnamon swirl pastry',
      category: 'Pastries',
    },
    {
      name: 'Banana Bread',
      img: dinvioIcon,
      price: 2.5,
      description: 'Moist and flavorful banana bread',
      category: 'Pastries',
    },
  ],
  third: [
    {
      name: 'Grilled Panini',
      img: dinvioIcon,
      price: 8.5,
      description: 'Pressed sandwich with fresh ingredients',
      category: 'Meals',
    },
    {
      name: 'Chicken Caesar Wrap',
      img: dinvioIcon,
      price: 9.2,
      description: 'Grilled chicken with caesar dressing',
      category: 'Meals',
    },
    {
      name: 'Veggie Bowl',
      img: dinvioIcon,
      price: 7.8,
      description: 'Fresh vegetables with quinoa',
      category: 'Meals',
    },
    {
      name: 'Club Sandwich',
      img: dinvioIcon,
      price: 10.5,
      description: 'Triple-decker with turkey and bacon',
      category: 'Meals',
    },
    {
      name: 'Soup of the Day',
      img: dinvioIcon,
      price: 6.2,
      description: 'Homemade soup with bread',
      category: 'Meals',
    },
  ],
  fourth: [
    {
      name: 'Extra Shot',
      img: dinvioIcon,
      price: 1.0,
      description: 'Additional espresso shot',
      category: 'Add-ons',
    },
    {
      name: 'Whipped Cream',
      img: dinvioIcon,
      price: 0.5,
      description: 'Light and fluffy cream topping',
      category: 'Add-ons',
    },
    {
      name: 'Almond Milk',
      img: dinvioIcon,
      price: 0.75,
      description: 'Dairy-free milk alternative',
      category: 'Add-ons',
    },
    {
      name: 'Flavor Syrup',
      img: dinvioIcon,
      price: 0.6,
      description: 'Vanilla, caramel, or hazelnut',
      category: 'Add-ons',
    },
    {
      name: 'Protein Boost',
      img: dinvioIcon,
      price: 1.5,
      description: 'Protein powder for your drink',
      category: 'Add-ons',
    },
  ],
}

// Populate all items
menu.all = [
  ...menu.first.map((item) => ({ ...item, originalTab: 'first' })),
  ...menu.second.map((item) => ({ ...item, originalTab: 'second' })),
  ...menu.third.map((item) => ({ ...item, originalTab: 'third' })),
  ...menu.fourth.map((item) => ({ ...item, originalTab: 'fourth' })),
]

const counts = reactive({
  all: Array(menu.all.length).fill(0),
  first: Array(menu.first.length).fill(0),
  second: Array(menu.second.length).fill(0),
  third: Array(menu.third.length).fill(0),
  fourth: Array(menu.fourth.length).fill(0),
})

// Computed property for filtered items
const filteredItems = computed(() => {
  const currentMenu = menu[activeName.value]
  if (!searchQuery.value.trim()) {
    return currentMenu
  }

  const query = searchQuery.value.toLowerCase()
  return currentMenu.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query),
  )
})

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
        selectedItems.value.push({
          ...item,
          tab: tabKey,
          idx: idx,
          count: count,
        })
      }
    })
  })
}

const totalPrice = computed(() => {
  return selectedItems.value.reduce((total, item) => {
    return total + item.price * item.count
  }, 0)
})

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

const tabs = [
  { key: 'all', label: 'All Items', icon: '🍽️', color: 'from-purple-400 to-indigo-500' },
  { key: 'first', label: 'Beverages', icon: '☕', color: 'from-amber-400 to-orange-500' },
  { key: 'second', label: 'Pastries', icon: '🥐', color: 'from-pink-400 to-rose-500' },
  { key: 'third', label: 'Meals', icon: '🍽️', color: 'from-blue-400 to-indigo-500' },
  { key: 'fourth', label: 'Add-ons', icon: '✨', color: 'from-green-400 to-emerald-500' },
]
</script>

<template>
  <main>
    <nav class="bg-white h-18 shadow-md shadow-slate-300 flex items-center justify-between px-12">
      <div class="flex items-center">
        <img src="@/assets/logo.png" alt="Logo" class="h-8 w-8 mr-2" />
        <span class="text-xl font-bold">Dinvio</span>
      </div>

      <div class="flex items-center space-x-4">
        <router-link to="#" class="text-gray-700 hover:text-blue-500">View Orders</router-link>
        <router-link to="/" class="text-gray-700 hover:text-blue-500">Logout</router-link>
      </div>
    </nav>

    <section class="px-14 pt-10 pb-12">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="font-bold font-primary text-2xl">Welcome User,</h1>
          <p class="mt-2 text-gray-400 text-base font-primary font-semibold">
            Ready to craft amazing experiences, one order at a time ✨
          </p>
        </div>

        <!-- Beautiful Date & Time Display -->
        <!-- <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-4 shadow-lg text-white">
          <div class="text-center">
            <div class="text-2xl font-bold mb-1">
              {{ currentTime.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }) }}
            </div>
            <div class="text-sm opacity-90">
              {{ currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
            </div>
          </div>
        </div> -->
      </div>

      <div class="w-full min-h-[400px] flex flex-row">
        <!-- Tabs Content -->
        <div class="w-[70%] pr-4 py-4">
          <!-- Modern Tabs -->
          <div class="mb-6">
            <!-- Tab Headers -->
            <div class="flex bg-white rounded-2xl shadow-lg p-2 border border-gray-100">
              <div
                v-for="tab in tabs"
                :key="tab.key"
                @click="handleClick(tab.key)"
                class="flex-1 relative cursor-pointer transition-all duration-300 ease-in-out"
              >
                <!-- Active Tab Background -->
                <div
                  v-if="activeName === tab.key"
                  class="absolute inset-0 bg-gradient-to-r rounded-xl shadow-md transition-all duration-500 ease-out"
                  :class="tab.color"
                ></div>

                <!-- Tab Content -->
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
                  ></path>
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
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Search Results Info -->
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
            <transition name="fade" mode="out-in">
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
                      {{ item.category }}
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
        <div class="w-[30%] p-4">
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
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
