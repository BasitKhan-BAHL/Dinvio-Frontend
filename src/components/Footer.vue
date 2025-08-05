<script>
export default {
  name: 'AppFooter',
}
</script>

<template>
  <footer
    class="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200 py-12 pb-6 mt-auto"
  >
    <div class="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      <div class="flex flex-col">
        <div class="flex items-center gap-3 mb-4">
          <img src="@/assets/logo.png" alt="Dinvio" class="w-8 h-8 brightness-75" />
          <h3 class="text-2xl font-bold text-gray-800 font-primary">Dinvio</h3>
        </div>
        <p class="text-gray-600 leading-relaxed opacity-80 text-sm">
          Empowering businesses with innovative digital solutions and seamless user experiences.
        </p>
      </div>

      <div class="flex flex-col">
        <h4 class="text-lg font-semibold text-gray-800 font-primary mb-4 relative">
          Contact
          <div
            class="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-gray-800 to-transparent rounded"
          ></div>
        </h4>
        <div class="flex flex-col gap-3">
          <p class="flex items-start gap-2 text-gray-600 text-sm leading-relaxed">
            <span class="text-base opacity-70 flex-shrink-0 mt-0.5">📍</span>
            <span>123 Innovation Drive<br />Tech City, TC 12345</span>
          </p>
          <p class="flex items-start gap-2 text-gray-600 text-sm leading-relaxed">
            <span class="text-base opacity-70 flex-shrink-0 mt-0.5">📧</span>
            <span>hello@dinvio.com</span>
          </p>
          <p class="flex items-start gap-2 text-gray-600 text-sm leading-relaxed">
            <span class="text-base opacity-70 flex-shrink-0 mt-0.5">📞</span>
            <span>+1 (555) 123-4567</span>
          </p>
        </div>
      </div>

      <div class="flex flex-col">
        <h4 class="text-lg font-semibold text-gray-800 font-primary mb-4 relative">
          About
          <div
            class="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-gray-800 to-transparent rounded"
          ></div>
        </h4>
        <p class="text-gray-600 leading-relaxed opacity-80 text-sm">
          We're passionate about creating exceptional digital experiences that drive business growth
          and user satisfaction.
        </p>
      </div>
    </div>

    <div class="border-t border-gray-200 pt-6">
      <div class="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6"></div>
      <div
        class="max-w-6xl mx-auto px-8 flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <p class="text-gray-600 text-xs opacity-70">
          © {{ new Date().getFullYear() }} Dinvio. All rights reserved.
        </p>
        <div class="flex items-center gap-2 flex-wrap justify-center">
          <span
            class="text-gray-600 text-xs opacity-70 cursor-pointer hover:opacity-100 transition-opacity duration-200"
            >Privacy Policy</span
          >
          <span class="text-gray-600 text-xs opacity-40">•</span>
          <span
            class="text-gray-600 text-xs opacity-70 cursor-pointer hover:opacity-100 transition-opacity duration-200"
            >Terms of Service</span
          >
          <span class="text-gray-600 text-xs opacity-40">•</span>
          <span
            class="text-gray-600 text-xs opacity-70 cursor-pointer hover:opacity-100 transition-opacity duration-200"
            >Cookie Policy</span
          >
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Only keeping the font-primary utility class */
.font-primary {
  font-family: var(--font-primary);
}
</style>
