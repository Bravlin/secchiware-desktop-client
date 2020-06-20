<template>
    <div>
        <sessions-search-subpanel
            v-show="!requestedSessionID"
            :c2URL="c2URL"
            :eventBus="eventBus"
            @detailsRequested="setRequestedSessionID"
        />
        <session-information-subpanel
            v-if="requestedSessionID"
            :c2URL="c2URL"
            :c2Password="c2Password"
            :sessionID="requestedSessionID"
            @back="setRequestedSessionID(null)"
            @sessionDeleted="handleSessionDeleted"
        />
    </div>
</template>

<script>
import SessionsSearchSubpanel from './sessions_panel_subpanels/SessionsSearchSubpanel.vue';
import SessionInformationSubpanel from './sessions_panel_subpanels/SessionInformationSubpanel.vue';
import Vue from 'vue';

export default {
    name: 'sessions-panel',

    components: {
        'sessions-search-subpanel': SessionsSearchSubpanel,
        'session-information-subpanel': SessionInformationSubpanel
    },

    data() {
        return {
            requestedSessionID: null,
            eventBus: new Vue()
        }
    },

    props: {
        c2URL: {
            type: String,
            required: true
        },
        c2Password: {
            type: String,
            required: true
        }
    },

    methods: {
        setRequestedSessionID(sessionID) {
            this.requestedSessionID = sessionID;
        },

        handleSessionDeleted(sessionID) {
            this.eventBus.$emit('sessionDeleted', sessionID);
            this.requestedSessionID = null;
        }
    }
};
</script>