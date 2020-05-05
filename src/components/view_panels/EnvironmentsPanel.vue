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
                        v-if="selectedEnv && envPlatform"
                        :env="selectedEnv"
                        :envPlatform="envPlatform"
                    />
                    <test-packages v-if="installedPackages" :packages="installedPackages" />
                    <reports
                        v-if="selectedEnv"
                        :c2URL="c2URL"
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
        'environment-information': EnvironmentInformation,
        'test-packages': TestPackages,
        'reports': Reports
    },

    data() {
        return {
            selectedEnv: null,
            envPlatform: null,
            installedPackages: null
        };
    },

    props: {
        c2URL: {
            type: String,
            required: true,
        },
        envs: {
            type: Object,
            required: true
        }
    },

    watch: {
        selectedEnv: async function (env) {
            let responseInstalled, responsePlatform, msg;
            let ip = env.ip;
            let port = env.port;

            this.installedPackages = [];
            try {
                responseInstalled = await fetch(`${this.c2URL}/environments/${ip}/${port}/installed`);
                if (responseInstalled.status == 200)
                    this.installedPackages = await responseInstalled.json();
                else if (responseInstalled.status == 404 || responseInstalled.status == 502 || responseInstalled.status == 504) {
                    msg = await responseInstalled.json();
                    alert(msg.error);
                } else
                    alert("Unexpected response from the Command an Control server when trying to recover the selected environment's installed tests.");
            } catch (err) {
                alert("Something went wrong when trying to recover the environment's installed tests.");
            }

            try {
                responsePlatform = await fetch(`${this.c2URL}/environments/${ip}/${port}/info`);
                if (responsePlatform.status == 200)
                    this.envPlatform = await responsePlatform.json();
                else if (responsePlatform.status == 404) {
                    msg = await responsePlatform.json();
                    alert(msg.error);
                } else
                    alert("Unexpected response from the Command an Control server when trying to recover the selected environment's platform information.");
            } catch (err) {
                alert("Something went wrong when trying to recover the environment's platform information.");
            }
        }
    },

    computed: {
        environmentsListOptions() {
            let options = [];
            for (const [ip, ports] of Object.entries(this.envs))
                for (const [port, sessionInfo] of Object.entries(ports))
                    options.push({
                        text: ip + ':' + port,
                        value: {ip: ip, port: port, ...sessionInfo}
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