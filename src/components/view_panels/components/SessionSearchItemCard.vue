<template>
    <b-card title="Search result" align="left">
        <b-tabs pills active-nav-item-class="bg-secondary" nav-class="bg-dark">
            <b-tab title="Summary" title-link-class="text-light" active>
                <h5>Session ID: {{ sessionSearchItem.session_id }}</h5>
                <div>Status: {{ isActive ? 'Active' : 'Closed' }}</div>
                <div>Session start: {{ sessionSearchItem.session_start }}</div>
                <div v-if="isActive">Session end: {{ sessionSearchItem.session_end }}</div>
                <div>Environment's IP: {{ sessionSearchItem.ip }}</div>
                <div>Environment's port: {{ sessionSearchItem.port }}</div>
                <div>Environment's platform: {{ sessionSearchItem.platform_os_system }}</div>
            </b-tab>
        </b-tabs>
    </b-card>
</template>

<script>
export default {
    name: 'session-search-item-card',

    props: {
        sessionSearchItem: {
            type: Object,
            required: true
        }
    },

    computed: {
        isActive() {
            return !this.sessionSearchItem.hasOwnProperty('session_end');
        }
    }
};
</script>