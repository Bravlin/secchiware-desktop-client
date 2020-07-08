<template>
    <div>
        <entity-selector
            :selected="selectedPackages"
            :value="path"
            :text="pack.name"
            @addValue="addPackage"
            @removeValue="removePackage"
            :disabled="disabled"
        />
        <div v-if="pack.modules" class="pl-4">
            <div class="clickable my-2" @click="toggleModules">{{ modulesAction }} Modules</div>
            <template v-if="modulesVisible">
                <module-content-selector
                    v-for="m of pack.modules"
                    :key="`${path}.${m.name}`"
                    :mod="m"
                    :selectedModules="selectedModules"
                    :selectedTestSets="selectedTestSets"
                    :selectedTests="selectedTests"
                    :packagePath="path"
                    :disabled="disabled || selectedPackages.includes(path)"
                    @addModule="addModule"
                    @removeModule="removeModule"
                    @addTestSet="addTestSet"
                    @removeTestSet="removeTestSet"
                    @addTest="addTest"
                    @removeTest="removeTest"
                    class="mt-2"
                />
            </template>
        </div>
        <div v-if="pack.subpackages" class="pl-4">
            <div class="clickable my-2" @click="toggleSubpackages">
                {{ subpackagesAction }} Subpackages
            </div>
            <template v-if="subpackagesVisible">
                <package-content-selector
                    v-for="sp of pack.subpackages"
                    :key="`${pack.name}.${sp.name}`"
                    :pack="sp"
                    :selectedPackages="selectedPackages"
                    :selectedModules="selectedModules"
                    :selectedTestSets="selectedTestSets"
                    :selectedTests="selectedTests"
                    :parentPath="path"
                    :disabled="disabled || selectedPackages.includes(path)"
                    @addPackage="addPackage"
                    @removePackage="removePackage"
                    @addModule="addModule"
                    @removeModule="removeModule"
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
import ModuleContentSelector from './ModuleContentSelector.vue';

export default {
    name: 'package-content-selector',

    components: {
        'entity-selector': EntitySelector,
        'module-content-selector': ModuleContentSelector
    },

    data() {
        return {
            modulesAction: '+',
            subpackagesAction: '+'
        }
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
        selectedTests: {
            type: Array,
            required: true
        },
        parentPath: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    methods: {
        toggleModules() {
            this.modulesAction = this.modulesAction === '+' ? '-' : '+';
        },

        toggleSubpackages() {
            this.subpackagesAction = this.subpackagesAction === '+' ? '-' : '+';
        },

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
            return this.parentPath ? `${this.parentPath}.${this.pack.name}` : this.pack.name;
        },

        modulesVisible() {
            return this.modulesAction === '-';
        },

        subpackagesVisible() {
            return this.subpackagesAction === '-';
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