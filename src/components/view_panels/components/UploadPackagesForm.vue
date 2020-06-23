<template>
    <b-form class="text-center p-3" @submit.prevent="handleSubmit">
        <b-form-group
            id="packages-fieldset"
            label="Packages"
            label-align="left"
        >
            <b-form-file
                id="packges-to-upload"
                v-model="packagesToUpload"
                :state="Boolean(packagesToUpload)"
                accept=".tar.gz"
                placeholder="Choose or drop here a tar.gz file..."
            />
        </b-form-group>
        <b-button type="submit" variant="dark" class="mt-3" :disabled="!packagesToUpload">
            Upload
        </b-button>
    </b-form>
</template>

<script>
import modals from '../../../mixins/modals.js'
import crypto from 'crypto';
import signatures from '../../../scripts/signatures.js'

export default {
    name: 'upload-packages-form',

    mixins: [modals],

    props: {
        c2URL: {
            type: String,
            required: true
        },
        c2Password: {
            type: String,
            required: true
        }
    },

    data() {
        return {packagesToUpload: null};
    },

    methods: {
        async handleSubmit() {
            const url = `${this.c2URL}/test_sets`;
            var preparedRequest, actualRequest, requestBody;
            var hasher, digest, signature;

            if (!this.packagesToUpload)
                this.showErrorModal('You must provide a file.');
            else {
                requestBody = new FormData();
                requestBody.append('packages', this.packagesToUpload);
                preparedRequest = new Request(url, {method: 'PATCH', body: requestBody});
                actualRequest = preparedRequest.clone();

                hasher = crypto.createHash('sha256');
                hasher.update(new Uint8Array(await preparedRequest.arrayBuffer()));
                digest = hasher.digest('base64');
                actualRequest.headers.append('Digest', `sha-256=${digest}`);

                signature = signatures.newSignature(
                    this.c2Password,
                    preparedRequest.method,
                    '/test_sets',
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
                            this.$emit('packagesUploaded');
                            this.showSuccessModal('Packages uploaded!');
                            this.packagesToUpload = null;
                            break;
                        case 400:
                        case 401:
                        case 415:
                            this.showErrorModal((await response.json()).error);
                            break;
                        default:
                            this.showErrorModal(
                                'Unexpected response from Command and Control server when trying '
                                + 'to upload packages.'
                            );
                    }
                } catch (err) {
                    this.showErrorModal(
                        'Something went wrong trying to contact the Command and Control server '
                        + 'to upload some packages. Please, verify that the application is '
                        + 'correctly configured.');
                }
            }
        },
    }
};
</script>