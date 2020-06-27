<template>
    <b-container fluid class="pt-5 px-0">
        <img alt="Secchiware logo" src="../assets/secchiware_logo.png">
        <h1 class="my-5 mx-auto">Welcome to Secchiware Desktop Client!</h1>
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
                        <b-form-group
                            id="c2-password-fieldset"
                            label="Password"
                            label-for="c2-password"
                        >
                            <b-form-input
                                id="c2-password"
                                type="password"
                                v-model="c2Password"
                            />
                        </b-form-group> 
                        <b-alert v-model="error" variant="danger" dismissible class="mb-4">
                            {{ this.errorMessage }}
                        </b-alert>
                        <b-button class="mt-3" type="submit" variant="light">Start!</b-button>
                    </b-form>
                </b-col>
            </b-row>
        </b-container>
    </b-container>
</template>

<script>

export default {
    name: 'welcome',

    data() {
        return {
            error: false,
            errorMessage: '',
            c2URL: '',
            c2Password: ''
        };
    },

    methods: {
        handleSubmit() {
            this.clearStatus();

            if (this.invalidURL || this.invalidURL) {
                this.error = true;
                this.errorMessage = 'You must complete all fields.';
            } else
                this.$emit('newC2Configuration', this.c2URL, this.c2Password);
        },

        clearStatus() {
            this.error = false;
            this.errorMessage = '';
        }
    },

    computed: {
        invalidURL() {
            return this.c2URL === '';
        },

        invalidPassword() {
            return this.c2Password === '';
        }
    }
}
</script>

<style scoped>
img {
    width: 250px;
    height: 250px;
}

.connection-form {
    background-color: #424242;
    color: white;
}
</style>