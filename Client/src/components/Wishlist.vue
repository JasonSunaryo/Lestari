<template>
    <div class="container mx-auto p-4">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800">My Wishlist</h1>
        <p class="text-gray-600">
          {{ wishlistProducts.length }} items in your wishlist
        </p>
      </div>
  
      <div v-if="wishlistProducts.length === 0" class="text-center py-12">
        <svg 
          class="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
        <p class="text-gray-600 mb-4">Browse our products and add your favorites to the wishlist!</p>
        <router-link 
          to="/products" 
          class="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all duration-200"
        >
          Browse Products
        </router-link>
      </div>
  
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="product in wishlistProducts" 
          :key="product._id"
          class="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
        >
          <div class="relative">
            <img 
              :src="product.images[0]"
              class="w-full h-80 object-cover"
              alt="Product image"
            >
            <button 
              @click="removeFromWishlist(product._id)"
              class="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200"
            >
              <svg 
                class="w-5 h-5 text-red-500 fill-red-500"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>
  
          <div class="p-4">
            <div class="mb-2">
              <h2 class="text-xl font-bold text-gray-800">{{ product.name }}</h2>
              <span class="text-lg font-bold text-amber-600 block mt-1">
                Rp {{ product.sellingPrice.toLocaleString('id-ID') }}
              </span>
            </div>
            <p class="text-gray-600 mb-4 line-clamp-2">{{ product.description }}</p>
            <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
              <span>Category: {{ product.category }}</span>
              <span>{{ product.stock }} in stock</span>
            </div>
            <div class="flex gap-2">
              <button 
                @click="addToCart(product)"
                class="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                :disabled="product.stock === 0"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
              </button>
              <button 
                @click="showProductDetails(product)"
                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-all duration-200"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Product Detail Modal -->
      <div 
        v-if="selectedProduct" 
        class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        @click.self="selectedProduct = null"
      >
        <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="relative h-80 mb-6">
              <img 
                :src="selectedProduct.images[0]"
                class="w-full h-full object-cover rounded-lg"
                alt="Product image"
              >
            </div>
  
            <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ selectedProduct.name }}</h2>
            <p class="text-gray-600 mb-6">{{ selectedProduct.description }}</p>
  
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-500">Price</p>
                <p class="text-xl font-bold text-amber-600">
                  Rp {{ selectedProduct.sellingPrice.toLocaleString('id-ID') }}
                </p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <p class="text-sm text-gray-500">Availability</p>
                <p class="text-xl font-bold" :class="selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'">
                  {{ selectedProduct.stock > 0 ? `${selectedProduct.stock} in stock` : 'Out of stock' }}
                </p>
              </div>
            </div>
  
            <div class="flex gap-4">
              <button 
                @click="addToCart(selectedProduct)"
                class="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                :disabled="selectedProduct.stock === 0"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {{ selectedProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
              </button>
              <button 
                @click="removeFromWishlist(selectedProduct._id)"
                class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5 text-red-500 fill-red-500" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                Remove from Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Toast Notifications -->
      <div class="fixed bottom-4 right-4 z-50">
        <transition-group name="fade">
          <div 
            v-for="toast in toasts" 
            :key="toast.id"
            class="mb-2 p-4 rounded-lg shadow-lg text-white"
            :class="toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'"
          >
            {{ toast.message }}
          </div>
        </transition-group>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import api from '../../api';
  import { updateCart } from '../eventBus';
  
  export default {
    name: 'WishlistView',
    setup() {
      const products = ref([]);
      const wishlist = ref([]);
      const selectedProduct = ref(null);
      const toasts = ref([]);
      let toastId = 0;
  
      const wishlistProducts = computed(() => {
        return products.value.filter(product => wishlist.value.includes(product._id));
      });
  
      const fetchProducts = async () => {
        try {
          const response = await api.get('/products');
          products.value = response.data;
        } catch (error) {
          showToast('Failed to load products', 'error');
        }
      };
  
      const removeFromWishlist = (productId) => {
        const index = wishlist.value.indexOf(productId);
        if (index !== -1) {
          wishlist.value.splice(index, 1);
          localStorage.setItem('wishlist', JSON.stringify(wishlist.value));
          showToast('Removed from wishlist', 'success');
          selectedProduct.value = null;
        }
      };
  
      const addToCart = (product) => {
        const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = currentCart.find(item => item.productId === product._id);
        
        if (existingItem) {
          if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
            showToast('Added another item to cart', 'success');
          } else {
            showToast(`Maximum stock (${product.stock} items) reached`, 'error');
            return;
          }
        } else {
          currentCart.push({
            productId: product._id,
            name: product.name,
            price: product.sellingPrice,
            quantity: 1,
            stock: product.stock,
            image: product.images[0]
          });
          showToast('Added to cart', 'success');
        }
        
        localStorage.setItem('cart', JSON.stringify(currentCart));
        updateCart(currentCart);
      };
  
      const showProductDetails = (product) => {
        selectedProduct.value = product;
      };
  
      const showToast = (message, type = 'success') => {
        const toast = {
          id: toastId++,
          message,
          type
        };
        toasts.value.push(toast);
        setTimeout(() => {
          const index = toasts.value.findIndex(t => t.id === toast.id);
          if (index !== -1) {
            toasts.value.splice(index, 1);
          }
        }, 3000);
      };
  
      onMounted(async () => {
        await fetchProducts();
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          wishlist.value = JSON.parse(savedWishlist);
        }
      });
  
      return {
        wishlistProducts,
        selectedProduct,
        toasts,
        removeFromWishlist,
        addToCart,
        showProductDetails,
      };
    }
  };
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  </style>