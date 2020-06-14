<template>
    <b-container fluid class="pt-5 px-0">
        <img alt="Secchiware logo" src="../assets/secchiware_logo.png">
        <h1 class="my-5 mx-auto">Welcome to Secchiware Desktop Client!</h1>
        <command-control-url-form @newC2ConfigurationProvided="propagateConfigurationProvided" />
    </b-container>
</template>

<script>
import CommandControlURLForm from './CommandControlURLForm.vue'

export default {
    name: 'welcome',

    components: {
        'command-control-url-form': CommandControlURLForm
    },

    methods: {
        propagateConfigurationProvided(c2URL, c2Password) {
            this.$emit('newC2ConfigurationProvided', c2URL, c2Password);
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