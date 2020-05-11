<template>
    <b-form @submit.prevent="handleSubmit">
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
            id="upload-packages-password-fieldset"
            label="Password"
            label-for="password"
            label-cols="4"
            label-align="right"
        >
            <b-form-input
                id="upload-packages-password"
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
import Vue from 'vue';
const crypto = require('crypto');

export default {
    name: 'upload-packages-form',

    props: {
        c2URL: {
            type: String,
            required: true
        }
    },

    data() {
        return {
            error: false,
            errorMessage: '',
            packagesToUpload: null,
            password: '',
        };
    },

    methods: {
        async handleSubmit() {
            const url = `${this.c2URL}/test_sets`;
            var preparedRequest, actualRequest, requestBody;
            var hasher, digest, signature;

            this.clearStatus();

            if (this.invalidFile || this.invalidPassword) {
                this.error = true;
                this.errorMessage = 'You must fill all fields.';
            } else {
                requestBody = new FormData();
                requestBody.append('packages', this.packagesToUpload);
                preparedRequest = new Request(url, {method: 'PATCH', body: requestBody});
                actualRequest = preparedRequest.clone();

                hasher = crypto.createHash('sha256');
                hasher.update(await preparedRequest.text());
                digest = hasher.digest('base64');
                console.log(digest);
                actualRequest.headers.append('Digest', `sha-256=${digest}`);

                signature = Vue.newSignature(
                    this.password,
                    'GET',
                    '/test_sets',
                    {
                        signatureHeaders: ['Digest'],
                        headerRecoverer: header => actualRequest.headers.get(header)
                    }
                );
                actualRequest.headers.set(
                    'Authorization',
                    Vue.newAuthorizationHeader('Client', signature, ['Digest'])
                );

                try {
                    let response = await fetch(actualRequest);
                    switch (response.status) {
                        case 400:
                        case 401:
                        case 415:
                            alert((await response.json()).error);
                    }
                } catch (err) {
                    console.log(err);
                    alert('Something went wrong');
                }
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