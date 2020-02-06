<template>
  <div id="app">
    <layout v-if="c2" :c2="c2"/>
    <welcome v-else @connected="newConnection" />
  </div>
</template>

<script>
import Layout from './components/Layout.vue'
import Welcome from './components/Welcome.vue'

export default {
  name: 'app',

  components: {
    Layout,
    Welcome,
  },

  data() {
    return {
      c2: null
    }
  },

  methods: {
    newConnection(c2) {
      this.c2 = c2;
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  min-height: 100vh;
}
</style>
