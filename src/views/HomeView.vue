<script setup>
import { ref, reactive } from 'vue'

const activeName = ref('first')
const handleClick = (tab, event) => {
  console.log(tab, event)
}

const dinvioIcon = new URL('@/assets/images/burger.png', import.meta.url).href

const menu = {
  first: [
    { name: 'Espresso', img: dinvioIcon },
    { name: 'Latte', img: dinvioIcon },
    { name: 'Cappuccino', img: dinvioIcon },
    { name: 'Hot Chocolate', img: dinvioIcon },
    { name: 'Iced Coffee', img: dinvioIcon },
  ],
  second: [
    { name: 'Chocolate Croissant', img: dinvioIcon },
    { name: 'Blueberry Muffin', img: dinvioIcon },
    { name: 'Almond Danish', img: dinvioIcon },
    { name: 'Cinnamon Roll', img: dinvioIcon },
    { name: 'Banana Bread', img: dinvioIcon },
  ],
  third: [
    { name: 'Grilled Panini', img: dinvioIcon },
    { name: 'Chicken Caesar Wrap', img: dinvioIcon },
    { name: 'Veggie Bowl', img: dinvioIcon },
    { name: 'Club Sandwich', img: dinvioIcon },
    { name: 'Soup of the Day', img: dinvioIcon },
  ],
  fourth: [
    { name: 'Extra Shot', img: dinvioIcon },
    { name: 'Whipped Cream', img: dinvioIcon },
    { name: 'Almond Milk', img: dinvioIcon },
    { name: 'Flavor Syrup', img: dinvioIcon },
    { name: 'Protein Boost', img: dinvioIcon },
  ],
}

const counts = reactive({
  first: Array(menu.first.length).fill(0),
  second: Array(menu.second.length).fill(0),
  third: Array(menu.third.length).fill(0),
  fourth: Array(menu.fourth.length).fill(0),
})

function addItem(tab, idx) {
  counts[tab][idx]++
}
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
          Here’s what’s happening in your café today.
        </p>
      </div>

      <div class="mt-8 w-full min-h-[400px] flex flex-row">
        <!-- Tabs Content -->
        <div class="w-[70%] pr-4 py-4">
          <!-- <el-tabs v-model="activeName" type="card" class="demo-tabs custom-tabs" @tab-click="handleClick">
            <el-tab-pane label="Beverages" name="first">
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div v-for="(item, idx) in menu.first" :key="item.name" class="bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
                  <div class="h-32 bg-gray-100 flex items-center justify-center">
                    <img :src="item.img" alt="item.name" class="h-20 object-contain" />
                  </div>
                  <div class="p-4 flex-1 flex items-center justify-center">
                    <span class="text-lg font-semibold text-gray-800">{{ item.name }}</span>
                  </div>
                  <div class="flex items-center justify-between px-4 py-2 bg-gray-50 border-t">
                    <button @click="addItem('first', idx)" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">Add</button>
                    <span class="text-gray-700 font-bold">{{ counts.first[idx] }}</span>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="Pastries" name="second">
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div v-for="(item, idx) in menu.second" :key="item.name" class="bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
                  <div class="h-32 bg-gray-100 flex items-center justify-center">
                    <img :src="item.img" alt="item.name" class="h-20 object-contain" />
                  </div>
                  <div class="p-4 flex-1 flex items-center justify-center">
                    <span class="text-lg font-semibold text-gray-800">{{ item.name }}</span>
                  </div>
                  <div class="flex items-center justify-between px-4 py-2 bg-gray-50 border-t">
                    <button @click="addItem('second', idx)" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">Add</button>
                    <span class="text-gray-700 font-bold">{{ counts.second[idx] }}</span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Meals" name="third">
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div v-for="(item, idx) in menu.third" :key="item.name" class="bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
                  <div class="h-32 bg-gray-100 flex items-center justify-center">
                    <img :src="item.img" alt="item.name" class="h-20 object-contain" />
                  </div>
                  <div class="p-4 flex-1 flex items-center justify-center">
                    <span class="text-lg font-semibold text-gray-800">{{ item.name }}</span>
                  </div>
                  <div class="flex items-center justify-between px-4 py-2 bg-gray-50 border-t">
                    <button @click="addItem('third', idx)" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">Add</button>
                    <span class="text-gray-700 font-bold">{{ counts.third[idx] }}</span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Add-ons" name="fourth">
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div v-for="(item, idx) in menu.fourth" :key="item.name" class="bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
                  <div class="h-32 bg-gray-100 flex items-center justify-center">
                    <img :src="item.img" alt="item.name" class="h-20 object-contain" />
                  </div>
                  <div class="p-4 flex-1 flex items-center justify-center">
                    <span class="text-lg font-semibold text-gray-800">{{ item.name }}</span>
                  </div>
                  <div class="flex items-center justify-between px-4 py-2 bg-gray-50 border-t">
                    <button @click="addItem('fourth', idx)" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">Add</button>
                    <span class="text-gray-700 font-bold">{{ counts.fourth[idx] }}</span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs> -->

          <div
            class="w-full h-16 bg-gray-200 shadow-md rounded-lg flex items-center justify-center"
          >
            <p class="text-gray-500 text-lg">Tabs content will be displayed here.</p>
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
::v-deep(.custom-tabs .el-tabs__item.is-active) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 0.5rem;
  background-color: white;
}
</style>
