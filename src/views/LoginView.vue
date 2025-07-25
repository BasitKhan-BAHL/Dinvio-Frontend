<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogin = (e) => {
  e.preventDefault()
  router.push('/home')
}
</script>

<template>
  <section class="w-full min-h-screen bg-gradient-to-r from-[#5049e7] to-[#8690f8] flex flex-col lg:flex-row">
    <!-- Left Section -->
    <div class="w-full lg:w-[50%]">
      <div class="w-full h-full flex flex-col justify-center px-6 lg:px-28 lg:pr-10 py-10 lg:py-0">
        <div class="relative lg:-top-8">
          <div class="flex flex-row items-center justify-center lg:justify-start relative lg:-left-4">
            <img src="@/assets/icons/dinvio.png" alt="Dinvio logo" width="70" height="70" />
            <p class="font-mono text-4xl sm:text-5xl text-white font-semibold ml-2">Dinvio</p>
          </div>

          <div class="mt-12 text-center lg:text-left">
            <p class="text-4xl sm:text-5xl font-bold text-white font-primary">Hey, Hello!</p>
            <p class="mt-6 text-white font-primary font-medium text-base sm:text-lg">
              Welcome to Dinvio – The Smarter Way to Manage Your Café
            </p>
            <p class="mt-8 text-gray-200 font-primary font-medium text-sm sm:text-lg lg:w-[90%] mx-auto lg:mx-0">
              Simplify your daily operations, streamline orders, and deliver a flawless dining experience — all from one powerful platform.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Section -->
    <div class="w-full lg:w-[50%] flex items-end justify-center mt-10 lg:mt-0">
      <div class="w-[90%] sm:w-[70%] md:w-[55%] h-auto lg:h-[88%] bg-white rounded-t-4xl p-6 sm:p-10">

        <div class="flex flex-col items-center justify-start h-full">
          <div class="flex flex-col items-center justify-center w-full text-center">
            <p class="font-primary text-2xl sm:text-3xl text-black font-semibold mt-2">Welcome Back!</p>
            <p class="font-primary text-sm sm:text-base text-gray-500 font-medium mt-2">
              Your café, your control <strong>–</strong> ready to take today’s orders?
            </p>
          </div>

          <div class="w-full mt-8">
            <form @submit="handleLogin">
              <input type="text" placeholder="Username"
                class="w-full h-12 px-4 mt-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200 text-base" />
              <input type="password" placeholder="Password"
                class="w-full h-12 px-4 mt-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200 text-base" />

              <div class="my-4 w-full flex items-center justify-center">
                <p class="text-sm font-medium text-blue-600 hover:underline hover:font-semibold hover:cursor-pointer">
                  Forgot password?
                </p>
              </div>

              <button type="submit"
                class="w-full h-12 mt-2 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition duration-300 hover:cursor-pointer">
                Login
              </button>
            </form>
          </div>

          <div class="flex items-center justify-center w-full mt-8">
            <div class="border border-gray-300 w-[30%] mr-4"></div>
            <p class="text-gray-500">OR</p>
            <div class="border border-gray-300 w-[30%] ml-4"></div>
          </div>

          <div class="mt-6 w-full flex flex-col sm:flex-row items-center justify-between gap-4 px-0 sm:px-12">
            <button type="button"
              class="w-full h-12 flex flex-row items-center justify-center bg-slate-200 text-blue-500 font-semibold rounded-full hover:bg-slate-300 transition duration-300 hover:cursor-pointer">
              <img src="@/assets/icons/google.png" alt="Google Icon" width="18" height="18" class="inline-block mr-2" />
              Google
            </button>
            <button type="button"
              class="w-full h-12 flex flex-row items-center justify-center bg-slate-200 text-blue-500 font-semibold rounded-full hover:bg-slate-300 transition duration-300 hover:cursor-pointer">
              <img src="@/assets/icons/facebook.png" alt="Facebook Icon" width="18" height="18" class="inline-block mr-2" />
              Facebook
            </button>
          </div>

          <div class="mt-10 w-full flex flex-col items-center justify-center">
            <p class="text-sm text-gray-500">
              Don't have an account?
              <a href="#" class="text-blue-600 hover:underline hover:font-semibold">Sign up</a>
            </p>
          </div>

        </div>

      </div>
    </div>
  </section>
</template>
