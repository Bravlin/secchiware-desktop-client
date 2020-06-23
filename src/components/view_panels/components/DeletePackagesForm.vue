<template>
    <b-container fluid>
        <b-form @submit.prevent="handleSubmit">
            <b-row>
                <b-col class="black-background py-3" cols="6">
                    <h5>
                        Root packages
                        <b-icon-arrow-repeat class="clickable" @click="refreshPackages" />
                    </h5>
                    <b-form-checkbox-group
                        id="delete-packages-checkbox"
                        v-model="selected"
                        :options="rootOptions"
                        name="root-package"
                        stacked
                    />
                </b-col>
                <b-col cols="6" class="text-center py-3">
                    <b-button
                        type="submit"
                        variant="danger"
                        class="mt-1"
                        :disabled="this.selected.length == 0"
                    >
                        Delete
                    </b-button>
                </b-col>
            </b-row>
        </b-form>
    </b-container>
</template>

<script>
import modals from '../../../mixins/modals.js'
import signatures from '../../../scripts/signatures.js'

export default {
    name: 'delete-packages-form',

    mixins: [modals],

    data() {
        return {selected: []};
    },

    props: {
        packages: {
            type: Array,
            required: true
        },
        c2URL: {
            type: String,
            required: true
        },
        c2Password: {
            type: String,
            required: true
        },
        baseEndpoint: {
            type: String,
            required: true
        }
    },

    methods: {
        async handleSubmit() {
            if (this.selected.length == 0)
                this.showErrorModal('You must select at least one package.');
            else {
                let pack, requestInit, canonicalURI, signature, response;
                let deleted = new Set();

                requestInit = {
                    method: 'DELETE',
                    headers: new Headers()
                }
                for (pack of this.selected) {
                    canonicalURI = `${this.baseEndpoint}/${pack}`;
                    signature = signatures.newSignature(
                        this.c2Password,
                        requestInit.method,
                        canonicalURI
                    );
                    requestInit.headers.set(
                        'Authorization',
                        signatures.newAuthorizationHeader('Client', signature)
                    );
                    try {
                        response = await fetch(`${this.c2URL}${canonicalURI}`, requestInit);
                        switch (response.status) {
                            case 404:
                                this.showErrorModal(`Package '${pack}' was not found.`);
                                // falls through
                            case 204:
                                deleted.add(pack);
                                break;
                            default:
                                this.$emit('error', response);
                        }
                    } catch (err) {
                        this.showErrorModal(
                            'Something went wrong when trying to contact the Command and Control '
                            + 'server to delete the packages. Please, verify that the application '
                            + 'is correctly configured.'
                        );
                    }
                }
                if (deleted.size > 0) {
                    this.selected = [];
                    this.$emit('packagesDeleted', deleted);
                }
            }
        },

        refreshPackages() {
            this.$emit('packagesRefreshRequested');
        }
    },

    computed: {
        rootOptions() {
            var options = [];
            var p;
            for (p of this.packages)
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