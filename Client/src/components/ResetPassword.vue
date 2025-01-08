<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F4E1] to-[#AF8F6F]/20 p-6">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <!-- Logo/Header -->
        <div class="text-center space-y-2">
          <div class="flex justify-center">
            <svg class="w-12 h-12 text-[#74512D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 class="text-3xl font-serif font-bold text-[#543310]">Reset Password</h2>
          <p class="text-[#AF8F6F]">Enter your new password</p>
        </div>
  
        <form @submit.prevent="handleResetPassword" class="space-y-6">
          <!-- Password Field -->
          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-[#74512D]">New Password</label>
            <input
              type="password"
              id="password"
              v-model="formData.password"
              required
              class="w-full px-4 py-3 rounded-lg border border-[#AF8F6F]/30 focus:border-[#74512D] focus:ring-2 focus:ring-[#74512D]/20 outline-none transition-all bg-[#F8F4E1]/20"
              placeholder="••••••••"
            />
          </div>
  
          <!-- Confirm Password Field -->
          <div class="space-y-2">
            <label for="confirmPassword" class="block text-sm font-medium text-[#74512D]">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="formData.confirmPassword"
              required
              class="w-full px-4 py-3 rounded-lg border border-[#AF8F6F]/30 focus:border-[#74512D] focus:ring-2 focus:ring-[#74512D]/20 outline-none transition-all bg-[#F8F4E1]/20"
              placeholder="••••••••"
            />
          </div>
  
          <!-- Submit Button -->
          <button 
            type="submit" 
            :disabled="isLoading || formData.password !== formData.confirmPassword"
            class="w-full bg-gradient-to-r from-[#74512D] to-[#543310] text-[#F8F4E1] py-3 rounded-lg font-medium hover:from-[#543310] hover:to-[#74512D] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <span v-if="isLoading" class="flex items-center justify-center space-x-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span>Resetting Password...</span>
            </span>
            <span v-else>Reset Password</span>
          </button>
  
          <!-- Error/Success Messages -->
          <div class="text-center">
            <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
            <p v-if="success" class="text-green-600 text-sm">{{ success }}</p>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'ResetPassword',
    data() {
      return {
        formData: {
          password: '',
          confirmPassword: ''
        },
        isLoading: false,
        error: '',
        success: ''
      }
    },
    methods: {
        async handleResetPassword() {
  if (this.formData.password !== this.formData.confirmPassword) {
    this.error = 'Passwords do not match';
    return;
  }

  this.isLoading = true;
  this.error = '';
  this.success = '';

  try {
    const token = this.$route.params.token;
    console.log('Using token:', token); // Add this debug log

    const response = await axios.post(`http://localhost:5000/reset-password/${token}`, {
      password: this.formData.password
    });
    
    this.success = response.data.message;
    this.formData = { password: '', confirmPassword: '' };
    
    setTimeout(() => {
      this.$router.push('/login');
    }, 2000);
  } catch (error) {
    console.log('Error details:', error.response?.data); // Add this debug log
    this.error = error.response?.data?.message || 'Failed to reset password';
  } finally {
    this.isLoading = false;
  }
}
    }
  }
  </script>