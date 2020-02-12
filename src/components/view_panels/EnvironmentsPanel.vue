<template>
    <b-container fluid>
        <b-row style="height: 100%">
            <b-col id="environments-list" cols="4" md="3" lg="2">
                <h5>Registered environments</h5>
                <b-form-radio-group
                    v-model="selectedEnv"
                    :options="environmentsListOptions"
                    stacked
                />
            </b-col>
            <b-col cols="8" md="9" lg="10" class="p-5">
                <b-card 
                    v-if="selectedEnv"
                    title="Environment information"
                    align="left"
                    class="mx-auto"
                >
                    <b-card-text>URL: {{ selectedEnv.ip + ':' + selectedEnv.port }}</b-card-text>
                    <b-card-text>Session start: {{ selectedEnv.session_start }}</b-card-text>
                    <b-card-text>Platform: {{ selectedEnv.info.platform }}</b-card-text>
                    <b-card-text>Host name: {{ selectedEnv.info.node }}</b-card-text>
                    <b-card-text class="clickable" @click="toggleHardware">Hardware</b-card-text>
                    <template v-if="hardwareVisible">
                        <b-card-text class="pl-4">
                            Processor: {{ selectedEnv.info.hardware.processor }}
                        </b-card-text>
                        <b-card-text class="pl-4">
                            Architecture: {{ selectedEnv.info.hardware.machine }}
                        </b-card-text>
                    </template>
                    <b-card-text class="clickable" @click="toggleOS">
                        Operating system
                    </b-card-text>
                    <template v-if="osVisible">
                        <b-card-text class="pl-4">
                            System: {{ selectedEnv.info.os.system }}
                        </b-card-text>
                        <b-card-text class="pl-4">
                            Release: {{ selectedEnv.info.os.release }}
                        </b-card-text>
                        <b-card-text class="pl-4">
                            Version: {{ selectedEnv.info.os.version }}
                        </b-card-text>
                    </template>
                    <b-card-text class="clickable" @click="togglePython">Python</b-card-text>
                    <template v-if="pythonVisible">
                        <b-card-text class="pl-4">
                            Version: {{ selectedEnv.info.python.version }}
                        </b-card-text>
                        <b-card-text class="pl-4">
                            Implementation: {{ selectedEnv.info.python.implementation }}
                        </b-card-text>
                        <b-card-text class="pl-4">
                            Compiler: {{ selectedEnv.info.python.compiler }}
                        </b-card-text>
                        <b-card-text class="pl-4">
                            Build: {{ selectedEnv.info.python.build[0]
                                + ' ' + selectedEnv.info.python.build[1] }}
                        </b-card-text>
                    </template>
                </b-card>
                <test-packages v-if="installedPackages" :packages="installedPackages" />
                <reports
                    v-if="selectedEnv"
                    :c2URL="c2.url"
                    :ip="selectedEnv.ip"
                    :port="selectedEnv.port"
                />
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import TestPackages from './components/TestPackages.vue';
import Reports from './components/Reports.vue'

export default {
    name: 'environments-panel',

    components: {
        TestPackages,
        Reports
    },

    data() {
        return {
            selectedEnv: null,
            hardwareVisible: false,
            osVisible: false,
            pythonVisible: false,
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
        selectedEnv: function (env) {
            this.installedPackages = [];

            let ip = env.ip;
            let port = env.port;
            fetch(`${this.c2.url}/environments/${ip}/${port}/installed`)
            .then(response => response.json())
            .then(data => {
                this.installedPackages = data;
            });
        }
    },

    methods: {
        toggleHardware() {
            this.hardwareVisible = !this.hardwareVisible;
        },

        toggleOS() {
            this.osVisible = !this.osVisible;
        },

        togglePython() {
            this.pythonVisible = !this.pythonVisible;
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
</style>