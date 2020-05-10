<template>
    <div>
        <div>Name: <b>{{ testSet.name }}</b></div>
        <template v-if="testSet.tests">
            <div class="clickable" @click="toggleTests">{{ testsAction }} Tests</div>
            <template v-if="testsVisible">
                <div v-for="t in testSet.tests" :key="t" class="pl-4"><b>{{ t }}</b></div>
            </template>
        </template>
    </div>
</template>

<script>
export default {
    name: 'test-set-expansion',

    data() {
        return {
            testsVisible: false,
            testsAction: '+',
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
            this.testsAction = this.testsVisible ? '-' : '+';
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