<template>
    <div>
        <div><b-button @click="goBack">Back</b-button></div>
        <b-card v-if="sessionInfo" title="Session's information" align="left">
            <b-card-text>ID: {{ sessionInfo.session_id }}</b-card-text>
            <b-card-text>Status: {{ isActive ? 'Active' : 'Closed' }}</b-card-text>
            <b-card-text>Start: {{ sessionInfo.session_start }}</b-card-text>
            <b-card-text v-if="!isActive">End: {{ sessionInfo.session_end }}</b-card-text>
            <platform-information :platform="sessionInfo.platform_info" />
        </b-card>
    </div>
</template>

<script>
import PlatformInformation from '../components/PlatformInformation.vue';

export default {
    name: 'session-information-subpanel',

    components: {
        'platform-information': PlatformInformation
    },

    data() {
        return {
            sessionInfo: null
        };
    },

    props: {
        c2URL: {
            type: String,
            required: true
        },
        sessionID: {
            type: Number,
            required: true
        }
    },

    methods: {
        async setSessionInfo() {
            try {
                let response = await fetch(`${this.c2URL}/sessions/${this.sessionID}`);
                switch (response.status) {
                    case 200:
                        this.sessionInfo = await response.json();
                        break;
                    case 404:
                        alert(`No session found with id ${this.sessionID}`);
                        break;
                    default:
                        alert(
                            'Unexpected response from Command and Control server when trying to '
                            + "recover the session's information");
                }
            } catch (err) {
                alert(
                    'Something went wrong trying to contact the Command and Control server to '
                    + "recover the session's information.");
            }
        },

        goBack() {
            this.$emit('back');
        }
    },

    computed: {
        isActive() {
            return !this.sessionInfo.hasOwnProperty('session_end');
        }
    },

    created() {
        this.setSessionInfo();
    }
};
</script>