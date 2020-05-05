<template>
    <div>
        <div>Name: {{ testSet.name }}</div>
        <template v-if="testSet.tests">
            <div class="clickable" @click="toggleTests">Tests</div>
            <template v-if="testsVisible">
                <div v-for="t in testSet.tests" :key="t" class="pl-4">{{ t }}</div>
            </template>
        </template>
    </div>
</template>

<script>
export default {
    name: 'test-set-expansion',

    data() {
        return {
            testsVisible: false
        };
    },

    props: {
        testSet: {
            type: Object,
            required: true
        }
    },

    methods: {
        toggleTests() {
            this.testsVisible = !this.testsVisible;
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