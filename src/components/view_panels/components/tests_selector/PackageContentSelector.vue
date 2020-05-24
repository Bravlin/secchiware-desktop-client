<template>
    <div>
        <entity-selector
            :selected="selectedPackages"
            :value="path"
            :text="pack.name"
            @addValue="addPackage"
            @removeValue="removePackage"
        />
        <div v-if="pack.modules" class="pl-3">
            <p>Modules</p>
            <module-content-selector
                v-for="m of pack.modules"
                :key="`${path}.${m.name}`"
                :mod="m"
                :selectedModules="selectedModules"
                :selectedTestSets="selectedTestSets"
                :packagePath="path"
                @addModule="addModule"
                @removeModule="removeModule"
                @addTestSet="addTestSet"
                @removeTestSet="removeTestSet"
                class="pl-3"
            />
        </div>
        <div v-if="pack.subpackages" class="pl-3">
            <p>Subpackages</p>
            <package-content-selector
                v-for="sp of pack.subpackages"
                :key="`${pack.name}.${sp.name}`"
                :pack="sp"
                :selectedPackages="selectedPackages"
                :selectedModules="selectedModules"
                :selectedTestSets="selectedTestSets"
                :parentPath="path"
                @addPackage="addPackage"
                @removePackage="removePackage"
                @addModule="addModule"
                @removeModule="removeModule"
                @addTestSet="addTestSet"
                @removeTestSet="removeTestSet"
                class="pl-3"
            />
        </div>
    </div>
</template>

<script>
import EntitySelector from './EntitySelector.vue';
import ModuleContentSelector from './ModuleContentSelector.vue';

export default {
    name: 'package-content-selector',

    components: {
        'entity-selector': EntitySelector,
        'module-content-selector': ModuleContentSelector
    },

    props: {
        pack: {
            type: Object,
            required: true
        },
        selectedPackages: {
            type: Array,
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
        parentPath: {
            type: String,
            default: ''
        }
    },

    methods: {
        addPackage(pName) {
            this.$emit('addPackage', pName);
        },

        removePackage(index) {
            this.$emit('removePackage', index);
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
            return this.parentPath ? `${this.parentPath}.${this.pack.name}` : this.pack.name;
        }
    }
};
</script>