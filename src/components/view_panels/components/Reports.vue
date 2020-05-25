<template>
    <b-container fluid>
        <b-row>
            <b-col class="black-background p-3" cols="4">
                <h5>Reports</h5>
                <b-form-radio-group v-model="selected" :options="reportsOptions" stacked />
            </b-col>
            <b-col class="p-3" cols="8">
                <h5>Details</h5>
                <template v-if="selected">
                    <div><b>Name:</b> {{ selected.test_name }}</div>
                    <div><b>Status:</b> 
                        <span :class="correspondingClass(selected.result_code)">
                            {{ selectedStatus() }}
                        </span>
                    </div>
                    <div><b>Time of start:</b> {{ selected.timestamp_start }}</div>
                    <div><b>Time of end:</b> {{ selected.timestamp_start }}</div>
                    <div><b>Description:</b> {{ selected.test_description }}</div>
                    <template v-if="selected.hasOwnProperty('additional_info')">
                        <div><b>Additional information:</b></div>
                        <div
                            v-for="(value, field) in selected.additional_info"
                            :key="field"
                            class="pl-3"
                        >
                            <b>{{ `${fieldFormatter(field)}:` }}</b> {{value}}
                        </div>
                    </template>
                </template>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
export default {
    name: 'reports',

    data() {
        return {
            selected: null
        }
    },

    props: {
        reports: {
            type: Array,
            required: true
        }
    },

    methods: {
        correspondingClass(resultCode) {
            if (resultCode > 0)
                return 'successful-test';
            if (resultCode < 0)
                return 'failed-test';
            return 'indeterminate-test';
        },

        fieldFormatter(field) {
            return field.replace(/_/g, ' ').replace(/./, field.charAt(0).toUpperCase());
        },

        selectedStatus() {
            if (this.selected.result_code > 0)
                return 'SUCCESSFUL';
            if (this.selected.result_code < 0)
                return 'FAILED';
            return 'INDETERMINATE';
        }
    },

    computed: {
        reportsOptions() {
            var options = [];
            var rep;
            var cssClass;
            var htmlContent;
            for (rep of this.reports) {
                cssClass = this.correspondingClass(rep.result_code);
                htmlContent = `<span class="${cssClass}">${rep.test_name}</span>`;
                options.push({html: htmlContent, value: rep});
            }
            return options;
        }
    }
};
</script>

<style scoped>
.black-background {
    background-color: rgb(51, 51, 51);
    color: white;
}

.successful-test {
    color: green;
}

.indeterminate-test {
    color: orange;
}

.failed-test {
    color: red;
}
</style>