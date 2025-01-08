<!-- ProductImage.vue -->
<template>
    <div class="relative">
      <!-- Loading State -->
      <div
        v-if="loading"
        :class="[className, 'bg-gray-100 flex items-center justify-center']"
      >
        <div class="animate-spin rounded-full h-6 w-6 border-2 border-amber-500 border-t-transparent"></div>
      </div>
  
      <!-- Error State -->
      <div
        v-if="error"
        :class="[className, 'bg-gray-100 flex items-center justify-center']"
      >
        <svg
          class="w-6 h-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
  
      <!-- Image -->
      <img
        v-show="!loading && !error"
        :src="src || '/placeholder-image.jpg'"
        :alt="alt"
        :class="className"
        @error="handleError"
        @load="handleLoad"
      />
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProductImage',
    props: {
      src: {
        type: String,
        default: ''
      },
      alt: {
        type: String,
        default: 'Product image'
      },
      className: {
        type: String,
        default: 'w-16 h-16 object-cover rounded-md'
      }
    },
    data() {
      return {
        loading: true,
        error: false
      }
    },
    methods: {
      handleError() {
        this.error = true
        this.loading = false
      },
      handleLoad() {
        this.loading = false
      }
    },
    watch: {
      src: {
        handler() {
          this.loading = true
          this.error = false
        },
        immediate: true
      }
    }
  }
  </script>