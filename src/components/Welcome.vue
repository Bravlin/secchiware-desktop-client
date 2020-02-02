<template>
    <div>
        <img alt="Secchiware logo" src="../assets/secchiware_logo.png">
        <h1>Welcome to Secchiware Desktop Client!</h1>
        <ConnectionForm />
    </div>
</template>

<script>
import ConnectionForm from './ConnectionForm.vue'

export default {
    name: 'Welcome',
    components: {
        ConnectionForm
    }
}
</script>

<style scoped>
img {
    width: 250px;
    height: 250px;
}
</style>