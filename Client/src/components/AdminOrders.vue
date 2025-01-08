<template>
  <div class="max-w-6xl mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Order Management</h1>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="selectedStatus"
            @change="filterOrders"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
          >
            <option value="">All Status</option>
            <option v-for="status in orderStatuses" :key="status" :value="status">
              {{ capitalizeFirstLetter(status) }}
            </option>
          </select>
        </div>

        <!-- Date Range Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            v-model="startDate"
            @change="filterOrders"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            v-model="endDate"
            @change="filterOrders"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
          />
        </div>
      </div>
    </div>

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
      <p class="text-gray-600">No orders found.</p>
    </div>

    <!-- Orders List -->
    <div v-else class="space-y-4">
      <div v-for="order in orders" :key="order._id" class="bg-white rounded-lg shadow">
        <!-- Order Header -->
        <div class="p-4 flex items-center justify-between border-b cursor-pointer"
             @click="toggleOrder(order._id)">
          <div class="flex items-center space-x-4">
            <div>
              <p class="text-sm text-gray-500">Order ID</p>
              <p class="font-mono text-sm">{{ order._id }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <span :class="getStatusStyles(order.status)"
                    class="px-2 py-1 rounded-full text-xs font-medium">
                {{ capitalizeFirstLetter(order.status) }}
              </span>
              <!-- Status Update Dropdown -->
              <select
                v-model="order.status"
                @change="updateOrderStatus(order)"
                @click.stop
                class="text-sm rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              >
                <option v-for="status in orderStatuses" :key="status" :value="status">
                  {{ capitalizeFirstLetter(status) }}
                </option>
              </select>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-right">
              <p class="text-sm text-gray-500">Customer</p>
              <p class="font-medium">{{ order.customer.fullName }}</p>
            </div>
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

        <!-- Order Details -->
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
              <p v-if="order.customer.address.additionalDetails" class="text-sm mt-1">
                {{ order.customer.address.additionalDetails }}
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
                 class="w-32 h-32 object-cover rounded border cursor-pointer"
                 @click="openPaymentProof(order.paymentProof)" />
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Proof Modal -->
    <div v-if="showPaymentProofModal" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
         @click="showPaymentProofModal = false">
      <div class="bg-white p-2 rounded-lg max-w-2xl max-h-[90vh] overflow-auto">
        <img :src="selectedPaymentProof" 
             alt="Payment proof"
             class="max-w-full h-auto" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'AdminOrders',
  
  setup() {
    const orders = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const expandedOrders = ref({});
    const selectedStatus = ref('');
    const startDate = ref('');
    const endDate = ref('');
    const showPaymentProofModal = ref(false);
    const selectedPaymentProof = ref('');

    const orderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

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
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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

    const openPaymentProof = (imageUrl) => {
      selectedPaymentProof.value = imageUrl;
      showPaymentProofModal.value = true;
    };

    const fetchOrders = async () => {
      try {
        let url = '/api/orders/admin'; // Use relative URL
        const params = new URLSearchParams();
        
        if (selectedStatus.value) {
          params.append('status', selectedStatus.value);
        }
        if (startDate.value) {
          params.append('startDate', startDate.value);
        }
        if (endDate.value) {
          params.append('endDate', endDate.value);
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await axios.get(url, {
          withCredentials: true,
          baseURL: 'http://localhost:5000' // Set base URL for all requests
        });
        
        orders.value = response.data;
        error.value = null;
      } catch (err) {
        if (err.response?.status === 401) {
          error.value = 'Please sign in to access admin features';
        } else if (err.response?.status === 403) {
          error.value = 'Access denied. Admin privileges required.';
        } else {
          error.value = 'Failed to fetch orders';
          console.error('Error fetching orders:', err);
        }
      } finally {
        loading.value = false;
      }
    };


    const filterOrders = () => {
      loading.value = true;
      fetchOrders();
    };

   
    const updateOrderStatus = async (order) => {
      try {
        await axios.patch(`http://localhost:5000/api/orders/${order._id}/status`, {
          status: order.status
        }, {
          withCredentials: true
        });
        // Refetch orders to get updated data
        await fetchOrders();
      } catch (error) {
        console.error('Failed to update status:', error.response?.data || error.message);
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
      selectedStatus,
      startDate,
      endDate,
      orderStatuses,
      showPaymentProofModal,
      selectedPaymentProof,
      toggleOrder,
      getStatusStyles,
      formatDate,
      formatPrice,
      capitalizeFirstLetter,
      getProductImage,
      handleImageError,
      filterOrders,
      updateOrderStatus,
      openPaymentProof
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