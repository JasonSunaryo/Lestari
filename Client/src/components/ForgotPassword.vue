<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F4E1] to-[#AF8F6F]/20 p-6">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <!-- Logo/Header -->
        <div class="text-center space-y-2">
          <div class="flex justify-center">
            <svg class="w-12 h-12 text-[#74512D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 class="text-3xl font-serif font-bold text-[#543310]">Reset Password</h2>
          <p class="text-[#AF8F6F]">Enter your email to reset your password</p>
        </div>
  
        <form @submit.prevent="handleForgotPassword" class="space-y-6">
          <!-- Email Field -->
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-[#74512D]">Email</label>
            <input
              type="email"
              id="email"
              v-model="email"
              required
              class="w-full px-4 py-3 rounded-lg border border-[#AF8F6F]/30 focus:border-[#74512D] focus:ring-2 focus:ring-[#74512D]/20 outline-none transition-all bg-[#F8F4E1]/20"
              placeholder="your@email.com"
            />
          </div>
  
          <!-- Submit Button -->
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full bg-gradient-to-r from-[#74512D] to-[#543310] text-[#F8F4E1] py-3 rounded-lg font-medium hover:from-[#543310] hover:to-[#74512D] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <span v-if="isLoading" class="flex items-center justify-center space-x-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span>Sending Reset Link...</span>
            </span>
            <span v-else>Send Reset Link</span>
          </button>
  
          <!-- Error/Success Messages -->
          <div class="text-center">
            <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
            <p v-if="success" class="text-green-600 text-sm">{{ success }}</p>
          </div>
  
          <!-- Back to Login Link -->
          <p class="text-center text-[#74512D]">
            Remember your password? 
            <router-link to="/login" class="font-medium text-[#543310] hover:underline">
              Back to login
            </router-link>
          </p>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'ForgotPassword',
    data() {
      return {
        email: '',
        isLoading: false,
        error: '',
        success: ''
      }
    },
    methods: {
      async handleForgotPassword() {
        this.isLoading = true;
        this.error = '';
        this.success = '';
  
        try {
          const response = await axios.post('http://localhost:5000/forgot-password', { email: this.email });
          this.success = response.data.message;
          this.email = '';
        } catch (error) {
          this.error = error.response?.data?.message || 'Failed to send reset link';
        } finally {
          this.isLoading = false;
        }
      }
    }
  }
  </script>