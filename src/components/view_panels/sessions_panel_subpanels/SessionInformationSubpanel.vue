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
        <b-card-group deck>
            <b-card
                v-for="execution in sessionExecutions"
                :key="execution.execution_id"
                :title="`Execution ${execution.execution_id}`"
                align="left"
            >
                <b-tabs pills active-nav-item-class="bg-secondary" nav-class="bg-dark">
                    <b-tab title="Information" title-link-class="text-light" active>
                        <b-card-text>Execution's ID: {{ execution.execution_id }}</b-card-text>
                        <b-card-text>
                            Register time: {{ execution.timestamp_registered }}
                        </b-card-text>
                        <b-card-text>Total reports: {{ execution.reports.length }}</b-card-text>
                    </b-tab>
                    <b-tab title="Reports" title-link-class="text-light">
                        <reports :reports="execution.reports" />
                    </b-tab>
                </b-tabs>
            </b-card>
        </b-card-group>
    </div>
</template>

<script>
import PlatformInformation from '../components/PlatformInformation.vue';
import Reports from '../components/Reports.vue';

export default {
    name: 'session-information-subpanel',

    components: {
        'platform-information': PlatformInformation,
        'reports': Reports
    },

    data() {
        return {
            sessionInfo: null,
            sessionExecutions: null
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
                        alert((await response.json()).error);
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

        async setSessionExecutions() {
            try {
                let response = await fetch(`${this.c2URL}/executions?sessions=${this.sessionID}`);
                switch (response.status) {
                    case 200:
                        this.sessionExecutions = await response.json();
                        break;
                    case 400:
                        alert((await response.json()).error);
                        break;
                    default:
                        alert(
                            'Unexpected response from Command and Control server when trying to '
                            + "recover the session's executions."
                        );
                }
            } catch (err) {
                alert("Something went wrong trying to recover the session's executions.");
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
        this.setSessionExecutions();
    }
};
</script>