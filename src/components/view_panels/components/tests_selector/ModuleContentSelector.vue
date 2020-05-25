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
                <entity-selector
                    v-for="ts of mod.test_sets"
                    :key="`${path}.${ts.name}`"
                    :selected="selectedTestSets"
                    :value="`${path}.${ts.name}`"
                    :text="ts.name"
                    :disabled="disabled || selectedModules.includes(path)"
                    @addValue="addTestSet"
                    @removeValue="removeTestSet"
                    class="mt-1"
                />
            </template>
        </div>
    </div>
</template>

<script>
import EntitySelector from './EntitySelector.vue';

export default {
    name: 'module-content-selector',

    components: {
        'entity-selector': EntitySelector
    },

    data() {
        return {
            testSetsAction: '+'
        };
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