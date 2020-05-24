<template>
    <div>
        <entity-selector
            :selected="selectedModules"
            :value="`${packagePath}.${mod.name}`"
            :text="mod.name"
            @addValue="addModule"
            @removeValue="removeModule"
        />
        <div v-if="mod.test_sets" class="pl-3">
            <p>Test Sets</p>
            <entity-selector
                v-for="ts of mod.test_sets"
                :key="`${path}.${ts.name}`"
                :selected="selectedTestSets"
                :value="`${path}.${ts.name}`"
                :text="ts.name"
                @addValue="addTestSet"
                @removeValue="removeTestSet"
                class="pl-3"
            />
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
        }
    },

    methods: {
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
        }
    }
};
</script>