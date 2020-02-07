<template>
    <div>
        <div>Name: {{ mod.name }}</div>
        <template v-if="mod.test_sets.length > 0">
            <div class="clickable" @click="toggleTests">Test sets</div>
            <template v-if="testsVisible">
                <div v-for="ts in mod.test_sets" :key="ts" class="pl-4">{{ ts }}</div>
            </template>
        </template>
    </div>
</template>

<script>
export default {
    name: 'module-expansion',

    data() {
        return {
            testsVisible: false,
        };
    },

    props: {
        mod: {
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
    cursor: -webkit-grabbing;
}
</style>