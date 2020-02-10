<template>
    <div>
        <div>Name: {{ mod.name }}</div>
        <template v-if="mod.test_sets.length > 0">
            <div class="clickable" @click="toggleTestSets">Test sets</div>
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
            testSetsVisible: false
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
        }
    }
};
</script>

<style scoped>
.clickable:hover {
    color: grey;
    cursor: -webkit-grabbing;
}
</style>