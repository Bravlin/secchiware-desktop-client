<template>
    <b-container fluid class="connection-form p-5">
        <h2 class="mb-5">Specify a Command and Control server:</h2>
        <b-row align-h="center">
            <b-col cols="12" sm="8" md="6" lg="4" xl="3">
                <b-form @submit.prevent="handleSubmit">
                    <b-form-group
                        id="c2-url-fieldset"
                        label="URL"
                        label-for="c2-url"
                        class="mb-4"
                    >
                        <b-form-input
                            id="c2-url"
                            type="url"
                            v-model="c2URL"
                            placeholder="http://127.0.0.1/5000"
                            @focus="clearStatus"
                            @keypress="clearStatus"
                        />
                    </b-form-group>      
                    <b-alert v-model="error" variant="danger" dismissible class="mb-4">
                        {{ this.errorMessage }}
                    </b-alert>
                    <b-button type="submit" variant="light">Start!</b-button>
                </b-form>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
export default {
    name: 'command-control-url-form',

    data() {
        return {
            error: false,
            errorMessage: '',
            c2URL: ''
        };
    },

    methods: {
        handleSubmit() {
            this.clearStatus();

            if (this.invalidURL) {
                this.error = true;
                this.errorMessage = 'You must provide an URL.';
            } else
                this.$emit('newC2URLProvided', this.c2URL);
        },

        clearStatus() {
            this.error = false;
            this.errorMessage = '';
        }
    },

    computed: {
        invalidURL() {
            return this.c2URL === '';
        }
    }
}
</script>

<style scoped>
.connection-form {
    background-color: #424242;
    color: white;
}
</style>