<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F4E1] to-[#AF8F6F]/20 p-6">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
      <!-- Logo/Header -->
      <div class="text-center space-y-2">
        <div class="flex justify-center">
          <svg class="w-12 h-12 text-[#74512D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 7V4h16v3M4 7v13h16V7M4 7h16" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 11h8M8 15h8" stroke-linecap="round"/>
          </svg>
        </div>
        <h2 class="text-3xl font-serif font-bold text-[#543310]">Welcome Back</h2>
        <p class="text-[#AF8F6F]">Sign in to your Lestari Furnishing account</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email Field -->
        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium text-[#74512D]">Email</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            required
            class="w-full px-4 py-3 rounded-lg border border-[#AF8F6F]/30 focus:border-[#74512D] focus:ring-2 focus:ring-[#74512D]/20 outline-none transition-all bg-[#F8F4E1]/20"
            placeholder="your@email.com"
          />
        </div>

        <!-- Password Field -->
        <div class="space-y-2">
          <label for="password" class="block text-sm font-medium text-[#74512D]">Password</label>
          <input
            type="password"
            id="password"
            v-model="formData.password"
            required
            class="w-full px-4 py-3 rounded-lg border border-[#AF8F6F]/30 focus:border-[#74512D] focus:ring-2 focus:ring-[#74512D]/20 outline-none transition-all bg-[#F8F4E1]/20"
            placeholder="••••••••"
          />
        </div>

        <!-- Forgot Password Link -->
        <div class="flex justify-end">
          <a href="/forgot-password" class="text-sm text-[#74512D] hover:text-[#543310] transition-colors">
            Forgot your password?
          </a>
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
            <span>Signing in...</span>
          </span>
          <span v-else>Sign In</span>
        </button>

        <!-- Error/Success Messages -->
        <div class="text-center">
          <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
          <p v-if="success" class="text-green-600 text-sm">{{ success }}</p>
        </div>

         <!-- Divider -->
  <div class="relative my-6">
    <div class="absolute inset-0 flex items-center">
      <div class="w-full border-t border-[#AF8F6F]/30"></div>
    </div>
    <div class="relative flex justify-center text-sm">
      <span class="px-2 bg-white text-[#74512D]">Or continue with</span>
    </div>
  </div>
  
  <!-- Google Sign In Button -->
  <button 
    type="button"
    @click="handleGoogleLogin"
    class="w-full flex items-center justify-center space-x-2 bg-white border-2 border-[#AF8F6F]/30 text-[#74512D] py-3 rounded-lg font-medium hover:bg-[#F8F4E1]/20 transition-all duration-300"
  >
    <svg class="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
    <span>Sign in with Google</span>
  </button>

        <!-- Register Link -->
        <p class="text-center text-[#74512D]">
          Don't have an account? 
          <router-link to="/register" class="font-medium text-[#543310] hover:underline">
            Create one here
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginForm',
  data() {
    return {
      formData: {
        email: '',
        password: ''
      },
      isLoading: false,
      error: '',
      success: ''
    }
  },
  methods: {
    async handleLogin() {
  this.isLoading = true;
  this.error = '';
  this.success = '';

  try {
    const response = await axios.post('http://localhost:5000/login', this.formData);
    this.success = response.data.message;

    // Simpan data pengguna di localStorage
    localStorage.setItem('user', JSON.stringify(response.data.user));

    // Reset form
    this.formData = { email: '', password: '' };

    // Redirect dan refresh menggunakan window.location
    window.location.href = '/';
  } catch (error) {
    this.error = error.response?.data?.message || 'Login failed';
  } finally {
    this.isLoading = false;
  }
},
    handleGoogleLogin() {
      window.location.href = 'http://localhost:5000/auth/google?redirect=true';
    }
  }
}
</script>