<template>
    <div id="connection-form" class="row justify-content-center p-3">
        <h2 class="col-12">Connect to a Command and Control server:</h2>
        <b-form 
            @submit.prevent="handleSubmit"
            class="col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3 row justify-content-center"
        >
            <b-form-group
                id="c2-url-fieldset"
                label="URL"
                label-for="c2-url"
                label-cols="4"
                label-align="right"
                class="col-12 mt-3"
            >
                <b-form-input
                    id="c2-url"
                    type="url"
                    v-model="c2.url"
                    placeholder="http://127.0.0.1/5000"
                    @focus="clearStatus"
                    @keypress="clearStatus"
                ></b-form-input>
            </b-form-group>
            <b-form-group
                id="c2-password-fieldset"
                label="Password"
                label-for="c2-password"
                label-cols="4"
                label-align="right"
                class="col-12 mt-3"
            >
                <b-form-input
                    id="c2-password"
                    type="password"
                    v-model="c2.password"
                    @focus="clearStatus"
                    @keypress="clearStatus"
                ></b-form-input>
            </b-form-group>
            <b-alert v-model="error" variant="danger" dismissible class="col-12 mt-3">
                {{ this.errorMessage }}
            </b-alert>
            <b-button type="submit" variant="light" class="my-3">Connect!</b-button>
        </b-form>
    </div>
</template>

<script>
export default {
    name: 'connection-form',

    data() {
        return {
            error: false,
            errorMessage: '',
            c2: {
                url: '',
                password: ''
            }
        }
    },

    methods: {
        handleSubmit() {
            this.submitting = true;
            this.clearStatus();

            if (this.invalidURL || this.invalidPassword) {
                this.error = true;
                this.errorMessage = 'You must fill all fields.';
            }
            else {
                fetch(this.c2.url + '/environments')
                .then(() => {
                    this.error = false;
                    this.$emit('connected', this.c2);
                })
                .catch(error => {
                    this.error = true;
                    this.errorMessage = error.message;
                });
            }
        },

        clearStatus() {
            this.error = false;
            this.errorMessage = '';
        }
    },

    computed: {
        invalidURL() {
            return this.c2.url === '';
        },

        invalidPassword() {
            return this.c2.password === '';
        }
    }
}
</script>

<style scoped>
#connection-form {
    background-color: #424242;
    color: white;
}
</style>