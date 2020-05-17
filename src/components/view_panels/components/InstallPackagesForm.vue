<template>
    <b-container fluid>
        <b-form @submit.prevent="handleSubmit">
            <b-row>
                <b-col class="black-background py-3" cols="6">
                    <h5>Available packages</h5>
                    <b-form-checkbox-group
                        id="install-packages-checkbox"
                        v-model="selected"
                        :options="packagesOptions"
                        name="available-package"
                    />
                </b-col>
                <b-col cols="6" class="text-center py-3">
                    <b-form-group
                        id="install-packages-password-fieldset"
                        label="Password"
                        label-for="install-packages-password"
                        label-cols="5"
                        label-cols-md="4"
                        label-cols-xl="3"
                        label-align="right"
                    >
                        <b-form-input
                            id="install-packages-password"
                            type="password"
                            v-model="password"
                        />
                    </b-form-group>
                    <b-alert v-model="error" variant="danger" dismissible>
                        {{ this.errorMessage }}
                    </b-alert>
                    <b-button type="submit" variant="dark" class="mt-1">Install</b-button>
                </b-col>
            </b-row>
        </b-form>
    </b-container>
</template>

<script>
import Vue from 'vue';
const crypto = require('crypto');

export default {
    name: 'install-packages-form',

    data() {
        return {
            selected: [],
            password: '',
            error: false,
            errorMessage: ''
        };
    },

    props: {
        c2URL: {
            type: String,
            required: true
        },
        c2AvailablePackages: {
            type: Array,
            required: true
        },
        envIP: {
            type: String,
            required: true
        },
        envPort: {
            type: Number,
            required: true
        }
    },

    methods: {
        async handleSubmit() {
            const canonicalURL = `/environments/${this.envIP}/${this.envPort}/installed`
            var preparedRequest, actualRequest, hasher, digest, signature;

            this.clearStatus();

            if (this.invalidSelection || this.invalidPassword) {
                this.error = true;
                this.errorMessage = 'You must fill all fields.';
            } else {
                preparedRequest = new Request (
                    this.c2URL + canonicalURL,
                    {
                        method: 'PATCH',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(this.selected)
                    }
                );
                actualRequest = preparedRequest.clone();

                hasher = crypto.createHash('sha256');
                hasher.update(new Uint8Array(await preparedRequest.arrayBuffer()));
                digest = hasher.digest('base64');
                actualRequest.headers.append('Digest', `sha-256=${digest}`);

                signature = Vue.newSignature(
                    this.password,
                    preparedRequest.method,
                    canonicalURL,
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
                            this.$emit('packagesInstalled');
                            alert('Packages installed!');
                            break;
                        case 400:
                        case 401:
                        case 404:
                        case 415:
                        case 500:
                        case 502:
                        case 504:
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
        packagesOptions() {
            var options = [];
            var p;
            for (p of this.c2AvailablePackages)
                options.push({text: p.name, value: p.name});
            return options;
        },

        invalidSelection() {
            return this.selected.length === 0;
        },

        invalidPassword() {
            return this.password === '';
        }
    }
};
</script>

<style scoped>
.black-background {
    background-color: rgb(51, 51, 51);
    color: white;
}
</style>