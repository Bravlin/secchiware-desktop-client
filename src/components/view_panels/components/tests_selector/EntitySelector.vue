<template>
    <div>
        <b-button
            v-if="index === -1"
            variant="success"
            @click="add"
            class="px-1 py-0"
            :disabled="disabled"
        >
            +
        </b-button>
        <b-button v-else variant="danger" @click="remove" class="px-1 py-0">-</b-button>
        {{ text }}
    </div>
</template>

<script>
export default {
    name: 'entity-selector',

    props: {
        selected: {
            type: Array,
            required: true
        },
        value: {
            type: null,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    methods: {
        add() {
            this.$emit("addValue", this.value);
        },

        remove() {
            this.$emit("removeValue", this.index);
        }
    },

    computed: {
        index() {
            return this.selected.indexOf(this.value);
        }
    }
};
</script>