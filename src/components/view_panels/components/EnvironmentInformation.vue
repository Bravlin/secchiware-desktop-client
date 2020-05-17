<template>
    <b-card title="Environment information" align="left">
        <b-card-text>IP: {{ env.ip }}</b-card-text>
        <b-card-text>Port: {{ env.port }}</b-card-text>
        <b-card-text>Session ID: {{ env.session_id }}</b-card-text>
        <b-card-text>Session start: {{ env.session_start }}</b-card-text>
        <b-card-text>Host name: {{ envPlatform.node }}</b-card-text>
        <b-card-text>Platform: {{ envPlatform.platform }}</b-card-text>
        <b-card-text class="clickable" @click="toggleHardware">
            {{ hardwareAction }} Hardware
        </b-card-text>
        <template v-if="hardwareAction == '-'">
            <b-card-text class="pl-4">
                Processor: {{ envPlatform.hardware.processor }}
            </b-card-text>
            <b-card-text class="pl-4">
                Architecture: {{ envPlatform.hardware.machine }}
            </b-card-text>
        </template>
        <b-card-text class="clickable" @click="toggleOS">
            {{ osAction }} Operating system
        </b-card-text>
        <template v-if="osAction == '-'">
            <b-card-text class="pl-4">
                System: {{ envPlatform.os.system }}
            </b-card-text>
            <b-card-text class="pl-4">
                Release: {{ envPlatform.os.release }}
            </b-card-text>
            <b-card-text class="pl-4">
                Version: {{ envPlatform.os.version }}
            </b-card-text>
        </template>
        <b-card-text class="clickable" @click="togglePython">
            {{ pythonAction }} Python
        </b-card-text>
        <template v-if="pythonAction == '-'">
            <b-card-text class="pl-4">
                Version: {{ envPlatform.python.version }}
            </b-card-text>
            <b-card-text class="pl-4">
                Implementation: {{ envPlatform.python.implementation }}
            </b-card-text>
            <b-card-text class="pl-4">
                Compiler: {{ envPlatform.python.compiler }}
            </b-card-text>
            <b-card-text class="pl-4">
                Build: {{ envPlatform.python.build[0]
                    + ' - ' + envPlatform.python.build[1] }}
            </b-card-text>
        </template>
    </b-card>
</template>

<script>
export default {
    name: 'environment-information',

    data() {
        return {
            hardwareAction: '+',
            osAction: '+',
            pythonAction: '+'
        }
    },

    props: {
        env: {
            type: Object,
            required: true
        },
        envPlatform: {
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
    },
};
</script>

<style scoped>
.clickable:hover {
    color: grey;
    cursor: pointer;
}
</style>