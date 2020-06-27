<template>
    <b-container fluid>
        <b-row style="height: 100%">
            <b-col
                id="environments-list"
                v-if="environments"
                class="py-3 overflowable"
                cols="5"
                md="4"
                lg="3"
                xl="2"
            >
                <h5>
                    Registered environments
                    <b-icon-arrow-repeat class="clickable" @click="setEnvironments" />
                </h5>
                <b-form-radio-group
                    v-model="selectedEnv"
                    :options="environmentsListOptions"
                    stacked
                />
            </b-col>
            <b-col cols="7" md="8" lg="9" xl="10" class="p-5 overflowable">
                <b-card
                    title="Environment information"
                    align="left"
                    v-if="selectedEnv && envPlatform"
                    class="environments-panel-b-card mx-auto"
                >
                    <div>IP: {{ selectedEnv.ip }}</div>
                    <div class="mt-3">Port: {{ selectedEnv.port }}</div>
                    <div class="mt-3">Session ID: {{ selectedEnv.session_id }}</div>
                    <div class="my-3">Session start: {{ selectedEnv.session_start }}</div>
                    <platform-information :platform="envPlatform" :verticalMarginBetween="3" />
                </b-card>
                <b-card
                    v-if="selectedEnv"
                    title="Tests management"
                    align="left"
                    class="environments-panel-b-card mx-auto mt-5"
                >
                    <b-tabs pills active-nav-item-class="bg-secondary" nav-class="bg-dark">
                        <b-tab title="Explore" title-link-class="text-light" active>
                            <test-packages
                                v-if="installedPackages"
                                :packages="installedPackages" 
                                @packagesRefreshRequested="setInstalledPackages(selectedEnv.ip, selectedEnv.port)"
                            />
                        </b-tab>
                        <b-tab title="Install" title-link-class="text-light">
                            <install-packages-form
                                :c2URL="c2URL"
                                :c2Password="c2Password"
                                :c2AvailablePackages="availablePackages"
                                :envIP="selectedEnv.ip"
                                :envPort="selectedEnv.port"
                                @refreshAvailablePackagesRequested="propagateAvailablePackagesRefreshRequested"
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
                                @packagesDeleted="removePackages"
                                @packagesRefreshRequested="setInstalledPackages(selectedEnv.ip, selectedEnv.port)"
                            />
                        </b-tab>
                    </b-tabs>
                </b-card>
                <b-card
                    v-if="selectedEnv"
                    title="Execute tests"
                    align="left"
                    class="environments-panel-b-card mx-auto mt-5"
                >
                    <b-tabs pills active-nav-item-class="bg-secondary" nav-class="bg-dark">
                        <b-tab title="Select tests" title-link-class="text-light" active>
                            <execute-tests
                                :c2URL="c2URL"
                                :ip="selectedEnv.ip"
                                :port="selectedEnv.port"
                                :installedPackages="installedPackages"
                                @reportsRecovered="setReports"
                                @refreshPackagesRequested="setInstalledPackages(selectedEnv.ip, selectedEnv.port)"
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
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import PlatformInformation from './components/PlatformInformation.vue';
import TestPackages from './components/TestPackages.vue';
import DeletePackagesForm from './components/DeletePackagesForm';
import InstallPackagesForm from './components/InstallPackagesForm';
import Reports from './components/Reports.vue';
import ExecuteTests from './components/ExecuteTests';
import modals from '../../mixins/modals.js';

export default {
    name: 'environments-panel',

    mixins: [modals],

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
            environments: null,
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
        availablePackages: {
            type: Array,
            required: true
        }
    },

    methods: {
        propagateAvailablePackagesRefreshRequested() {
            this.$emit('packagesRefreshRequested');
        },

        async setEnvironments() {
            try {
                let response = await fetch(`${this.c2URL}/environments`);
                if (response.status != 200)
                    this.showErrorModal(
                        'Unexpected response from the Command an Control server when trying to '
                        + 'recover its connected environments.'
                    );
                else
                    this.environments = await response.json();
            } catch (err) {
                this.showErrorModal(
                    'Something went wrong when trying to recover the environments connected to '
                    + 'the Command and Control server. Please, verify that the application is '
                    + 'correctly configured.'
                );
            }
        },

        async setInstalledPackages(ip, port) {
            this.installedPackages = [];
            try {
                let response = await fetch(`${this.c2URL}/environments/${ip}/${port}/installed`);
                switch (response.status) {
                    case 200:
                        this.installedPackages = await response.json();
                        break;
                    case 404:
                    case 502:
                    case 504:
                        this.showErrorModal((await response.json()).error);
                        break;
                    default:
                        this.showErrorModal(
                            'Unexpected response from the Command an Control server when trying '
                            + "to recover the selected environment's installed tests."
                        );
                }    
            } catch (err) {
                this.showErrorModal(
                    "Something went wrong when trying to recover the environment's installed "
                    + 'tests. Please, verify that the application is correctly configured.'
                );
            }
        },

        async setPlatformInformation(ip, port) {
            try {
                let response = await fetch(`${this.c2URL}/environments/${ip}/${port}/info`);
                if (response.status == 200)
                    this.envPlatform = await response.json();
                else if (response.status == 404) {
                    this.showErrorModal((await response.json()).error);
                } else
                    this.showErrorModal(
                        'Unexpected response from the Command an Control server when trying to '
                        + "recover the selected environment's platform information."
                    );
            } catch (err) {
                this.showErrorModal(
                    "Something went wrong when trying to recover the environment's platform "
                    + 'information. Please, verify that the application is correctly configured.'
                );
            }
        },

        async uninstallPackageError(response) {
            if (response.status == 401 || response.status == 404)
                alert((await response.json()).error);
            else
                alert('Unexpected response from Command and Control server.');
        },

        removePackages(deletedPackages) {
            this.installedPackages = this.installedPackages.filter(
                pack => !deletedPackages.has(pack.name)
            );
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
            for (e of this.environments)
                options.push({
                    text: `${e.ip}:${e.port}`,
                    value: e
                });
            return options;
        }
    },

    created() {
        this.setEnvironments();
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

.overflowable {
    height: 100vh;
    overflow: auto;
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

.environments-panel-b-card {
    max-width: 800px;
}
</style>