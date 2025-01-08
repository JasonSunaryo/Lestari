<template>
    <div class="max-w-4xl mx-auto px-4 py-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center p-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
  
      <!-- Error State -->
      <div v-else-if="error" class="text-center p-4">
        <p class="text-red-600">{{ error }}</p>
      </div>
  
      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="text-center p-6 bg-white rounded-lg shadow">
        <p class="text-gray-600">You haven't placed any orders yet.</p>
      </div>
  
      <!-- Orders List -->
      <div v-else class="space-y-4">
        <div v-for="order in orders" :key="order._id" class="bg-white rounded-lg shadow">
          <!-- Order Header - Always Visible -->
          <div class="p-4 flex items-center justify-between border-b cursor-pointer" 
               @click="toggleOrder(order._id)">
            <div class="flex items-center space-x-4">
              <div>
                <p class="text-sm text-gray-500">Order ID</p>
                <p class="font-mono text-sm">{{ order._id }}</p>
              </div>
              <span :class="getStatusStyles(order.status)"
                    class="px-2 py-1 rounded-full text-xs font-medium">
                {{ capitalizeFirstLetter(order.status) }}
              </span>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <p class="text-sm text-gray-500">Total</p>
                <p class="font-medium">Rp {{ formatPrice(order.totalAmount) }}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" 
                   :class="{'rotate-180': expandedOrders[order._id]}"
                   class="w-5 h-5 transition-transform duration-200" 
                   viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
  
          <!-- Order Details - Expandable -->
          <div v-show="expandedOrders[order._id]" class="p-4">
            <!-- Customer Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 class="text-sm font-medium text-gray-600 mb-2">Customer Details</h3>
                <p class="text-sm">{{ order.customer.fullName }}</p>
                <p class="text-sm">{{ order.customer.phoneNumber }}</p>
                <p class="text-sm">{{ order.customer.address.street }}</p>
                <p class="text-sm">
                  {{ order.customer.address.district }}, {{ order.customer.address.city }}
                  {{ order.customer.address.province }} {{ order.customer.address.postalCode }}
                </p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-600 mb-2">Order Info</h3>
                <p class="text-sm">Order Date: {{ formatDate(order.createdAt) }}</p>
                <p class="text-sm">Last Updated: {{ formatDate(order.statusUpdatedAt) }}</p>
              </div>
            </div>
  
            <!-- Order Items -->
            <div class="border rounded-lg">
              <div v-for="item in order.items" :key="item.product._id"
                   class="flex items-center justify-between p-3 border-b last:border-b-0">
                <div class="flex items-center space-x-3">
                  <img :src="getProductImage(item.product)"
                       :alt="item.product.name"
                       class="w-12 h-12 object-cover rounded"
                       @error="handleImageError" />
                  <div>
                    <p class="text-sm font-medium">{{ item.product.name }}</p>
                    <p class="text-xs text-gray-500">Qty: {{ item.quantity }}</p>
                  </div>
                </div>
                <p class="text-sm font-medium">
                  Rp {{ formatPrice(item.price * item.quantity) }}
                </p>
              </div>
            </div>
  
            <!-- Payment Proof -->
            <div v-if="order.paymentProof" class="mt-4">
              <h3 class="text-sm font-medium text-gray-600 mb-2">Payment Proof</h3>
              <img :src="order.paymentProof" 
                   alt="Payment proof"
                   class="w-32 h-32 object-cover rounded border" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRouter } from "vue-router";
  
  export default {
    name: 'CustomerOrders',
    
    setup() {
      const router = useRouter();
      const orders = ref([]);
      const loading = ref(true);
      const error = ref(null);
      const expandedOrders = ref({});
  
      const toggleOrder = (orderId) => {
        expandedOrders.value[orderId] = !expandedOrders.value[orderId];
      };
  
      const getStatusStyles = (status) => {
        const styles = {
          pending: 'bg-yellow-100 text-yellow-800',
          confirmed: 'bg-blue-100 text-blue-800',
          processing: 'bg-purple-100 text-purple-800',
          shipped: 'bg-indigo-100 text-indigo-800',
          delivered: 'bg-green-100 text-green-800',
          cancelled: 'bg-red-100 text-red-800'
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
      };
  
      const getProductImage = (product) => {
        return product.images?.[0] || '/placeholder-product-image.jpg';
      };
  
      const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };
  
      const formatPrice = (price) => {
        return price.toLocaleString('id-ID');
      };
  
      const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
      };
  
      const handleImageError = (e) => {
        e.target.src = '/placeholder-product-image.jpg';
      };
  
      const fetchOrders = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/orders', {
      withCredentials: true // Important for sending session cookie
    });
    orders.value = response.data;
  } catch (err) {
    if (err.response?.status === 401) {
      error.value = 'Please sign in to view your orders';
      // Optionally redirect to login page
      router.push('/login');
    } else {
      error.value = 'Failed to fetch orders';
    }
    console.error('Error fetching orders:', err);
  } finally {
    loading.value = false;
  }
};
  
      onMounted(() => {
        fetchOrders();
      });
  
      return {
        orders,
        loading,
        error,
        expandedOrders,
        toggleOrder,
        getStatusStyles,
        formatDate,
        formatPrice,
        capitalizeFirstLetter,
        getProductImage,
        handleImageError
      };
    }
  };
  </script>
  
  <style scoped>
  .rotate-180 {
    transform: rotate(180deg);
  }
  
  .transition-transform {
    transition: transform 0.2s ease-in-out;
  }
  </style>