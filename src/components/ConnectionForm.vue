<template>
    <div id="connection-form">
        <h2>Connect to a Command and Control server</h2>
        <form @submit.prevent="handleSubmit">
            <div>
                <label>URL</label>
                <input
                    type="url"
                    v-model="c2.url"
                    placeholder="http://127.0.0.1/5000"
                    @focus="clearStatus"
                    @keypress="clearStatus"
                />
            </div>
            <div>
                <label>Password</label>
                <input
                    type="password"
                    v-model="c2.password"
                    @focus="clearStatus"
                    @keypress="clearStatus"
                />
            </div>
            <p v-if="error && submitting" class="error-message">
                You must fill all fields.
            </p>
            <button>Connect!</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'connection-form',

    data() {
        return {
            submitting: false,
            error: false,
            success: false,
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

            if (this.invalidURL || this.invalidPassword)
                this.error = true;
            else {
                this.error = false
                this.success = true
                this.submitting = false
            }
        },

        clearStatus() {
            this.success = false
            this.error = false
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
    padding: 1em;
    background-color: #424242;
    color: white;
}

input {
    margin-left: 1em;
}

label {
    display: inline-block;
    width: 100px;
    text-align: right;
}

.error-message {
    color: #d33c40;
}
</style>