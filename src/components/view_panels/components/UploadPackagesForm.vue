<template>
    <b-form class="text-center p-3" @submit.prevent="handleSubmit">
        <b-form-group
            id="packages-fieldset"
            label="Packages"
            label-cols="3"
            label-cols-md="2"
            label-cols-xl="1"
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
            label-for="upload-packages-password"
            label-cols="3"
            label-cols-md="2"
            label-cols-xl="1"
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
                hasher.update(new Uint8Array(await preparedRequest.arrayBuffer()));
                digest = hasher.digest('base64');
                actualRequest.headers.append('Digest', `sha-256=${digest}`);

                signature = Vue.newSignature(
                    this.password,
                    preparedRequest.method,
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
                        case 204:
                            this.$emit('packagesUploaded');
                            alert('Packages uploaded!');
                            break;
                        case 400:
                        case 401:
                        case 415:
                            alert((await response.json()).error);
                            break;
                        default:
                            alert('Unexpected response from Command and Control server.');
                    }
                } catch (err) {
                    alert('Something went wrong trying to contact the Command and Control server.');
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