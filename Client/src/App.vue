<template>
  <div>
    <NavBar />
    <router-view></router-view>
<MainFooter></MainFooter>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import MainFooter from './components/MainFooter.vue'
export default {
  name: 'App',
  components: {
    NavBar,
   MainFooter
  }
}
</script>

<style>
/* Your styles here */
</style>