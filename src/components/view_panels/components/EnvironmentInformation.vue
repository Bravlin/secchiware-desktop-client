<template>
    <b-card title="Environment information" align="left">
        <b-card-text>URL: {{ env.ip + ':' + env.port }}</b-card-text>
        <b-card-text>Session ID: {{ env.session_id }}</b-card-text>
        <b-card-text>Session start: {{ env.session_start }}</b-card-text>
        <b-card-text>Platform: {{ envPlatform.platform }}</b-card-text>
        <b-card-text>Host name: {{ envPlatform.node }}</b-card-text>
        <b-card-text class="clickable" @click="toggleHardware">Hardware</b-card-text>
        <template v-if="hardwareVisible">
            <b-card-text class="pl-4">
                Processor: {{ envPlatform.hardware.processor }}
            </b-card-text>
            <b-card-text class="pl-4">
                Architecture: {{ envPlatform.hardware.machine }}
            </b-card-text>
        </template>
        <b-card-text class="clickable" @click="toggleOS">
            Operating system
        </b-card-text>
        <template v-if="osVisible">
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
        <b-card-text class="clickable" @click="togglePython">Python</b-card-text>
        <template v-if="pythonVisible">
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
                    + ' ' + envPlatform.python.build[1] }}
            </b-card-text>
        </template>
    </b-card>
</template>

<script>
export default {
    name: 'environment-information',

    data() {
        return {
            hardwareVisible: false,
            osVisible: false,
            pythonVisible: false,
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
        toggleHardware() {
            this.hardwareVisible = !this.hardwareVisible;
        },

        toggleOS() {
            this.osVisible = !this.osVisible;
        },

        togglePython() {
            this.pythonVisible = !this.pythonVisible;
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