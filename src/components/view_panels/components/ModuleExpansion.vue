<template>
    <div>
        <div>Name: <b>{{ mod.name }}</b></div>
        <template v-if="mod.test_sets">
            <div class="clickable" @click="toggleTestSets">{{ testSetsAction }} Test sets</div>
            <template v-if="testSetsVisible">
                <test-set-expansion
                    v-for="ts in mod.test_sets"
                    :key="ts.name"
                    :testSet="ts"
                    class="pl-4"
                />
            </template>
        </template>
    </div>
</template>

<script>
import TestSetExpansion from './TestSetExpansion.vue';

export default {
    name: 'module-expansion',

    components: {
        TestSetExpansion
    },

    data() {
        return {
            testSetsVisible: false,
            testSetsAction: '+',
        };
    },

    props: {
        mod: {
            type: Object,
            required: true
        }
    },

    methods: {
        toggleTestSets() {
            this.testSetsVisible = !this.testSetsVisible;
            this.testSetsAction = this.testSetsVisible ? '-' : '+';
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