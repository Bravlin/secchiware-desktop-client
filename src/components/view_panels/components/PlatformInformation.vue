<template>
    <div>
        <div>Host name: {{ platform.node }}</div>
        <div :class="verticalMarginBetweenClass">Platform: {{ platform.platform }}</div>
        <div :class="`clickable ${verticalMarginBetweenClass}`" @click="toggleHardware">
            {{ hardwareAction }} Hardware
        </div>
        <template v-if="hardwareAction == '-'">
            <div :class="`pl-4 ${verticalMarginBetweenClass}`">
                Processor: {{ platform.hardware.processor }}
            </div>
            <div :class="`pl-4 ${verticalMarginBetweenClass}`">
                Architecture: {{ platform.hardware.machine }}
            </div>
        </template>
        <div :class="`clickable ${verticalMarginBetweenClass}`" @click="toggleOS">
            {{ osAction }} Operating system
        </div>
        <template v-if="osAction == '-'">
            <div :class="`pl-4 ${verticalMarginBetweenClass}`">
                System: {{ platform.os.system }}
            </div>
            <div :class="`pl-4 ${verticalMarginBetweenClass}`">
                Release: {{ platform.os.release }}
            </div>
            <div :class="`pl-4 ${verticalMarginBetweenClass}`">
                Version: {{ platform.os.version }}
            </div>
        </template>
        <div :class="`clickable ${verticalMarginBetweenClass}`" @click="togglePython">
            {{ pythonAction }} Python
        </div>
        <template v-if="pythonAction == '-'">
            <div :class="`pl-4 ${verticalMarginBetweenClass}`">
                Version: {{ platform.python.version }}
            </div>
            <div :class="`pl-4 ${verticalMarginBetweenClass}`">
                Implementation: {{ platform.python.implementation }}
            </div>
            <div :class="`pl-4 ${verticalMarginBetweenClass}`">
                Compiler: {{ platform.python.compiler }}
            </div>
            <div :class="`pl-4 ${verticalMarginBetweenClass}`">
                Build: {{ `${platform.python.build[0]} - ${platform.python.build[1]}` }}
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'platform-information',

    data() {
        return {
            hardwareAction: '+',
            osAction: '+',
            pythonAction: '+'
        }
    },

    props: {
        platform: {
            type: Object,
            required: true
        },
        verticalMarginBetween: {
            type: Number,
            required: false
        }
    },

    methods: {
        nextHideOrShowSymbol(symbol) {
            return symbol == '+' ? '-' : '+';
        },

        toggleHardware() {
            this.hardwareAction = this.nextHideOrShowSymbol(this.hardwareAction);
        },

        toggleOS() {
            this.osAction = this.nextHideOrShowSymbol(this.osAction);
        },

        togglePython() {
            this.pythonAction = this.nextHideOrShowSymbol(this.pythonAction);
        }
    },

    computed: {
        verticalMarginBetweenClass() {
            return this.verticalMarginBetween ? `mt-${this.verticalMarginBetween}` : '';
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