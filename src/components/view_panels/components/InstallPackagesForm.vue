<template>
    <b-container fluid>
        <b-form @submit.prevent="handleSubmit">
            <b-row>
                <b-col class="black-background py-3" cols="6">
                    <h5>
                        Available packages
                        <b-icon-arrow-repeat class="clickable" @click="refreshAvailablePackages" />
                    </h5>
                    <b-form-checkbox-group
                        id="install-packages-checkbox"
                        v-model="selected"
                        :options="packagesOptions"
                        name="available-package"
                        stacked
                    />
                </b-col>
                <b-col cols="6" class="text-center py-3">
                    <b-button
                        type="submit"
                        variant="dark"
                        class="mt-1"
                        :disabled="this.selected.length === 0"
                    >
                        Install
                    </b-button>
                </b-col>
            </b-row>
        </b-form>
    </b-container>
</template>

<script>
import modals from '../../../mixins/modals.js';
import crypto from 'crypto';
import signatures from '../../../scripts/signatures.js';

export default {
    name: 'install-packages-form',

    mixins: [modals],

    data() {
        return {
            selected: [],
        };
    },

    props: {
        c2URL: {
            type: String,
            required: true
        },
        c2Password: {
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
        refreshAvailablePackages() {
            this.$emit('refreshAvailablePackagesRequested');
        },

        async handleSubmit() {
            if (this.selected.length === 0)
                this.showErrorModal('You must select at least one package.');
            else {
                const canonicalURL = `/environments/${this.envIP}/${this.envPort}/installed`;
                let preparedRequest, actualRequest, hasher, digest, signature;
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

                signature = signatures.newSignature(
                    this.c2Password,
                    preparedRequest.method,
                    canonicalURL,
                    {
                        signatureHeaders: ['Digest'],
                        headerRecoverer: header => actualRequest.headers.get(header)
                    }
                );
                actualRequest.headers.set(
                    'Authorization',
                    signatures.newAuthorizationHeader('Client', signature, ['Digest'])
                );

                try {
                    let response = await fetch(actualRequest);
                    switch (response.status) {
                        case 204:
                            this.$emit('packagesInstalled');
                            this.showSuccessModal('Packages installed!');
                            this.selected = [];
                            break;
                        case 400:
                        case 401:
                        case 404:
                        case 415:
                        case 500:
                        case 502:
                        case 504:
                            this.showErrorModal((await response.json()).error);
                            break;
                        default:
                            this.showErrorModal(
                                'Unexpected response from Command and Control server when trying '
                                + 'to install some packages in the selected environment.'
                            );
                    }
                } catch (err) {
                    this.showErrorModal(
                        'Something went wrong trying to contact the Command and Control server '
                        + 'when trying to install some packages in the selected environment. '
                        + 'Please, verify that the application is correctly configured.'
                    );
                }
            }
        }
    },

    computed: {
        packagesOptions() {
            var options = [];
            var p;
            for (p of this.c2AvailablePackages)
                options.push({text: p.name, value: p.name});
            return options;
        }
    }
};
</script>

<style scoped>
.black-background {
    background-color: rgb(51, 51, 51);
    color: white;
}

.clickable:hover {
    color: grey;
    cursor: pointer;
}
</style>