<template>
    <div class="p-5">
        <b-card
            title="Command and Control server's configuration"
            align="left"
            class="command-control-panel-b-card mx-auto"
        >
            <b-form-group
                id="c2-url-fieldset"
                label="URL"
                label-for="c2-url"
            >
                <b-form-input
                    id="c2-url"
                    type="url"
                    v-model="fieldC2URL"
                    placeholder="http://127.0.0.1/5000"
                    :disabled="!editEnabled"
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
                    v-model="fieldC2Password"
                    :disabled="!editEnabled"
                />
            </b-form-group>
            <div class="mt-4">
                <b-button variant="dark" :hidden="editEnabled" @click="editEnabled = true">
                    Edit
                </b-button>
                <b-button variant="secondary" :hidden="!editEnabled" @click="cancelEdition">
                    Cancel
                </b-button>
                <b-button
                    variant="dark"
                    :hidden="!editEnabled"
                    :disabled="!validConfiguration"
                    class="ml-3"
                    @click="setC2Configuration"
                >
                    Confirm
                </b-button>
            </div>
        </b-card>
        <b-card
            title="Tests repository"
            align="left"
            class="command-control-panel-b-card mx-auto mt-5"
        >
            <b-tabs pills active-nav-item-class="bg-secondary" nav-class="bg-dark">
                <b-tab title="Explore" title-link-class="text-light" active>
                    <test-packages
                        :packages="availablePackages"
                        @packagesRefreshRequested="refreshPackages"
                    />
                </b-tab>
                <b-tab title="Upload" title-link-class="text-light">
                    <upload-packages-form
                        :c2URL="c2URL"
                        :c2Password="c2Password"
                        @packagesUploaded="refreshPackages"
                    />
                </b-tab>
                <b-tab title="Delete" title-link-class="text-light">
                    <delete-packages-form
                        :packages="availablePackages"
                        :c2URL="c2URL"
                        :c2Password="c2Password"
                        baseEndpoint="/test_sets"
                        @error="deletePackageError"
                        @packagesDeleted="propagatePackagesDeleted"
                        @packagesRefreshRequested="refreshPackages"
                    />
                </b-tab>
            </b-tabs>
        </b-card>
    </div>
</template>

<script>
import TestPackages from './components/TestPackages.vue';
import UploadPackagesForm from './components/UploadPackagesForm.vue';
import DeletePackagesForm from './components/DeletePackagesForm.vue';

export default {
    name: 'command-control-panel',

    components: {
        'test-packages': TestPackages,
        'upload-packages-form': UploadPackagesForm,
        'delete-packages-form': DeletePackagesForm
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
        availablePackages: {
            type: Array,
            required: true
        }
    },

    data() {
        return {
            fieldC2URL: this.c2URL,
            fieldC2Password: this.c2Password,
            editEnabled: false
        };
    },

    methods: {
        async deletePackageError(response) {
            if (response.status == 401)
                this.$bvModal.msgBoxOk((await response.json()).error);
            else
                this.$bvModal.msgBoxOk('Unexpected response from Command and Control server.');
        },

        cancelEdition() {
            this.editEnabled = false;
            this.fieldC2URL = this.c2URL;
            this.fieldC2Password = this.c2Password;
        },

        setC2Configuration() {
            if (!this.validConfiguration)
                this.$bvModal.msgBoxOk(
                    'You must provide both an URL and a password for the desired Command and '
                    + 'Control server.'
                );
            else {
                this.$emit('newC2Configuration', this.fieldC2URL, this.fieldC2Password);
                this.editEnabled = false;
            }
        },

        refreshPackages() {
            this.$emit('packagesRefreshRequested');
        },

        propagatePackagesDeleted(deletedPackages) {
            this.$emit('packagesDeleted', deletedPackages);
        }
    },

    computed: {
        validConfiguration() {
            return this.fieldC2URL && this.fieldC2Password;
        }
    }
};
</script>

<style scoped>
@media (min-width: 576px) {
    .card-columns {
        column-count: 1;
    }
}

@media (min-width: 992px) {
    .card-columns {
        column-count: 2;
    }
}

.command-control-panel-b-card {
    max-width: 800px;
}
</style>