<template>
    <b-form @submit.prevent="">
        <b-form-group
            id="packages-fieldset"
            label="Packages"
            label-for="packages-to-upload"
            label-cols="4"
            label-align="right"
        >
            <b-form-file
                id="packges-to-upload"
                v-model="packagesToUpload"
                :state="Boolean(packagesToUpload)"
                accept=".tar.gz"
                placeholder="Choose or drop here a tar.gz file..."
            ></b-form-file>
        </b-form-group>
        <b-form-group
            id="password-fieldset"
            label="Password"
            label-for="password"
            label-cols="4"
            label-align="right"
        >
            <b-form-input
                id="password"
                type="password"
                v-model="password"
            ></b-form-input>
        </b-form-group>
        <b-alert v-model="error" variant="danger" dismissible>
            {{ this.errorMessage }}
        </b-alert>
        <b-button type="submit" variant="dark">Upload</b-button>
    </b-form>
</template>

<script>
export default {
    name: 'upload-packages-form',

    data() {
        return {
            error: false,
            errorMessage: '',
            packagesToUpload: null,
            password: '',
        };
    },

    methods: {
        handleSubmit() {
            this.clearStatus();

            if (this.invalidFile || this.invalidPassword) {
                this.error = true;
                this.errorMessage = 'You must fill all fields.';
            } else {
                
            }
        },

        clearStatus() {
            this.error = false;
            this.errorMessage = '';
        }
    },

    computed: {
        invalidFile() {
            return this.packagesToUpload == null;
        },

        invalidPassword() {
            return this.password === '';
        }
    }
};
</script>