<template>
    <div>
        <entity-selector
            :selected="selectedTestSets"
            :value="`${modulePath}.${testSet.name}`"
            :text="testSet.name"
            :disabled="disabled"
            @addValue="addTestSet"
            @removeValue="removeTestSet"
        />
        <div v-if="testSet.tests" class="pl-4">
            <div class="clickable my-2" @click="toggleTests">
                {{ testsAction }} Tests
            </div>
            <template v-if="testsVisible">
                <entity-selector
                    v-for="t of testSet.tests"
                    :key="`${path}.${t}`"
                    :selected="selectedTests"
                    :value="`${path}.${t}`"
                    :text="t"
                    :disabled="disabled || selectedTestSets.includes(path)"
                    @addValue="addTest"
                    @removeValue="removeTest"
                    class="mt-2"
                />
            </template>
        </div>
    </div>
</template>

<script>
import EntitySelector from './EntitySelector.vue';

export default {
    name: 'test-set-content-selector',

    components: {
        'entity-selector': EntitySelector
    },

    data() {
        return {testsAction: '+'};
    },

    props: {
        testSet: {
            type: Object,
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
        modulePath: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    methods: {
        toggleTests() {
            this.testsAction = this.testsAction === '+' ? '-' : '+';
        },

        addTestSet(tsName) {
            this.$emit('addTestSet', tsName);
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
            return `${this.modulePath}.${this.testSet.name}`;
        },

        testsVisible() {
            return this.testsAction === '-';
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