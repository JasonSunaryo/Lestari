<template>
  <div id="product-customer" class="container mx-auto p-4">
    <div class="mb-8 flex flex-wrap gap-4">
      <div class="flex-1 min-w-[200px]">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search products..."
          class="w-full px-4 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>
      <select
        v-model="selectedCategory"
        class="px-4 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500"
      >
        <option value="">All Categories</option>
        <option
          v-for="category in categories"
          :key="category"
          :value="category"
        >
          {{ category }}
        </option>
      </select>
      <select
        v-model="sortBy"
        class="px-4 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500"
      >
        <option value="newest">Newest First</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
      </select>
    </div>

  

    <!-- Products Grid -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="product in filteredProducts"
        :key="product._id"
        class="ml-16 bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      >
        <div class="relative">
          <img
            :src="
              product.images[currentImageIndexes[product._id] || 0] ||
              '/placeholder-image.jpg'
            "
            class="w-full h-80 object-cover"
            alt="Product image"
            
          />
          <button
            @click="toggleWishlist(product._id)"
            class="ml-8 absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200 group"
          >
            <svg
              class="w-5 h-5 transition-colors duration-200"
              :class="
                isInWishlist(product._id)
                  ? 'text-red-500 fill-red-500'
                  : 'text-gray-400 group-hover:text-gray-600'
              "
              viewBox="0 0 24 24"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          </button>
         

          <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <button
              v-for="(image, index) in product.images"
              :key="index"
              @click="setCurrentImage(product._id, index)"
              class="w-2 h-2 rounded-full transition-colors duration-200"
              :class="(currentImageIndexes[product._id] || 0) === index ? 'bg-amber-600' : 'bg-gray-300'"
            ></button>
          </div>
        </div>

        <div class="p-4">
          <div class="mb-2">
            <h2 class="text-xl font-bold text-gray-800">{{ product.name }}</h2>
            <span class="text-lg font-bold text-amber-600 block mt-1"
              >Rp {{ product.sellingPrice.toLocaleString("id-ID") }}</span
            >
          </div>
          <p class="text-gray-600 mb-4 line-clamp-2">
            {{ product.description }}
          </p>
          <div
            class="flex justify-between items-center text-sm text-gray-500 mb-4"
          >
            <span>Category: {{ product.category }}</span>
            <span>{{ product.stock }} in stock</span>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            @click="addToCart(product)"
            class="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            :disabled="product.stock === 0"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {{ product.stock === 0 ? "Out of Stock" : "Add to Cart" }}
          </button>
          <button
            @click="showProductModal(product)"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-all duration-200"
          >
            Details
          </button>
        </div>
      </div>
    </div>

    <!-- Product Detail Modal -->   <div
      v-if="selectedProduct"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 "
      @click.self="selectedProduct = null"
    >
      <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <div class="p-6">
          <div class="relative h-80 mb-6">
            <img
              :src="selectedProduct.images[currentImageIndexes[selectedProduct._id] || 0]"
              class="flex items-center justify-center h-80 m-0"
              alt="Product image"
            />
            <!-- Modal image dots positioned inside the image -->
            <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <button
                v-for="(image, index) in selectedProduct.images"
                :key="index"
                @click="setCurrentImage(selectedProduct._id, index)"
                class="w-3 h-3 rounded-full transition-colors duration-200"
                :class="(currentImageIndexes[selectedProduct._id] || 0) === index ? 'bg-amber-600' : 'bg-gray-300'"
              ></button>
            </div>
          </div>

          <h2 class="text-2xl font-bold text-gray-800 mb-4">
            {{ selectedProduct.name }}
          </h2>
          <p class="text-gray-600 mb-6">{{ selectedProduct.description }}</p>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Price</p>
              <p class="text-xl font-bold text-amber-600">
                Rp {{ selectedProduct.sellingPrice.toLocaleString("id-ID") }}
              </p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Availability</p>
              <p
                class="text-xl font-bold"
                :class="
                  selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'
                "
              >
                {{
                  selectedProduct.stock > 0
                    ? `${selectedProduct.stock} in stock`
                    : "Out of stock"
                }}
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <button
              @click="addToCart(selectedProduct)"
              class="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              :disabled="selectedProduct.stock === 0"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {{ selectedProduct.stock === 0 ? "Out of Stock" : "Add to Cart" }}
            </button>
            <button
              @click="toggleWishlist(selectedProduct._id)"
              class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg
                class="w-5 h-5"
                :class="
                  isInWishlist(selectedProduct._id)
                    ? 'text-red-500 fill-red-500'
                    : 'text-gray-400'
                "
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
              {{
                isInWishlist(selectedProduct._id)
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"
              }}
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
import api from "../../api";
import { ref, computed, onMounted, watch } from "vue";
import { updateCart, wishlistUpdateBus } from "../eventBus";
import { useRouter } from "vue-router";

export default {
  name: "ProductCustomer",
  setup() {
    const router = useRouter();
    const products = ref([]);
    const searchQuery = ref("");
    const selectedCategory = ref("");
    const sortBy = ref("newest");
    const currentImageIndexes = ref({});
    const selectedProduct = ref(null);
    const wishlist = ref([]);
    const cart = ref([]);
    const toasts = ref([]);
    const isAuthenticated = ref(false);
    let toastId = 0;

    const categories = computed(() => {
      const uniqueCategories = new Set(products.value.map((p) => p.category));
      return Array.from(uniqueCategories);
    });

    const filteredProducts = computed(() => {
      let result = [...products.value];

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
      }

      if (selectedCategory.value) {
        result = result.filter((p) => p.category === selectedCategory.value);
      }

      switch (sortBy.value) {
        case "priceAsc":
          result.sort((a, b) => a.sellingPrice - b.sellingPrice);
          break;
        case "priceDesc":
          result.sort((a, b) => b.sellingPrice - a.sellingPrice);
          break;
        case "newest":
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
      }

      return result;
    });

    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        products.value = response.data;
      } catch (error) {
        showToast("Failed to load products", "error");
      }
    };

    const setCurrentImage = (productId, index) => {
      currentImageIndexes.value = {
        ...currentImageIndexes.value,
        [productId]: index,
      };
    };

    const checkAuth = () => {
      const user = localStorage.getItem("user");
      isAuthenticated.value = !!user;
    };

    const showAuthWarning = () => {
      showToast("Please sign in to continue", "error");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    };

    const toggleWishlist = (productId) => {
      if (!isAuthenticated.value) {
        showAuthWarning();
        return;
      }

      const index = wishlist.value.indexOf(productId);
      let newWishlist = [...wishlist.value];

      if (index === -1) {
        newWishlist.push(productId);
        showToast("Added to wishlist", "success");
      } else {
        newWishlist.splice(index, 1);
        showToast("Removed from wishlist", "success");
      }

      wishlist.value = newWishlist;
      wishlistUpdateBus.value = newWishlist;
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    };

    const isInWishlist = (productId) => {
      return wishlist.value.includes(productId);
    };

    const addToCart = (product) => {
      if (!isAuthenticated.value) {
        showAuthWarning();
        return;
      }

      const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItem = currentCart.find(
        (item) => item.productId === product._id
      );

      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          existingItem.quantity++;
          showToast("Added another item to cart", "success");
        } else {
          showToast(`Maximum stock (${product.stock} items) reached`, "error");
          return;
        }
      } else {
        currentCart.push({
          productId: product._id,
          name: product.name,
          price: product.sellingPrice,
          quantity: 1,
          stock: product.stock,
          image: product.images[0],
        });
        showToast("Added to cart", "success");
      }

      updateCart(currentCart);
    };

    const showProductModal = (product) => {
      selectedProduct.value = product;
    };

    const showToast = (message, type = "success") => {
      const toast = {
        id: toastId++,
        message,
        type,
      };
      toasts.value.push(toast);
      setTimeout(() => {
        const index = toasts.value.findIndex((t) => t.id === toast.id);
        if (index !== -1) {
          toasts.value.splice(index, 1);
        }
      }, 3000);
    };

    onMounted(() => {
      checkAuth();

      // Watch for authentication changes
      window.addEventListener("storage", (e) => {
        if (e.key === "user") {
          checkAuth();
        }
      });
    });

    onMounted(async () => {
      await fetchProducts();

      // Load wishlist from localStorage
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        wishlist.value = parsedWishlist;
        wishlistUpdateBus.value = parsedWishlist;
      }

      // Load cart from localStorage
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        cart.value = JSON.parse(savedCart);
      }
    });

    // Watch for changes to save to localStorage

    watch(
      wishlistUpdateBus,
      (newWishlist) => {
        wishlist.value = newWishlist;
      },
      { deep: true, immediate: true }
    );

    watch(
      cart,
      (newCart) => {
        localStorage.setItem("cart", JSON.stringify(newCart));
      },
      { deep: true }
    );

    return {
      products,
      searchQuery,
      selectedCategory,
      sortBy,
      categories,
      filteredProducts,
      currentImageIndexes,
      selectedProduct,
      wishlist,
      cart,
      toasts,
      isAuthenticated,
      setCurrentImage,
      toggleWishlist,
      isInWishlist,
      addToCart,
      showProductModal,
    };
  },
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

.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

img {
  transition: opacity 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
}

button {
  position: relative;
  overflow: hidden;
}

button::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease;
}

button:active::after {
  width: 200%;
  height: 200%;
}
</style>
