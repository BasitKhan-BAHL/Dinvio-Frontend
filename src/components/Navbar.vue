<script>
export default {
  name: 'AppNavbar',
}
</script>

<template>
  <nav class="bg-white h-18 shadow-md shadow-slate-300 flex items-center justify-between px-12">
    <div class="flex items-center">
      <img src="@/assets/logo.png" alt="Logo" class="h-8 w-8 mr-2" />
      <span class="text-xl font-bold">Dinvio</span>
    </div>

    <div class="flex items-center space-x-5">
      <router-link to="#" class="text-gray-700 hover:text-blue-500">View Orders</router-link>

      <button class="w-22 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
        <router-link to="/" class="text-gray-700 hover:text-blue-500">Logout</router-link>
      </button>
    </div>
  </nav>
</template>
