<template>
    <b-card title="Reports" align="left">
        <b-card v-if="reports" no-body>
            <b-tabs card>
                <b-tab title="Tests" active>
                    <b-form-radio-group v-model="selected" :options="testsOptions" stacked />
                </b-tab>
                <b-tab v-if="selected" title="Details">
                    <b-card-text>Name: {{ selected.test_name }}</b-card-text>
                    <b-card-text>Description: {{ selected.test_description }}</b-card-text>
                    <b-card-text>Result code: {{ selected.result_code }}</b-card-text>
                    <template v-if="selected.hasOwnProperty('additional_info')">
                        <b-card-text>Additional information:</b-card-text>
                        <b-card-text
                            v-for="(value, field) in selected.additional_info"
                            :key="field"
                            class="pl-4"
                        >
                            {{ fieldFormatter(field) + ': ' + value }}
                        </b-card-text>
                    </template>
                </b-tab>
            </b-tabs>
        </b-card>
        <b-button @click="getReports">Execute all</b-button>
    </b-card>
</template>

<script>
export default {
    name: 'reports',

    data() {
        return {
            reports: null,
            selected: null
        }
    },

    props: {
        c2URL: {
            type: String,
            required: true
        },
        ip: {
            type: String,
            required: true
        },
        port: {
            type: String,
            required: true
        }
    },

    methods: {
        async getReports() {
            try {
                let response = 
                    await fetch(`${this.c2URL}/environments/${this.ip}/${this.port}/report`);
                this.reports = await response.json();
            } catch (err) {
                alert("Something went wrong when trying to recover the tests' reports.");
            }
        },

        fieldFormatter(field) {
            return field.replace(/_/g, ' ').replace(/./, field.charAt(0).toUpperCase());
        }
    },

    computed: {
        testsOptions() {
            let options = [];
            this.reports.forEach(rep => {
                options.push({text: rep.test_name, value: rep});
            });
            return options;
        }
    }
};
</script>