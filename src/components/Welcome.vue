<template>
    <b-container fluid class="pt-5 px-0">
        <img alt="Secchiware logo" src="../assets/secchiware_logo.png">
        <h1 class="my-5 mx-auto">Welcome to Secchiware Desktop Client!</h1>
        <connection-form @connected="propagateConnection" />
    </b-container>
</template>

<script>
import ConnectionForm from './ConnectionForm.vue'

export default {
    name: 'welcome',

    components: {
        ConnectionForm
    },

    methods: {
        propagateConnection(c2) {
            this.$emit('connected', c2);
        }
    }
}
</script>

<style scoped>
img {
    width: 250px;
    height: 250px;
}
</style>