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
                                    :baseEndpoint="`/environments/${selectedEnv.ip}/${selectedEnv.port}/installed`"
                                    @error="uninstallPackageError"
                                    @packagesDeleted="setInstalledPackages(selectedEnv.ip, selectedEnv.port)"
                                />
                            </b-tab>
                        </b-tabs>
                    </b-card>
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
import DeletePackagesForm from './components/DeletePackagesForm';
import InstallPackagesForm from './components/InstallPackagesForm';
import Reports from './components/Reports.vue'

export default {
    name: 'environments-panel',

    components: {
        'environment-information': EnvironmentInformation,
        'test-packages': TestPackages,
        'install-packages-form': InstallPackagesForm,
        'delete-packages-form': DeletePackagesForm,
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
                            + "to recover the selected environment's installed tests.");
                }    
            } catch (err) {
                alert(
                    "Something went wrong when trying to recover the environment's installed "
                    + "tests.");
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
    },

    watch: {
        selectedEnv: async function (env) {
            this.setInstalledPackages(env.ip, env.port);
            this.setPlatformInformation(env.ip, env.port);
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