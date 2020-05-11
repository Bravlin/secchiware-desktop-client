<template>
    <div class="p-5">
        <b-card-group columns>
            <b-card title="General information" align="left">
                <b-card-text>URL: {{ c2URL }}</b-card-text>
                <b-card-text>
                    Number of currently connected environments: {{ environmentsCount }}
                </b-card-text>
                <b-card-text>
                    Number of available test packages: {{ availablePackagesCount }}
                </b-card-text>
            </b-card>
            <b-card title="Tests repository" align="left">
                <b-tabs pills active-nav-item-class="bg-secondary" nav-class="bg-dark">
                    <b-tab title="Explore" title-link-class="text-light" active>
                        <test-packages :packages="availablePackages" />
                    </b-tab>
                    <b-tab title="Upload" title-link-class="text-light">
                        <upload-packages-form :c2URL="c2URL" />
                    </b-tab>
                    <b-tab title="Delete" title-link-class="text-light">
                        <delete-packages-form
                            :packages="availablePackages"
                            :c2URL="c2URL"
                            baseEndpoint="/test_sets"
                            @error="deletePackageError"
                            @packagesDeleted="propagatePackagesDeleted"
                        />
                    </b-tab>
                </b-tabs>
            </b-card>
        </b-card-group>
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
        environments: {
            type: Object,
            required: true
        },
        availablePackages: {
            type: Array,
            required: true
        }
    },

    methods: {
        async deletePackageError(response) {
            if (response.status == 401 || response.status == 404)
                alert((await response.json()).error);
            else
                alert("Unexpected response from Command and Control server.");
        },

        propagatePackagesDeleted() {
            this.$emit('packagesDeleted');
        }
    },

    computed: {
        availablePackagesCount() {
            return this.availablePackages.length;
        },

        environmentsCount() {
            let res = 0;
            for (let host in this.environments)
                res += Object.keys(this.environments[host]).length;
            return res;
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
</style>