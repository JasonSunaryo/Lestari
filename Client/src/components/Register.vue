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
        <h2 class="text-3xl font-serif font-bold text-[#543310]">Create Account</h2>
        <p class="text-[#AF8F6F]">Join the Lestari Furnishing family</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <!-- Username Field -->
        <div class="space-y-2">
          <label for="username" class="block text-sm font-medium text-[#74512D]">Username</label>
          <input
            type="text"
            id="username"
            v-model="formData.username"
            required
            class="w-full px-4 py-3 rounded-lg border border-[#AF8F6F]/30 focus:border-[#74512D] focus:ring-2 focus:ring-[#74512D]/20 outline-none transition-all bg-[#F8F4E1]/20"
            placeholder="Your username"
          />
        </div>

        <!-- Email Field -->
        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium text-[#74512D]">Email</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            required
            @blur="validateEmail"
            class="w-full px-4 py-3 rounded-lg border border-[#AF8F6F]/30 focus:border-[#74512D] focus:ring-2 focus:ring-[#74512D]/20 outline-none transition-all bg-[#F8F4E1]/20"
            placeholder="your@email.com"
          />
          <span v-if="emailError" class="text-red-500 text-sm">{{ emailError }}</span>
        </div>

        <!-- Password Field -->
        <div class="space-y-2">
          <label for="password" class="block text-sm font-medium text-[#74512D]">Password</label>
          <input
            type="password"
            id="password"
            v-model="formData.password"
            required
            @blur="validatePassword"
            class="w-full px-4 py-3 rounded-lg border border-[#AF8F6F]/30 focus:border-[#74512D] focus:ring-2 focus:ring-[#74512D]/20 outline-none transition-all bg-[#F8F4E1]/20"
            placeholder="••••••••"
          />
          <div class="mt-2 text-sm text-[#74512D]/80 space-y-1">
            <p class="font-medium">Password requirements:</p>
            <ul class="space-y-1">
              <li class="flex items-center space-x-2">
                <span :class="hasMinLength ? 'text-green-500' : 'text-red-500'">
                  {{ hasMinLength ? '✓' : '×' }}
                </span>
                <span :class="hasMinLength ? 'text-[#74512D]' : 'text-[#74512D]/70'">
                  Minimum 8 characters
                </span>
              </li>
              <li class="flex items-center space-x-2">
                <span :class="hasUpperCase ? 'text-green-500' : 'text-red-500'">
                  {{ hasUpperCase ? '✓' : '×' }}
                </span>
                <span :class="hasUpperCase ? 'text-[#74512D]' : 'text-[#74512D]/70'">
                  One uppercase letter
                </span>
              </li>
              <li class="flex items-center space-x-2">
                <span :class="hasLowerCase ? 'text-green-500' : 'text-red-500'">
                  {{ hasLowerCase ? '✓' : '×' }}
                </span>
                <span :class="hasLowerCase ? 'text-[#74512D]' : 'text-[#74512D]/70'">
                  One lowercase letter
                </span>
              </li>
              <li class="flex items-center space-x-2">
                <span :class="hasNumber ? 'text-green-500' : 'text-red-500'">
                  {{ hasNumber ? '✓' : '×' }}
                </span>
                <span :class="hasNumber ? 'text-[#74512D]' : 'text-[#74512D]/70'">
                  One number
                </span>
              </li>
              <li class="flex items-center space-x-2">
                <span :class="hasSpecialChar ? 'text-green-500' : 'text-red-500'">
                  {{ hasSpecialChar ? '✓' : '×' }}
                </span>
                <span :class="hasSpecialChar ? 'text-[#74512D]' : 'text-[#74512D]/70'">
                  One special character
                </span>
              </li>
            </ul>
          </div>
        </div>

         <!-- Modified Verification Code Field -->
      <div v-if="showVerification" class="space-y-2">
        <label for="verificationCode" class="block text-sm font-medium text-[#74512D]">
          Verification Code
        </label>
        <input
          type="text"
          id="verificationCode"
          v-model="verificationCode"
          required
          class="w-full px-4 py-3 rounded-lg border border-[#AF8F6F]/30 focus:border-[#74512D] focus:ring-2 focus:ring-[#74512D]/20 outline-none transition-all bg-[#F8F4E1]/20"
          placeholder="Enter verification code"
        />
        <div class="flex justify-between items-center">
          <p class="text-sm text-[#74512D]/70 italic">
            Enter the verification code sent to your email
          </p>
          <button 
            @click.prevent="resendVerificationCode" 
            :disabled="resendCooldown > 0"
            class="text-sm text-[#74512D] hover:text-[#543310] font-medium disabled:opacity-50"
          >
            {{ resendButtonText }}
          </button>
        </div>
      </div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          :disabled="isLoading || !isFormValid"
          class="w-full bg-gradient-to-r from-[#74512D] to-[#543310] text-[#F8F4E1] py-3 rounded-lg font-medium hover:from-[#543310] hover:to-[#74512D] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <span v-if="isLoading" class="flex items-center justify-center space-x-2">
            <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <span>Processing...</span>
          </span>
          <span v-else>{{ submitButtonText }}</span>
        </button>

        <!-- Error/Success Messages -->
        <div class="text-center">
          <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
          <p v-if="success" class="text-green-600 text-sm">{{ success }}</p>
        </div>

        <!-- Login Link -->
        <p class="text-center text-[#74512D]">
          Already have an account? 
          <router-link to="/login" class="font-medium text-[#543310] hover:underline">
            Sign in here
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RegisterForm',
  data() {
    return {
      formData: {
        username: '',
        email: '',
        password: ''
      },
      isLoading: false,
      error: '',
      success: '',
      emailError: '',
      passwordError: '',
      showVerification: false,
      verificationCode: '',
      hasMinLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false,
      resendCooldown: 0,
      resendTimer: null
    }
  },
  computed: {
    isFormValid() {
      return this.formData.username &&
             this.formData.email &&
             this.formData.password &&
             !this.emailError &&
             !this.passwordError &&
             this.hasMinLength &&
             this.hasUpperCase &&
             this.hasLowerCase &&
             this.hasNumber &&
             this.hasSpecialChar;
    },
    submitButtonText() {
      if (this.isLoading) return 'Loading...';
      if (this.showVerification) return 'Verifikasi';
      return 'Register';
    },
    resendButtonText() {
      if (this.resendCooldown > 0) {
        return `Resend in ${this.resendCooldown}s`;
      }
      return 'Resend code';
    }
  },
  watch: {
    'formData.password': {
      handler(newValue) {
        this.validatePasswordRequirements(newValue);
      },
      immediate: true
    }
  },
  methods: {
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.formData.email)) {
        this.emailError = 'Format email tidak valid';
        return false;
      }
      this.emailError = '';
      return true;
    },

    validatePasswordRequirements(password) {
      this.hasMinLength = password.length >= 8;
      this.hasUpperCase = /[A-Z]/.test(password);
      this.hasLowerCase = /[a-z]/.test(password);
      this.hasNumber = /[0-9]/.test(password);
      this.hasSpecialChar = /[!@#$%^&*]/.test(password);
    },

    validatePassword() {
      if (!this.formData.password) {
        this.passwordError = 'Password harus diisi';
        return false;
      }

      if (!this.hasMinLength || !this.hasUpperCase || !this.hasLowerCase || 
          !this.hasNumber || !this.hasSpecialChar) {
        this.passwordError = 'Password tidak memenuhi persyaratan';
        return false;
      }

      this.passwordError = '';
      return true;
    },
    async handleRegister() {
  if (!this.isFormValid) return;
  
  this.isLoading = true;
  this.error = '';
  this.success = '';

  try {
    if (!this.showVerification) {
      const { data } = await axios.post('http://localhost:5000/register', {
        ...this.formData,
        requestVerification: true
      });
      
      this.success = data.message || 'Kode verifikasi telah dikirim ke email Anda';
      this.showVerification = true;
    } else {
      const { data } = await axios.post('http://localhost:5000/verify', {
        email: this.formData.email,
        verificationCode: this.verificationCode
      });

      this.success = data.message || 'Registrasi berhasil! Silakan login.';
      setTimeout(() => {
        this.$router.push('/login');
      }, 2000);
    }
  } catch (error) {
    this.error = error.response?.data?.message || 'Registrasi gagal';
  } finally {
    this.isLoading = false;
  }
},

async resendVerificationCode() {
      if (this.resendCooldown > 0) return;

      this.isLoading = true;
      this.error = '';

      try {
        await axios.post('http://localhost:5000/register', {
          email: this.formData.email,
          username: this.formData.username,
          password: this.formData.password,
          requestVerification: true
        });

        this.success = 'New verification code has been sent to your email';
        this.startResendCooldown();
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to resend verification code';
      } finally {
        this.isLoading = false;
      }
    },

    startResendCooldown() {
      this.resendCooldown = 60; // 60 seconds cooldown
      this.resendTimer = setInterval(() => {
        if (this.resendCooldown > 0) {
          this.resendCooldown--;
        } else {
          clearInterval(this.resendTimer);
        }
      }, 1000);
    },
  },
  beforeUnmount() {
  if (this.resendTimer) {
    clearInterval(this.resendTimer);
  }
}
}
  

</script>
