<!-- src/components/Toast.vue -->
<template>
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300',
          'flex items-center justify-between min-w-[200px]',
          getToastClass(toast.type)
        ]"
      >
        <span>{{ toast.message }}</span>
        <button
          @click="removeToast(toast.id)"
          class="ml-4 text-sm hover:opacity-75"
        >
          ×
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { useToast } from '@/composables/useToast';
  
  export default {
    name: 'Toast',
    setup() {
      const { toasts, removeToast } = useToast();
  
      const getToastClass = (type) => {
        switch (type) {
          case 'success':
            return 'bg-green-500 text-white';
          case 'error':
            return 'bg-red-500 text-white';
          case 'warning':
            return 'bg-yellow-500 text-white';
          case 'info':
            return 'bg-blue-500 text-white';
          default:
            return 'bg-gray-500 text-white';
        }
      };
  
      return {
        toasts,
        removeToast,
        getToastClass
      };
    }
  };
  </script>