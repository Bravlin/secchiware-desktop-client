<template>
    <b-container fluid>
        <b-row style="height: 100%">
            <b-col class="search-form" cols="5" md="4" lg="3" xl="2">
                <h5>Sessions</h5>
                <b-form @submit.prevent="search">
                    <b-form-group
                        id="ids-filter"
                        label="IDs"
                        label-for="search-ids"
                    >
                        <b-form-input id="search-ids" type="text" v-model="searchFields.ids"/>
                    </b-form-group>
                    <b-form-group
                        id="session-start-from-filter"
                        label="Start from"
                        label-for="search-start-from"
                    >
                        <b-form-input
                            id="search-start-from"
                            type="datetime-local"
                            v-model="searchFields.start_from"
                        />
                    </b-form-group>
                    <b-form-group
                        id="session-start-to-filter"
                        label="Start to"
                        label-for="search-start-to"
                    >
                        <b-form-input
                            id="search-start-to"
                            type="datetime-local"
                            v-model="searchFields.start_to"
                        />
                    </b-form-group>
                    <b-form-group
                        id="session-end-from-filter"
                        label="End from"
                        label-for="search-end-from"
                    >
                        <b-form-input
                            id="search-end-from"
                            type="datetime-local"
                            v-model="searchFields.end_from"
                        />
                    </b-form-group>
                    <b-form-group
                        id="session-end-to-filter"
                        label="End to"
                        label-for="search-end-to"
                    >
                        <b-form-input
                            id="search-end-to"
                            type="datetime-local"
                            v-model="searchFields.end_to"
                        />
                    </b-form-group>
                    <b-form-group
                        id="ips-filter"
                        label="IPs"
                        label-for="search-ips"
                    >
                        <b-form-input id="search-ips" type="text" v-model="searchFields.ips" />
                    </b-form-group>
                    <b-form-group
                        id="ports-filter"
                        label="Ports"
                        label-for="search-ports"
                    >
                        <b-form-input id="search-ports" type="text" v-model="searchFields.ports" />
                    </b-form-group>
                    <b-form-group
                        id="systems-filter"
                        label="Operating systems"
                        label-for="search-systems"
                    >
                        <b-form-input
                            id="search-systems"
                            type="text"
                            v-model="searchFields.systems"
                        />
                    </b-form-group>
                    <b-form-group
                        id="order-by"
                        label="Order by"
                        label-for="search-order"
                    >
                        <b-form-select id="search-order" v-model="searchFields.order_by">
                            <b-form-select-option :value="null">
                                Select an option
                            </b-form-select-option>
                            <b-form-select-option value="id">ID</b-form-select-option>
                            <b-form-select-option value="start">
                                Session start
                            </b-form-select-option>
                            <b-form-select-option value="end">Session end</b-form-select-option>
                            <b-form-select-option value="ip">IP</b-form-select-option>
                            <b-form-select-option value="port">Port</b-form-select-option>
                            <b-form-select-option value="system">
                                Operating system
                            </b-form-select-option>
                        </b-form-select>
                    </b-form-group>
                    <b-form-group
                        id="arrange"
                        label="Arrange"
                        label-for="search-arrange"
                    >
                        <b-form-select
                            id="search-arrange"
                            v-model="searchFields.arrange"
                            :disabled="searchFields.order_by == null"
                        >
                            <b-form-select-option value="asc">Ascending</b-form-select-option>
                            <b-form-select-option value="desc">Descending</b-form-select-option>
                        </b-form-select>
                    </b-form-group>
                    <b-form-group
                        id="limit"
                        label="Limit"
                        label-for="search-limit"
                    >
                        <b-form-input
                            id="search-limit"
                            type="number"
                            v-model="searchFields.limit"
                            min="0"
                        />
                    </b-form-group>
                    <b-button type="submit" variant="light">Search</b-button>
                </b-form>
            </b-col>
            <b-col cols="7" md="8" lg="9" xl="10" class="p-5">
                <session-search-item-card
                    v-for="sr in searchResults"
                    :key="sr.session_id"
                    :sessionSearchItem="sr"
                />
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import SessionSearchItemCard from './components/SessionSearchItemCard.vue';

export default {
    name: 'sessions-panel',

    components: {
        'session-search-item-card': SessionSearchItemCard
    },

    props: {
        c2URL: {
            type: String,
            required: true
        }
    },

    data() {
        var searchFields = {
            ids: null,
            start_from: null,
            start_to: null,
            end_from: null,
            end_to: null,
            ips: null,
            ports: null,
            systems: null,
            order_by: null,
            arrange: null,
            limit: null
        };
        return {
            searchFields: searchFields,
            searchResults: null
        }
    },

    methods: {
        async search() {
            var key, value;
            var query = '';
            var url = `${this.c2URL}/sessions`;

            for ([key, value] of Object.entries(this.searchFields))
                if (value)
                    query += `&${key}=${value}`;
            
            if (query) {
                query = query.slice(1);
                url += `?${query}`;
            }

            try {
                let response = await fetch(url);
                switch (response.status) {
                    case 200:
                        this.searchResults = await response.json();
                        if (this.searchResults.length == 0)
                            alert('No session matching the given criteria was found!');
                        break;
                    case 400:
                        alert((await response.json()).error);
                        break;
                    default:
                        alert(
                            'Unexpected response from Command and Control server when trying to '
                            + 'find sessions.'
                        );
                }
            } catch(err) {
                alert('Something went wrong trying to search for sessions.');
            }
        }
    }
};
</script>

<style scoped>
.search-form {
    color: white;
    background-color: rgb(51, 51, 51);
}
</style>