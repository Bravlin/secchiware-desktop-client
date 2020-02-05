<template>
    <div class="p-5">
        <div class="d-flex">
            <b-card title="General information" align="left" class="mx-auto">
                <b-card-text>URL: {{ c2.url }}</b-card-text>
                <b-card-text>Connected since: {{ formattedSessionStart }}</b-card-text>
                <b-card-text>
                    Number of currently connected environments: {{ environmentsCount }}
                </b-card-text>
                <b-card-text>
                    Number of available test packages: {{ availablePackagesCount }}
                </b-card-text>
            </b-card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'command-control-panel',

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