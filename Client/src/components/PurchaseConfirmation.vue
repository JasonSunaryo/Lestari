<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
      <button 
        @click="$emit('close')"
        class="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex items-center justify-center"
        aria-label="Close"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="w-6 h-6 text-gray-500 hover:text-gray-700" 
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

      <!-- Content -->
      <div class="p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Purchase Confirmation</h2>

        <!-- Order Summary -->
        <div class="mb-8 bg-gray-50 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Order Summary</h3>
          <div class="space-y-3">
            <div v-for="item in cart" :key="item.id" class="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
              <div class="flex items-center gap-4">
                <img 
                  :src="item.image" 
                  :alt="item.name"
                  class="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <h4 class="font-medium text-gray-800">{{ item.name }}</h4>
                  <p class="text-sm text-gray-600">Quantity: {{ item.quantity }}</p>
                </div>
              </div>
              <p class="font-medium text-gray-800">
                Rp {{ (item.price * item.quantity).toLocaleString('id-ID') }}
              </p>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-gray-200">
            <div class="flex justify-between items-center font-semibold text-lg">
              <span>Total Amount:</span>
              <span>Rp {{ totalAmount.toLocaleString('id-ID') }}</span>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitOrder" class="space-y-6">
          <!-- Personal Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-700">Personal Information</h3>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                v-model="form.fullName"
                type="text"
                required
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                v-model="form.phoneNumber"
                type="tel"
                required
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
            </div>
          </div>

          <!-- Address Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-700">Delivery Address</h3>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input 
                v-model="form.streetAddress"
                type="text"
                required
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Street name, house number"
              >
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">District</label>
                <input 
                  v-model="form.district"
                  type="text"
                  required
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="District/Kecamatan"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input 
                  v-model="form.city"
                  type="text"
                  required
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="City name"
                >
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <input 
                  v-model="form.province"
                  type="text"
                  required
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Province"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input 
                  v-model="form.postalCode"
                  type="text"
                  required
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Postal code"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Additional Details</label>
              <textarea 
                v-model="form.addressDetails"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Landmarks, building name, floor number, etc."
                rows="2"
              ></textarea>
            </div>
          </div>

          <!-- Payment Proof Upload -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-700">Payment Proof</h3>
            
            <!-- Bank Account Info -->
            <div class="p-4 bg-amber-50 rounded-lg">
              <p class="font-medium text-amber-800">Bank Transfer Details:</p>
              <p class="text-amber-700">Bank: BCA</p>
              <p class="text-amber-700">Account Number: 1234567890</p>
              <p class="text-amber-700">Account Name: Lestari Furnishing</p>
              <p class="text-amber-700">Total Amount: Rp {{ totalAmount.toLocaleString('id-ID') }}</p>
            </div>

            <!-- Upload Section -->
            <div 
              class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"
              @dragover.prevent
              @drop.prevent="handleFileDrop"
            >
              <div v-if="!form.paymentProof">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="mt-2 text-sm text-gray-600">Drag and drop your payment proof here or</p>
                <input
                  type="file"
                  ref="fileInput"
                  @change="handleFileSelect"
                  accept="image/*"
                  class="hidden"
                >
                <button
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="mt-2 px-4 py-2 text-sm text-amber-600 hover:text-amber-700"
                >
                  Browse Files
                </button>
              </div>
              <div v-else class="relative">
                <img 
                  :src="previewImage" 
                  class="max-h-48 mx-auto rounded-lg"
                  alt="Payment proof preview"
                >
                <button
                  type="button"
                  @click="removeImage"
                  class="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            :disabled="isSubmitting"
          >
            <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {{ isSubmitting ? 'Processing...' : 'Confirm Order' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onUnmounted } from 'vue';
import api from '../../api';
import { useRouter } from 'vue-router'; // Add this import

export default {
  name: 'PurchaseConfirmation',
  props: {
    cart: {
      type: Array,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    }
  },
  emits: ['close', 'order-success'],
  
  setup(props, { emit }) {
    const router = useRouter();
    const fileInput = ref(null);
    const isSubmitting = ref(false);
    const errorMessage = ref('');
    const form = ref({
      fullName: '',
      phoneNumber: '',
      streetAddress: '',
      district: '',
      city: '',
      province: '',
      postalCode: '',
      addressDetails: '',
      paymentProof: null
    });

    const previewImage = ref('');

    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      handleFile(file);
    };

    const handleFileDrop = (event) => {
      const file = event.dataTransfer.files[0];
      handleFile(file);
    };

    const handleFile = (file) => {
      if (file && file.type.startsWith('image/')) {
        form.value.paymentProof = file;
        previewImage.value = URL.createObjectURL(file);
      }
    };

    const removeImage = () => {
      form.value.paymentProof = null;
      previewImage.value = '';
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    };

    const submitOrder = async () => {
      try {
        isSubmitting.value = true;
        errorMessage.value = '';

        const formData = new FormData();
        formData.append('paymentProof', form.value.paymentProof);
        formData.append('fullName', form.value.fullName);
        formData.append('phoneNumber', form.value.phoneNumber);
        formData.append('streetAddress', form.value.streetAddress);
        formData.append('district', form.value.district);
        formData.append('city', form.value.city);
        formData.append('province', form.value.province);
        formData.append('postalCode', form.value.postalCode);
        formData.append('addressDetails', form.value.addressDetails);
        formData.append('cart', JSON.stringify(props.cart));
        formData.append('totalAmount', props.totalAmount);

      await api.post('/orders', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true // Important: This ensures cookies are sent
        });

        emit('order-success');
        emit('close');
        
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        console.error('Order submission failed:', error);
        
        if (error.response) {
          switch (error.response.status) {
            case 401:
              errorMessage.value = 'Please sign in to continue';
              // Redirect to login page with return URL
              router.push({
                path: '/login',
                query: { redirect: router.currentRoute.value.fullPath }
              });
              break;
            case 400:
              errorMessage.value = error.response.data.message || 'Invalid form data';
              break;
            default:
              errorMessage.value = 'An error occurred while processing your order';
          }
        } else if (error.request) {
          errorMessage.value = 'Unable to connect to the server';
        } else {
          errorMessage.value = 'An unexpected error occurred';
        }
      } finally {
        isSubmitting.value = false;
      }
    };

    onUnmounted(() => {
      if (previewImage.value) {
        URL.revokeObjectURL(previewImage.value);
      }
    });

    return {
      form,
      fileInput,
      previewImage,
      isSubmitting,
      errorMessage,
      handleFileSelect,
      handleFileDrop,
      removeImage,
      submitOrder
    };
  }
};
</script>