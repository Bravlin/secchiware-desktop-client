<template>
    <b-container fluid>
        <b-row style="height: 100%">
            <b-col id="environments-list" cols="5" md="3" lg="3" xl="2">
                <h5>Registered environments</h5>
                <b-form-radio-group
                    v-model="selectedEnv"
                    :options="environmentsListOptions"
                    stacked
                />
            </b-col>
            <b-col cols="7" md="9" lg="9" xl="10" class="p-5">
                <b-card-group columns>
                    <b-card
                        title="Environment information"
                        align="left"
                        v-if="selectedEnv && envPlatform"
                    >
                        <div>IP: {{ selectedEnv.ip }}</div>
                        <div>Port: {{ selectedEnv.port }}</div>
                        <div>Session ID: {{ selectedEnv.session_id }}</div>
                        <div>Session start: {{ selectedEnv.session_start }}</div>
                        <platform-information :platform="envPlatform" />
                    </b-card>
                    <b-card v-if="selectedEnv" title="Tests management" align="left">
                        <b-tabs pills active-nav-item-class="bg-secondary" nav-class="bg-dark">
                            <b-tab title="Explore" title-link-class="text-light" active>
                                <test-packages
                                    v-if="installedPackages"
                                    :packages="installedPackages" 
                                />
                            </b-tab>
                            <b-tab title="Install" title-link-class="text-light">
                                <install-packages-form
                                    :c2URL="c2URL"
                                    :c2Password="c2Password"
                                    :c2AvailablePackages="availablePackages"
                                    :envIP="selectedEnv.ip"
                                    :envPort="selectedEnv.port"
                                    @packagesInstalled="setInstalledPackages(selectedEnv.ip, selectedEnv.port)"
                                />
                            </b-tab>
                            <b-tab title="Uninstall" title-link-class="text-light">
                                <delete-packages-form
                                    :packages="installedPackages"
                                    :c2URL="c2URL"
                                    :c2Password="c2Password"
                                    :baseEndpoint="`/environments/${selectedEnv.ip}/${selectedEnv.port}/installed`"
                                    @error="uninstallPackageError"
                                    @packagesDeleted="setInstalledPackages(selectedEnv.ip, selectedEnv.port)"
                                />
                            </b-tab>
                        </b-tabs>
                    </b-card>
                    <b-card v-if="selectedEnv"  title="Execute tests" align="left">
                        <b-tabs pills active-nav-item-class="bg-secondary" nav-class="bg-dark">
                            <b-tab title="Select tests" title-link-class="text-light" active>
                                <execute-tests
                                    :c2URL="c2URL"
                                    :ip="selectedEnv.ip"
                                    :port="selectedEnv.port"
                                    :installedPackages="installedPackages"
                                    @reportsRecovered="setReports"
                                />
                            </b-tab>
                            <b-tab
                                v-if="reports"
                                title="Reports"
                                title-link-class="text-light"
                            >
                                <reports :reports="reports" />
                            </b-tab>
                        </b-tabs>
                    </b-card>
                </b-card-group>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import PlatformInformation from './components/PlatformInformation.vue';
import TestPackages from './components/TestPackages.vue';
import DeletePackagesForm from './components/DeletePackagesForm';
import InstallPackagesForm from './components/InstallPackagesForm';
import Reports from './components/Reports.vue'
import ExecuteTests from './components/ExecuteTests'

export default {
    name: 'environments-panel',

    components: {
        'platform-information': PlatformInformation,
        'test-packages': TestPackages,
        'install-packages-form': InstallPackagesForm,
        'delete-packages-form': DeletePackagesForm,
        'reports': Reports,
        'execute-tests': ExecuteTests
    },

    data() {
        return {
            selectedEnv: null,
            envPlatform: null,
            installedPackages: null,
            reports: null
        };
    },

    props: {
        c2URL: {
            type: String,
            required: true,
        },
        c2Password: {
            type: String,
            required: true
        },
        envs: {
            type: Array,
            required: true
        },
        availablePackages: {
            type: Array,
            required: true
        }
    },

    methods: {
        async setInstalledPackages(ip, port) {
            var response;
            this.installedPackages = [];
            try {
                response = await fetch(`${this.c2URL}/environments/${ip}/${port}/installed`);
                switch (response.status) {
                    case 200:
                        this.installedPackages = await response.json();
                        break;
                    case 404:
                    case 502:
                    case 504:
                        alert((await response.json()).error);
                        break;
                    default:
                        alert(
                            "Unexpected response from the Command an Control server when trying "
                            + "to recover the selected environment's installed tests."
                        );
                }    
            } catch (err) {
                alert(
                    "Something went wrong when trying to recover the environment's installed "
                    + "tests."
                );
            }
        },

        async setPlatformInformation(ip, port) {
            var response;
            try {
                response = await fetch(`${this.c2URL}/environments/${ip}/${port}/info`);
                if (response.status == 200)
                    this.envPlatform = await response.json();
                else if (response.status == 404) {
                    alert((await response.json()).error);
                } else
                    alert(
                        "Unexpected response from the Command an Control server when trying to "
                        + "recover the selected environment's platform information.");
            } catch (err) {
                alert(
                    "Something went wrong when trying to recover the environment's platform "
                    + "information.");
            }
        },

        async uninstallPackageError(response) {
            if (response.status == 401 || response.status == 404)
                alert((await response.json()).error);
            else
                alert("Unexpected response from Command and Control server.");
        },

        setReports(reports) {
            this.reports = reports;
        }
    },

    watch: {
        selectedEnv: async function (env) {
            this.setInstalledPackages(env.ip, env.port);
            this.setPlatformInformation(env.ip, env.port);
            this.reports = null;
        }
    },

    computed: {
        environmentsListOptions() {
            var options = [];
            var e;
            for (e of this.envs)
                options.push({
                    text: `${e.ip}:${e.port}`,
                    value: e
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
    cursor: pointer;
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