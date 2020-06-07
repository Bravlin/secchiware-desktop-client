<template>
    <div>
        <div>Host name: {{ platform.node }}</div>
        <div>Platform: {{ platform.platform }}</div>
        <div class="clickable" @click="toggleHardware">{{ hardwareAction }} Hardware</div>
        <template v-if="hardwareAction == '-'">
            <div class="pl-4">Processor: {{ platform.hardware.processor }}</div>
            <div class="pl-4">Architecture: {{ platform.hardware.machine }}</div>
        </template>
        <div class="clickable" @click="toggleOS">{{ osAction }} Operating system</div>
        <template v-if="osAction == '-'">
            <div class="pl-4">System: {{ platform.os.system }}</div>
            <div class="pl-4">Release: {{ platform.os.release }}</div>
            <div class="pl-4">Version: {{ platform.os.version }}</div>
        </template>
        <div class="clickable" @click="togglePython">{{ pythonAction }} Python</div>
        <template v-if="pythonAction == '-'">
            <div class="pl-4">Version: {{ platform.python.version }}</div>
            <div class="pl-4">Implementation: {{ platform.python.implementation }}</div>
            <div class="pl-4">Compiler: {{ platform.python.compiler }}</div>
            <div class="pl-4">
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
    }
};
</script>

<style scoped>
.clickable:hover {
    color: grey;
    cursor: pointer;
}
</style>