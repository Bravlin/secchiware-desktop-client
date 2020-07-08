<template>
    <div>
        <entity-selector
            :selected="selectedModules"
            :value="`${packagePath}.${mod.name}`"
            :text="mod.name"
            :disabled="disabled"
            @addValue="addModule"
            @removeValue="removeModule"
        />
        <div v-if="mod.test_sets" class="pl-4">
            <div class="clickable my-2" @click="toggleTestSets">
                {{ testSetsAction }} Test Sets
            </div>
            <template v-if="testSetsVisible">
                <test-set-content-selector
                    v-for="ts of mod.test_sets"
                    :key="`${path}.${ts.name}`"
                    :testSet="ts"
                    :selectedTestSets="selectedTestSets"
                    :selectedTests="selectedTests"
                    :modulePath="path"
                    :disabled="disabled || selectedModules.includes(path)"
                    @addTestSet="addTestSet"
                    @removeTestSet="removeTestSet"
                    @addTest="addTest"
                    @removeTest="removeTest"
                    class="mt-2"
                />
            </template>
        </div>
    </div>
</template>

<script>
import EntitySelector from './EntitySelector.vue';
import TestSetContentSelector from './TestSetContentSelector.vue';

export default {
    name: 'module-content-selector',

    components: {
        'entity-selector': EntitySelector,
        'test-set-content-selector': TestSetContentSelector
    },

    data() {
        return {testSetsAction: '+'};
    },

    props: {
        mod: {
            type: Object,
            required: true
        },
        selectedModules: {
            type: Array,
            required: true
        },
        selectedTestSets: {
            type: Array,
            required: true
        },
        selectedTests: {
            type: Array,
            required: true
        },
        packagePath: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    methods: {
        toggleTestSets() {
            this.testSetsAction = this.testSetsAction === '+' ? '-' : '+';
        },
    
        addModule(mName) {
            this.$emit('addModule', mName);
        },

        removeModule(index) {
            this.$emit('removeModule', index);
        },
        
        addTestSet(tSName) {
            this.$emit('addTestSet', tSName);
        },

        removeTestSet(index) {
            this.$emit('removeTestSet', index);
        },

        addTest(testName) {
            this.$emit('addTest', testName);
        },

        removeTest(index) {
            this.$emit('removeTest', index);
        }
    },

    computed: {
        path() {
            return `${this.packagePath}.${this.mod.name}`;
        },

        testSetsVisible() {
            return this.testSetsAction === '-';
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