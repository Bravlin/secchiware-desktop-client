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
            <test-packages :packages="availablePackages" />
        </b-card-group>
    </div>
</template>

<script>
import TestPackages from './components/TestPackages.vue';

export default {
    name: 'command-control-panel',

    components: {
        'test-packages': TestPackages
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