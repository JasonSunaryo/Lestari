<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F4E1] to-[#AF8F6F]/20">
    <div class="text-center">
      <svg class="animate-spin h-10 w-10 mx-auto text-[#74512D]" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      <p class="mt-4 text-[#74512D]">Please wait, redirecting...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthSuccess',
  created() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const data = JSON.parse(decodeURIComponent(urlParams.get('data')));
      const forceRefresh = urlParams.get('forceRefresh') === 'true';

      // Save user data
      localStorage.setItem('user', JSON.stringify(data));

      // Handle redirect with force refresh
      if (forceRefresh) {
        // Use replace state to clean up the URL before refreshing
        window.history.replaceState({}, document.title, '/');
        window.location.reload();
      } else {
        this.$router.push('/');
      }
    } catch (error) {
      console.error('Error processing auth callback:', error);
      window.location.href = '/login';
    }
  }
}
</script>