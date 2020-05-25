<template>
    <b-container fluid>
        <b-row class="mt-3">
            <b-button variant="dark" @click="execute">Execute all</b-button>
            <b-button variant="outline-dark" class="ml-3" @click="executeSelection">
                Execute selected
            </b-button>
        </b-row>
        <b-row class="mt-3">
            <h5>Root packages</h5>
        </b-row>
        <b-row v-for="p of installedPackages" :key="p.name">
            <package-content-selector
                :pack="p"
                :selectedPackages="selectedPackages"
                :selectedModules="selectedModules"
                :selectedTestSets="selectedTestSets"
                @addPackage="addPackage"
                @removePackage="removePackage"
                @addModule="addModule"
                @removeModule="removeModule"
                @addTestSet="addTestSet"
                @removeTestSet="removeTestSet"
                class="mt-1"
            />
        </b-row>
    </b-container>
</template>

<script>
import PackageContentSelector from './tests_selector/PackageContentSelector';

export default {
    name: 'execute-tests',

    components: {
        'package-content-selector': PackageContentSelector
    },

    data() {
        return {
            selectedPackages: [],
            selectedModules: [],
            selectedTestSets: []
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

    methods: {
        addPackage(pName) {
            const f = e => !e.startsWith(`${pName}.`);
            this.selectedPackages = this.selectedPackages.filter(f);
            this.selectedModules = this.selectedModules.filter(f);
            this.selectedTestSets = this.selectedTestSets.filter(f);
            this.selectedPackages.push(pName);
        },

        removePackage(index) {
            this.$delete(this.selectedPackages, index);
        },

        addModule(mName) {
            this.selectedTestSets = this.selectedTestSets.filter(
                ts => !ts.startsWith(`${mName}.`)
            );
            this.selectedModules.push(mName);
        },

        removeModule(index) {
            this.$delete(this.selectedModules, index);
        },

        addTestSet(tSName) {
            this.selectedTestSets.push(tSName)
        },

        removeTestSet(index) {
            this.$delete(this.selectedTestSets, index);
        },

        async executeSelection() {
            const selection = {
                packages: this.selectedPackages,
                modules: this.selectedModules,
                testSets: this.selectedTestSets,
            }
            this.execute(selection);
        },

        async execute({packages = null, modules = null, testSets = null} = {}) {
            var query = '';
            var url = `${this.c2URL}/environments/${this.ip}/${this.port}/reports`;

            if (packages && packages.length > 0)
                query += 'packages=' + packages.join(',');
            if (modules && modules.length > 0)
                query += 'modules=' + modules.join(',');
            if (testSets && testSets.length > 0)
                query += 'test_sets=' + testSets.join(',');

            if (query)
                url += `?${query}`;
            
            try {
                let response = await fetch(url);
                switch (response.status) {
                    case 200:
                        this.$emit('reportsRecovered', await response.json());
                        break;
                    case 400:
                    case 404:
                    case 500:
                    case 502:
                    case 504:
                        alert((await response.json()).error);
                        break;
                    default:
                        alert(
                            "Unexpected response from Command and Control server when trying to "
                            + "get some reports from the requested environment."
                        );
                }
            } catch (err) {
                alert(
                    "Something went wrong when trying to get the requested environment's reports."
                );
            }
        }
    }
};
</script>