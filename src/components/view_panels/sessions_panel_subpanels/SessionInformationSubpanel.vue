<template>
    <b-container fluid class="p-5">
        <b-icon-arrow-left class="back-button" @click="goBack" />
        <b-card
            v-if="sessionInfo"
            title="Session's information"
            align="left"
            class="session-information-card mx-auto mt-3"
        >
            <b-card-text>ID: {{ sessionInfo.session_id }}</b-card-text>
            <b-card-text>Status: {{ isActive ? 'Active' : 'Closed' }}</b-card-text>
            <b-card-text>Start: {{ sessionInfo.session_start }}</b-card-text>
            <b-card-text v-if="!isActive">End: {{ sessionInfo.session_end }}</b-card-text>
            <platform-information :platform="sessionInfo.platform_info" :verticalMarginBetween="3" />
            <b-button variant="danger" class="mt-3" @click="deleteSession">
                Delete session
            </b-button>
        </b-card>
        <h3 class="background-title mt-5">Executions</h3>
        <b-row align-h="around">
            <b-col
                class="mt-3"
                cols="12"
                lg="6"
                v-for="execution in sessionExecutions"
                :key="execution.execution_id"
            >
                <b-card :title="`Execution ${execution.execution_id}`" align="left">
                    <b-tabs pills active-nav-item-class="bg-secondary" nav-class="bg-dark">
                        <b-tab title="Information" title-link-class="text-light" active>
                            <b-card-text class="mt-3">
                                Execution's ID: {{ execution.execution_id }}
                            </b-card-text>
                            <b-card-text>
                                Register time: {{ execution.timestamp_registered }}
                            </b-card-text>
                            <b-card-text>
                                Total reports: {{ execution.reports.length }}
                            </b-card-text>
                            <b-button
                                variant="danger"
                                class="mt-3"
                                @click="deleteExecution(execution.execution_id)"
                            >
                                Delete execution
                            </b-button>
                        </b-tab>
                        <b-tab title="Reports" title-link-class="text-light">
                            <reports :reports="execution.reports" />
                        </b-tab>
                    </b-tabs>
                </b-card>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import PlatformInformation from '../components/PlatformInformation.vue';
import Reports from '../components/Reports.vue';
import Vue from 'vue';

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
        c2Password: {
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
        },

        async deleteSession() {
            var proceed = await this.$bvModal.msgBoxConfirm(
                'Deleting a session will remove all its associated information and executions. '
                + 'Are you sure you want to continue?',
                {
                    okVariant: 'danger',
                    okTitle: 'Delete',
                    centered: true
                }
            );
            if (proceed) {
                let requestInit, canonicalURI, signature;
                canonicalURI = `/sessions/${this.sessionID}`;
                signature = Vue.newSignature(
                    this.c2Password,
                    'DELETE',
                    canonicalURI
                );
                requestInit = {
                    method: 'DELETE',
                    headers: {'Authorization': Vue.newAuthorizationHeader('Client', signature)}
                };
                try {
                    let response = await fetch(`${this.c2URL}${canonicalURI}`, requestInit);
                    switch (response.status) {
                        case 404:
                            alert((await response.json()).error);
                            /* falls through */
                        case 204:
                            this.$emit('sessionDeleted', this.sessionID);
                            break;
                        case 400:
                        case 401:
                            alert((await response.json()).error);
                            break;
                        default:
                            alert(
                                'Unexpected response from Command and Control server when trying '
                                + 'to delete the session.'
                            );
                    }
                } catch (err) {
                    alert(
                        'Something went wrong when trying to contact the Command and Control '
                        + 'server trying to delete the session.'
                    );
                }
            }
        },

        async deleteExecution(executionID) {
            var proceed = await this.$bvModal.msgBoxConfirm(
                'Deleting an execution will remove all its associated information and reports. '
                + 'Are you sure you want to continue?',
                {
                    okVariant: 'danger',
                    okTitle: 'Delete',
                    centered: true
                }
            );
            if (proceed) {
                let requestInit, canonicalURI, signature;
                canonicalURI = `/executions/${executionID}`;
                signature = Vue.newSignature(
                    this.c2Password,
                    'DELETE',
                    canonicalURI
                );
                requestInit = {
                    method: 'DELETE',
                    headers: {'Authorization': Vue.newAuthorizationHeader('Client', signature)}
                };
                try {
                    let response = await fetch(`${this.c2URL}${canonicalURI}`, requestInit);
                    switch (response.status) {
                        case 404:
                            alert((await response.json()).error);
                            /* falls through */
                        case 204:
                            this.sessionExecutions = this.sessionExecutions.filter(
                                e => e.execution_id != executionID
                            );
                            break;
                        case 401:
                            alert((await response.json()).error);
                            break;
                        default:
                            alert(
                                'Unexpected response from Command and Control server when trying '
                                + 'to delete the execution.'
                            );
                    }
                } catch (err) {
                    alert(
                        'Something went wrong when trying to contact the Command and Control '
                        + 'server trying to delete the execution.'
                    );
                }
            }
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

<style scoped>
.session-information-card {
    max-width: 800px;
}

.background-title {
    color: white;
}

.back-button {
    color: white;
    font-size: 2.5rem;
}

.back-button:hover {
    color:gray;
    cursor: pointer;
}
</style>