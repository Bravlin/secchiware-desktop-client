<template>
  <div id="app">
    <layout v-if="c2URL" :c2URL="c2URL" />
    <welcome v-else @newC2URLProvided="newC2URL" />
  </div>
</template>

<script>
import Layout from './components/Layout.vue'
import Welcome from './components/Welcome.vue'

export default {
  name: 'app',

  components: {
    'layout': Layout,
    'welcome': Welcome,
  },

  data() {
    return {
      c2URL: ''
    }
  },

  methods: {
    newC2URL(c2URL) {
      this.c2URL = c2URL;
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
