<template>
    <b-container fluid>
        <b-row style="height: 100%">
            <b-col id="environments-list" cols="5" md="4" lg="3" xl="2">
                <h5>Registered environments</h5>
                <b-form-radio-group
                    v-model="selectedEnv"
                    :options="environmentsListOptions"
                    stacked
                />
            </b-col>
            <b-col cols="7" md="8" lg="9" xl="10" class="p-5">
                <b-card-group columns>
                    <environment-information
                        v-if="selectedEnv"
                        :env="selectedEnv"
                    />
                    <test-packages v-if="installedPackages" :packages="installedPackages" />
                    <reports
                        v-if="selectedEnv"
                        :c2URL="c2.url"
                        :ip="selectedEnv.ip"
                        :port="selectedEnv.port"
                    />
                </b-card-group>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import EnvironmentInformation from './components/EnvironmentInformation.vue';
import TestPackages from './components/TestPackages.vue';
import Reports from './components/Reports.vue'

export default {
    name: 'environments-panel',

    components: {
        EnvironmentInformation,
        TestPackages,
        Reports
    },

    data() {
        return {
            selectedEnv: null,
            installedPackages: null
        };
    },

    props: {
        c2: {
            type: Object,
            required: true,
        },
        envs: {
            type: Object,
            required: true
        }
    },

    watch: {
        selectedEnv: async function (env) {
            this.installedPackages = [];

            let ip = env.ip;
            let port = env.port;
            try {
                let response = await fetch(`${this.c2.url}/environments/${ip}/${port}/installed`);
                this.installedPackages = await response.json();
            } catch (err) {
                alert("Something went wrong when trying to recover the environment's installed tests.");
            }
        }
    },

    computed: {
        environmentsListOptions() {
            let options = [];
            for (const [ip, ports] of Object.entries(this.envs))
                for (const [port, info] of Object.entries(ports))
                    options.push({
                        text: ip + ':' + port,
                        value: {ip: ip, port: port, ...info}
                    });
            return options;
        }
    }
};
</script>

<style scoped>
#environments-list {
    color: white;
    background-color: rgb(51, 51, 51);
}

.clickable:hover {
    color: grey;
    cursor: -webkit-grabbing;
}

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