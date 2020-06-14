<template>
    <div class="p-5">
        <b-card
            title="Command and Control server's general information"
            align="left"
            class="command-control-panel-b-card mx-auto"
        >
            <b-card-text>URL: {{ c2URL }}</b-card-text>
            <b-card-text>
                Number of available test packages: {{ availablePackagesCount }}
            </b-card-text>
        </b-card>
        <b-card
            title="Tests repository"
            align="left"
            class="command-control-panel-b-card mx-auto mt-5"
        >
            <b-tabs pills active-nav-item-class="bg-secondary" nav-class="bg-dark">
                <b-tab title="Explore" title-link-class="text-light" active>
                    <test-packages :packages="availablePackages" />
                </b-tab>
                <b-tab title="Upload" title-link-class="text-light">
                    <upload-packages-form
                        :c2URL="c2URL"
                        :c2Password="c2Password"
                        @packagesUploaded="propagatePackagesUploaded"
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

    methods: {
        async deletePackageError(response) {
            if (response.status == 401)
                alert((await response.json()).error);
            else
                alert("Unexpected response from Command and Control server.");
        },

        propagatePackagesUploaded() {
            this.$emit('packagesUploaded');
        },

        propagatePackagesDeleted() {
            this.$emit('packagesDeleted');
        }
    },

    computed: {
        availablePackagesCount() {
            return this.availablePackages.length;
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