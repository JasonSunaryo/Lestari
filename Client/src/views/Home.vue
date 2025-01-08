<template>
  <div>
    <Hero />
    <ProductCustomer />
    
    <!-- Purchase Confirmation Popup -->
    <PurchaseConfirmation
      v-if="showPurchasePopupBus"
      :cart="cartItems"
      :totalAmount="cartTotal"
      @close="closePurchasePopup"
      @order-success="handleOrderSuccess"
    />
  </div>
</template>

<script>
import Hero from '../components/HeroSection.vue'
import ProductCustomer from '../components/ProductCustomer.vue'
import PurchaseConfirmation from '../components/PurchaseConfirmation.vue'
import { computed } from 'vue'
import { showPurchasePopupBus } from '../eventBus'

export default {
  name: 'App',
  components: {
    Hero,
    ProductCustomer,
    PurchaseConfirmation
  },
  setup() {
    // Get cart data from localStorage
    const cartItems = computed(() => {
      const cartData = localStorage.getItem('cart')
      return cartData ? JSON.parse(cartData) : []
    })
    
    // Calculate total amount
    const cartTotal = computed(() => {
      return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
    })
    
    // Methods
    const closePurchasePopup = () => {
      showPurchasePopupBus.value = false
    }
    
    const handleOrderSuccess = () => {
      localStorage.removeItem('cart')
      showPurchasePopupBus.value = false
      // Tambahkan notifikasi sukses jika diperlukan
    }
    
    return {
      showPurchasePopupBus,
      cartItems,
      cartTotal,
      closePurchasePopup,
      handleOrderSuccess
    }
  }
}
</script>