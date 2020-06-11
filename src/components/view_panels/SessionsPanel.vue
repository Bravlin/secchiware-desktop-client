<template>
    <div>
        <sessions-search-subpanel
            v-show="!requestedSessionID"
            :c2URL="c2URL"
            @detailsRequested="setRequestedSessionID"
        />
        <session-information-subpanel
            v-if="requestedSessionID"
            :c2URL="c2URL"
            :sessionID="requestedSessionID"
            @back="setRequestedSessionID(null)"
        />
    </div>
</template>

<script>
import SessionsSearchSubpanel from './sessions_panel_subpanels/SessionsSearchSubpanel.vue';
import SessionInformationSubpanel from './sessions_panel_subpanels/SessionInformationSubpanel.vue';

export default {
    name: 'sessions-panel',

    components: {
        'sessions-search-subpanel': SessionsSearchSubpanel,
        'session-information-subpanel': SessionInformationSubpanel
    },

    data() {
        return {
            requestedSessionID: null
        }
    },

    props: {
        c2URL: {
            type: String,
            required: true
        }
    },

    methods: {
        setRequestedSessionID(sessionID) {
            this.requestedSessionID = sessionID;
        }
    }
};
</script>