<template>
    <b-container fluid>
        <b-row>
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
        }
    }
};
</script>