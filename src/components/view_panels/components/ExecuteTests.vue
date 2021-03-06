<template>
    <b-container fluid>
        <b-row class="mt-3">
            <b-button variant="dark" @click="execute">Execute all</b-button>
            <b-button
                variant="outline-dark"
                class="ml-3"
                @click="executeSelection"
                :disabled="selectedPackages.length === 0 && selectedModules.length === 0 && selectedTestSets.length === 0 && selectedTests.length === 0"
            >
                Execute selected
            </b-button>
        </b-row>
        <b-row class="mt-3">
            <h5>
                Root packages
                <b-icon-arrow-repeat class="clickable" @click="refreshPackages" />
            </h5>
        </b-row>
        <b-row v-for="p of installedPackages" :key="p.name">
            <package-content-selector
                :pack="p"
                :selectedPackages="selectedPackages"
                :selectedModules="selectedModules"
                :selectedTestSets="selectedTestSets"
                :selectedTests="selectedTests"
                @addPackage="addPackage"
                @removePackage="removePackage"
                @addModule="addModule"
                @removeModule="removeModule"
                @addTestSet="addTestSet"
                @removeTestSet="removeTestSet"
                @addTest="addTest"
                @removeTest="removeTest"
                class="mt-1"
            />
        </b-row>
    </b-container>
</template>

<script>
import PackageContentSelector from './tests_selector/PackageContentSelector';
import modals from '../../../mixins/modals.js';

export default {
    name: 'execute-tests',

    mixins: [modals],

    components: {
        'package-content-selector': PackageContentSelector
    },

    data() {
        return {
            selectedPackages: [],
            selectedModules: [],
            selectedTestSets: [],
            selectedTests: []
        };
    },

    props: {
        c2URL: {
            type: String,
            required: true
        },
        ip: {
            type: String,
            required: true
        },
        port: {
            type: Number,
            required: true
        },
        installedPackages: {
            type: Array,
            required: true
        }
    },

    watch: {
        installedPackages: {
            handler() {
                this.selectedPackages = [];
                this.selectedModules = [];
                this.selectedTestSets = [];
                this.selectedTests = [];
            },
            deep: true,
            immediate: true,
        },
    },

    methods: {
        refreshPackages() {
            this.$emit('refreshPackagesRequested');
        },

        addPackage(pName) {
            const f = e => !e.startsWith(`${pName}.`);
            this.selectedPackages = this.selectedPackages.filter(f);
            this.selectedModules = this.selectedModules.filter(f);
            this.selectedTestSets = this.selectedTestSets.filter(f);
            this.selectedTests = this.selectedTests.filter(f);
            this.selectedPackages.push(pName);
        },

        removePackage(index) {
            this.$delete(this.selectedPackages, index);
        },

        addModule(mName) {
            const f = e => !e.startsWith(`${mName}.`);
            this.selectedTestSets = this.selectedTestSets.filter(f);
            this.selectedTests = this.selectedTests.filter(f);
            this.selectedModules.push(mName);
        },

        removeModule(index) {
            this.$delete(this.selectedModules, index);
        },

        addTestSet(tSName) {
            this.selectedTests = this.selectedTests.filter(
                t => !t.startsWith(`${tSName}.`)
            );
            this.selectedTestSets.push(tSName);
        },

        removeTestSet(index) {
            this.$delete(this.selectedTestSets, index);
        },

        addTest(testName) {
            this.selectedTests.push(testName);
        },

        removeTest(index) {
            this.$delete(this.selectedTests, index);
        },

        async executeSelection() {
            const selection = {
                packages: this.selectedPackages,
                modules: this.selectedModules,
                testSets: this.selectedTestSets,
                tests: this.selectedTests
            }
            this.execute(selection);
        },

        async execute({packages = null, modules = null, testSets = null, tests = null} = {}) {
            var query = '';
            var url = `${this.c2URL}/environments/${this.ip}/${this.port}/reports`;

            if (packages && packages.length > 0)
                query += 'packages=' + packages.join(',');
            if (modules && modules.length > 0)
                query += '&modules=' + modules.join(',');
            if (testSets && testSets.length > 0)
                query += '&test_sets=' + testSets.join(',');
            if (tests && tests.length > 0)
                query += '&tests=' + tests.join(',');

            if (query) {
                if (query.startsWith('&'))
                    query = query.slice(1);
                url += `?${query}`;
            }
            
            try {
                let response = await fetch(url);
                switch (response.status) {
                    case 200:
                        this.$emit('reportsRecovered', await response.json());
                        this.showSuccessModal('Execution finished!');
                        break;
                    case 400:
                    case 404:
                    case 500:
                    case 502:
                    case 504:
                        this.showErrorModal((await response.json()).error);
                        break;
                    default:
                        this.showErrorModal(
                            'Unexpected response from Command and Control server when trying to '
                            + 'get some reports from the requested environment.'
                        );
                }
            } catch (err) {
                this.showErrorModal(
                    "Something went wrong when trying to get the requested environment's "
                    + 'reports. Please, verify that the application is correctly configured.'
                );
            }
        }
    }
};
</script>

<style scoped>
.clickable:hover {
    color: grey;
    cursor: pointer;
}
</style>