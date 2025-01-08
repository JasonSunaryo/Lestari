<template>
  <nav
    class="bg-gradient-to-r from-[#74512D] to-[#543310] text-[#F8F4E1] shadow-xl sticky top-0 z-50"
  >
    <div class="container mx-auto flex items-center justify-between py-6 px-6">
      <!-- Logo -->
      <div
        class="text-2xl font-serif transform transition-transform hover:scale-105"
      >
        <a
          href="/"
          class="flex items-center space-x-3 hover:text-[#AF8F6F] transition"
        >
          <img
            class="w-10 h-10 rounded-full object-cover border-2 border-[#F8F4E1]"
            src="../assets//wood furnishing web logo that has name Lestari Furnishings.jpg"
            alt=""
          />
          <span class="font-bold tracking-wider">Lestari Furnishing</span>
        </a>
      </div>

      <!-- Navigation Links -->
      <ul class="hidden md:flex space-x-8">
        <li v-for="item in navigationItems" :key="item">
          <a
            :href="generateHref(item)"
            @click="handleNavClick"
            class="relative group text-[#F8F4E1] font-medium tracking-wide hover:text-[#AF8F6F] transition-all duration-300"
          >
            {{ item }}
            <span
              class="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#AF8F6F] group-hover:w-full transition-all duration-300"
            />
          </a>
        </li>
      </ul>

      <!-- Search Bar -->
      <div
        class="hidden lg:flex items-center space-x-2 bg-[#F8F4E1]/10 backdrop-blur-sm rounded-full px-4 py-2.5 shadow-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-[#AF8F6F]"
      >
        <svg
          class="h-5 w-5 text-[#F8F4E1] opacity-70"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search our collection..."
          class="w-64 outline-none bg-transparent placeholder-[#F8F4E1]/70 text-[#F8F4E1]"
          v-model="searchQuery"
        />
      </div>

      <!-- User Options -->
      <div class="flex items-center space-x-6">
        <!-- Cart Icon & Dropdown -->
        <div class="relative group">
          <button
            @click="toggleCart"
            @mouseenter="showCart = true"
            class="relative hover:text-[#AF8F6F] transition-colors duration-300 cursor-pointer mt-1"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </button>
          <span
            v-if="cartItems.length > 0"
            class="absolute -top-2 -right-2 bg-[#AF8F6F] text-[#F8F4E1] rounded-full px-1.5 py-0.5 text-xs font-bold"
          >
            {{ cartItems.length }}
          </span>

          <!-- Cart Dropdown -->
          <div
            v-show="showCart"
            @mouseleave="showCart = false"
            class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-4 text-gray-800 transform transition-all duration-300 origin-top"
          >
            <div class="px-4 py-2 border-b border-gray-200">
              <h3 class="font-bold text-lg">Shopping Cart</h3>
            </div>

            <div class="max-h-96 overflow-y-auto">
              <!-- Empty Cart Message -->
              <div
                v-if="!cartItems.length"
                class="p-4 text-center text-gray-500"
              >
                Your cart is empty
              </div>

              <!-- Cart Items -->
              <div v-else>
                <div
                  v-for="item in cartItems"
                  :key="item.productId"
                  class="p-4 border-b border-gray-100 hover:bg-gray-50"
                >
                  <div class="flex items-center space-x-4">
                    <img
                      :src="item.image"
                      :alt="item.name"
                      class="w-16 h-16 object-cover rounded-md"
                    />
                    <div class="flex-1">
                      <h4 class="font-medium">{{ item.name }}</h4>
                      <p class="text-[#AF8F6F] font-bold">
                        Rp {{ item.price.toLocaleString("id-ID") }}
                      </p>
                      <div class="flex items-center space-x-2 mt-2">
                        <button
                          @click="handleQuantityUpdate(item.productId, -1)"
                          class="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                          :disabled="item.quantity <= 1"
                        >
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span>{{ item.quantity }}</span>
                        <button
                          @click="handleQuantityUpdate(item.productId, 1)"
                          class="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                          :disabled="item.quantity >= item.stock"
                        >
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                        <span class="text-sm text-gray-500 ml-2">
                          (Stock: {{ item.stock }})
                        </span>
                      </div>
                    </div>

                    <button
                      @click="removeFromCart(item.productId)"
                      class="text-red-500 hover:text-red-700"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Cart Total -->
                <div class="p-4 border-t border-gray-200">
                  <div class="flex justify-between items-center mb-4">
                    <span class="font-bold">Total:</span>
                    <span class="font-bold text-[#AF8F6F]"
                      >Rp {{ totalPrice.toLocaleString("id-ID") }}</span
                    >
                  </div>
                  <button
                    @click="handlePurchase"
                    class="block w-full bg-[#AF8F6F] text-white text-center py-2 rounded-lg hover:bg-[#74512D] transition-colors duration-300"
                  >
                    Purchase
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Wishlist -->
        <a
          href="/wishlist"
          class="relative hover:text-[#AF8F6F] transition-colors duration-300"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span
            v-if="wishlist.length > 0"
            class="absolute -top-2 -right-2 bg-[#AF8F6F] text-[#F8F4E1] rounded-full px-1.5 py-0.5 text-xs font-bold"
          >
            {{ wishlist.length }}
          </span>
        </a>

        <!-- User Profile / Auth Buttons -->
        <div v-if="isAuthenticated" class="relative user-menu">
          <button
            @click="toggleUserMenu"
            class="flex items-center space-x-2 focus:outline-none"
          >
            <img
              :src="user.picture || require('@/assets/default-avatar.png')"
              alt="Profile"
              class="w-8 h-8 rounded-full object-cover border-2 border-[#F8F4E1]"
            />
            <span class="font-medium">{{ user.username || user.name }}</span>
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <!-- User Dropdown Menu -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 text-[#543310]"
          >
            <a
              href="/orders"
              class="block px-4 py-2 hover:bg-[#F8F4E1] transition-colors duration-200"
            >
              Orders
            </a>
            <button
              @click="handleLogout"
              class="w-full text-left px-4 py-2 text-red-600 hover:bg-[#F8F4E1] transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        <!-- Sign In Button (when not authenticated) -->
        <a
          v-else
          href="/login"
          class="bg-[#AF8F6F] text-[#F8F4E1] px-6 py-2.5 rounded-full font-medium tracking-wide hover:bg-[#74512D] transition-colors duration-300 transform hover:scale-105 shadow-lg"
        >
          Sign In
        </a>
      </div>

      <!-- Mobile Menu Button -->
      <button
        class="md:hidden text-2xl focus:outline-none hover:text-[#AF8F6F] transition"
        @click="toggleMobileMenu"
      >
        <svg
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div
      v-if="mobileMenuOpen"
      class="md:hidden bg-gradient-to-b from-[#74512D] to-[#543310] px-6 py-4 absolute w-full origin-top animate-slide-down"
    >
      <ul class="space-y-4">
        <li v-for="item in navigationItems" :key="item">
          <a
            :href="generateHref(item)"
            class="block py-2.5 px-4 text-[#F8F4E1] hover:text-[#AF8F6F] transition duration-300 hover:bg-[#543310]/50 rounded-lg font-medium tracking-wide"
          >
            {{ item }}
          </a>
        </li>
        <li v-if="isAuthenticated">
          <button
            @click="handleLogout"
            class="w-full text-left py-2.5 px-4 text-red-400 hover:text-red-300 transition duration-300 hover:bg-[#543310]/50 rounded-lg font-medium tracking-wide"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import {
  cartUpdateBus,
  showPurchasePopupBus,
  wishlistUpdateBus,
} from "../eventBus";
import axios from "axios";
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute } from 'vue-router';
export default {
  name: "NavBar",
  emits: ["show-purchase"], // Deklarasikan emit events
  setup() {
    // State
    const mobileMenuOpen = ref(false);
    const showUserMenu = ref(false);
    const showCart = ref(false);
    const searchQuery = ref("");
    const cartItems = ref([]);
    const wishlist = ref([]);
    const user = ref(null);
    const isAuthenticated = ref(false);
    const defaultAvatar = "/path/to/default-avatar.png";
    const logo = "/path/to/logo.png";
    const navigationItems = computed(() => {
      const publicItems = ["Products", "Orders", "Contact"];
      const adminItems = ["Admin Orders", "Analytics"];

      // If user is authenticated and is admin, include admin items
      if (isAuthenticated.value && user.value?.role === "admin") {
        return [...publicItems, ...adminItems];
      }

      // Otherwise return only public items
      return publicItems;
    });

    // Computed
    const totalPrice = computed(() => {
      return cartItems.value.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    });

    const generateHref = (item) => {
  if (item === "Products") {
    if (isAuthenticated.value && user.value?.role === "admin") {
      return "/products";
    } else {
      return route.path === "/" ? "#product-customer" : "/";
    }
  }
  if (item === "Contact") {
    return route.path === "/" ? "#footer" : "/"; 
  }
  return `/${item.toLowerCase().replace(" ", "-")}`;
};

// Add smooth scroll handler for anchor links

const route = useRoute();

const handleNavClick = (e) => {
  const href = e.target.getAttribute('href');
  if (href?.startsWith('#') && route.path === "/") {
    e.preventDefault();
    document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
  }
};

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;
    };

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value;
    };

    const toggleCart = () => {
      showCart.value = !showCart.value;
    };

    const handlePurchase = () => {
      showCart.value = false;
      showPurchasePopupBus.value = true; // Gunakan event bus
    };

    const showError = (message) => {
      const errorMessage = document.createElement("div");
      errorMessage.className =
        "fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
      errorMessage.textContent = message;
      document.body.appendChild(errorMessage);
      setTimeout(() => errorMessage.remove(), 3000);
    };

    const handleQuantityUpdate = async (productId, change) => {
      try {
        const item = cartItems.value.find(
          (item) => item.productId === productId
        );
        if (!item) return;

        const newQuantity = item.quantity + change;

        // Client-side validation
        if (newQuantity < 1) {
          showError("Quantity cannot be less than 1");
          return;
        }

        if (newQuantity > item.stock) {
          showError(`Cannot exceed available stock (${item.stock} items)`);
          return;
        }

        // Update quantity locally first for better UX
        const updatedCart = cartItems.value.map((cartItem) => {
          if (cartItem.productId === productId) {
            return { ...cartItem, quantity: newQuantity };
          }
          return cartItem;
        });

        // Update state and localStorage
        cartItems.value = updatedCart;
        localStorage.setItem("cart", JSON.stringify(updatedCart));

        // Notify other components via event bus
        cartUpdateBus.value = updatedCart;
      } catch (error) {
        console.error("Error updating quantity:", error);
        showError(error.message || "Error updating quantity");
      }
    };

    const removeFromCart = (productId) => {
      cartItems.value = cartItems.value.filter(
        (item) => item.productId !== productId
      );
      localStorage.setItem("cart", JSON.stringify(cartItems.value));
    };

    const checkAuth = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        user.value = JSON.parse(savedUser);
        isAuthenticated.value = true;

        if (user.value.googleId) {
          user.value.picture = user.value.imageUrl;
          user.value.name = user.value.name || user.value.email.split("@")[0];
        }
      }
    };

    const handleLogout = async () => {
      try {
        await axios.post(
          "http://localhost:5000/logout",
          {},
          {
            withCredentials: true,
          }
        );

        localStorage.removeItem("user");
        user.value = null;
        isAuthenticated.value = false;
        showUserMenu.value = false;
        mobileMenuOpen.value = false;

        // Optional: Redirect to home page
        window.location.href = "/";
      } catch (error) {
        console.error("Logout failed:", error);
        alert("Logout failed. Please try again.");
      }
    };

    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-menu")) {
        showUserMenu.value = false;
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === "user") {
        checkAuth();
      } else if (e.key === "cart") {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          cartItems.value = JSON.parse(savedCart);
        }
      } else if (e.key === "wishlist") {
        const savedWishlist = localStorage.getItem("wishlist");
        if (savedWishlist) {
          wishlist.value = JSON.parse(savedWishlist);
        }
      }
    };
    watch(
      cartUpdateBus,
      (newCart) => {
        cartItems.value = newCart;
      },
      { deep: true, immediate: true }
    );

    // Lifecycle hooks
    onMounted(() => {
      // Initialize auth state
      checkAuth();

      // Load cart items from localStorage
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        cartItems.value = JSON.parse(savedCart);
      }

      // Load wishlist from localStorage
      const savedWishlist = localStorage.getItem("wishlist");
      if (savedWishlist) {
        wishlist.value = JSON.parse(savedWishlist);
      }

      // Add event listeners
      document.addEventListener("click", handleClickOutside);
      window.addEventListener("storage", handleStorageChange);
    });

    // Cleanup
    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("storage", handleStorageChange);
    });

    // Watch for changes to save to localStorage
    watch(
      cartItems,
      (newCart) => {
        localStorage.setItem("cart", JSON.stringify(newCart));
      },
      { deep: true }
    );

    watch(
      wishlistUpdateBus,
      (newWishlist) => {
        wishlist.value = newWishlist;
      },
      { deep: true, immediate: true }
    );

    watch(
      wishlist,
      (newWishlist) => {
        localStorage.setItem("wishlist", JSON.stringify(newWishlist));
        wishlistUpdateBus.value = newWishlist; // Add this line
      },
      { deep: true }
    );

    return {
      // State
      mobileMenuOpen,
      showUserMenu,
      showCart,
      searchQuery,
      navigationItems,
      cartItems,
      wishlist,
      user,
      isAuthenticated,
      defaultAvatar,
      logo,

      // Computed
      totalPrice,

      // Methods
      generateHref,
      toggleMobileMenu,
      toggleUserMenu,
      toggleCart,
      handleQuantityUpdate,
      removeFromCart,
      handleLogout,
      handleClickOutside,
      handlePurchase,
      handleNavClick
    };
  },
};
</script>

<style scoped>
@keyframes slide-down {
  from {
    opacity: 0;
    transform: scaleY(0);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out;
  transform-origin: top;
}

/* Custom scrollbar for cart dropdown */
.max-h-96::-webkit-scrollbar {
  width: 6px;
}

.max-h-96::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.max-h-96::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.max-h-96::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Button hover effects */
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

/* Transition effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
