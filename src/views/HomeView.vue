<script setup>
import { ref, reactive, computed } from 'vue'
import { menuData, tabConfig } from '@/assets/menuData.js'

const activeName = ref('all')
const handleClick = (tab, event) => {
  console.log(tab, event)
}

const dinvioIcon = new URL('@/assets/images/burger.png', import.meta.url).href

// Use the imported menu data and tab config
const menu = menuData
const tabs = tabConfig

// Create reactive counts for all menu items
const counts = reactive({})

// Initialize counts for all menu items
Object.keys(menu).forEach(category => {
  counts[category] = Array(menu[category].length).fill(0)
})

function addItem(category, idx) {
  counts[category][idx]++
}

// Computed property to get current menu items based on active tab
const currentMenuItems = computed(() => {
  return menu[activeName.value] || []
})
</script>

<template>
  <main>
    <nav class="bg-white h-18 shadow-md shadow-slate-300 flex items-center justify-between px-4">
      <div class="flex items-center">
        <img src="@/assets/logo.png" alt="Logo" class="h-8 w-8 mr-2" />
        <span class="text-xl font-bold">Dinvio</span>
      </div>

      <div class="flex items-center space-x-4">
        <router-link to="#" class="text-gray-700 hover:text-blue-500">View Orders</router-link>
        <router-link to="/" class="text-gray-700 hover:text-blue-500">Logout</router-link>
      </div>
    </nav>

    <section class="px-14 py-12">
      <div>
        <h1 class="font-bold font-primary text-2xl">Welcome User,</h1>
        <p class="mt-2 text-gray-400 text-base font-primary font-semibold">
          Here's what's happening in your café today.
        </p>
      </div>

      <div class="mt-8 w-full min-h-[400px] flex flex-row">
        <!-- Tabs Content -->
        <div class="w-[70%] pr-4 py-4">
          <!-- Custom Tabs -->
          <div class="custom-tabs">
            <!-- Tab Navigation -->
            <div class="tab-navigation mb-6">
              <div class="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                <button
                  v-for="tab in tabs"
                  :key="tab.key"
                  @click="activeName = tab.key"
                  :class="[
                    'flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ease-in-out',
                    activeName === tab.key
                      ? 'bg-white text-blue-600 shadow-lg shadow-blue-100 transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  ]"
                >
                  <span class="text-lg">{{ tab.icon }}</span>
                  <span>{{ tab.label }}</span>
                </button>
              </div>
            </div>

            <!-- Tab Content -->
            <div class="tab-content">
              <div
                v-show="activeName === activeName"
                class="fade-in"
              >
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  <div
                    v-for="(item, idx) in currentMenuItems"
                    :key="`${activeName}-${item.name}-${idx}`"
                    class="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col overflow-hidden border-0 hover:border-0 relative"
                    style="background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)"
                  >
                    <!-- Card Header with Image -->
                    <div
                      class="relative h-40 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center overflow-hidden"
                    >
                      <div
                        class="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-purple-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      ></div>
                      <img
                        :src="item.img"
                        :alt="item.name"
                        class="h-30 w-30 object-contain transition-transform duration-500 group-hover:scale-110 z-10 relative"
                      />
                      <!-- Decorative elements -->
                      <div
                        class="absolute top-2 right-2 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      ></div>
                      <div
                        class="absolute bottom-2 left-2 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      ></div>
                    </div>

                    <!-- Card Content -->
                    <div class="p-6 flex-1 flex flex-col">
                      <div class="flex-1 flex items-center justify-center mb-4">
                        <h3
                          class="text-lg font-semibold text-gray-800 text-center leading-tight group-hover:text-gray-900 transition-colors duration-300"
                        >
                          {{ item.name }}
                        </h3>
                      </div>
                      
                      <!-- Price and Action Section -->
                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                          <span class="text-sm text-gray-500 font-medium">Quantity:</span>
                          <span
                            class="text-xl font-bold text-gray-800 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
                          >
                            {{ counts[activeName][idx] }}
                          </span>
                        </div>
                        
                        <button
                          @click="addItem(activeName, idx)"
                          class="relative overflow-hidden bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-purple-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl group-hover:shadow-2xl"
                        >
                          <span class="relative z-10">Add</span>
                          <div
                            class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          ></div>
                        </button>
                      </div>
                    </div>

                    <!-- Subtle border effect -->
                    <div
                      class="absolute inset-0 rounded-2xl border border-transparent group-hover:border-blue-200/50 transition-all duration-500 pointer-events-none"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar / Preview Panel -->
        <div class="w-[30%] p-4">
          <p class="text-gray-700 text-lg font-semibold mb-2">Menu Preview</p>
          <p class="text-sm text-gray-500">Click a tab to view items under each category.</p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.custom-tabs {
  @apply w-full;
}

.tab-navigation {
  @apply w-full;
}

.tab-content {
  @apply w-full;
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom scrollbar for tab navigation if needed */
.tab-navigation::-webkit-scrollbar {
  height: 4px;
}

.tab-navigation::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.tab-navigation::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.tab-navigation::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
