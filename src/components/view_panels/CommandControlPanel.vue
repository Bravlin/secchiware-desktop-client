<template>
    <div class="p-5">
        <b-card-group columns>
            <b-card title="General information" align="left">
                <b-card-text>URL: {{ c2.url }}</b-card-text>
                <b-card-text>Connected since: {{ formattedSessionStart }}</b-card-text>
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
        TestPackages
    },

    props: {
        c2: {
            type: Object,
            required: true
        },
        sessionStart: {
            type: Date,
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
        formattedSessionStart() {
            let date = this.sessionStart;
            return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
                + ` ${date.getHours()}:${date.getMinutes()}`;
        },

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