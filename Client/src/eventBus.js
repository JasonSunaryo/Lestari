import { ref } from 'vue';

export const cartUpdateBus = ref([]);
export const showPurchasePopupBus = ref(false)
export const wishlistUpdateBus = ref([])
export const updateCart = (newCart) => {
  cartUpdateBus.value = [...newCart];
  localStorage.setItem('cart', JSON.stringify(newCart));
};