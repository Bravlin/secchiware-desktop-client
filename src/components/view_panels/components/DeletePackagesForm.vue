<template>
    <b-container fluid>
        <b-form @submit.prevent="handleSubmit">
            <b-row>
                <b-col class="black-background py-3" cols="6">
                    <h5>Root packages</h5>
                    <b-form-checkbox-group
                        id="delete-packages-checkbox"
                        v-model="selected"
                        :options="rootOptions"
                        name="root-package"
                        stacked
                    />
                </b-col>
                <b-col cols="6" class="text-center py-3">
                    <b-alert v-model="error" variant="danger" dismissible>
                        {{ this.errorMessage }}
                    </b-alert>
                    <b-button type="submit" variant="dark" class="mt-1">Delete</b-button>
                </b-col>
            </b-row>
        </b-form>
    </b-container>
</template>

<script>
import Vue from 'vue';

export default {
    name: 'delete-packages-form',

    data() {
        return {
            selected: [],
            error: false,
            errorMessage: ''
        };
    },

    props: {
        packages: {
            type: Array,
            required: true
        },
        c2URL: {
            type: String,
            required: true
        },
        c2Password: {
            type: String,
            required: true
        },
        baseEndpoint: {
            type: String,
            required: true
        }
    },

    methods: {
        async handleSubmit() {
            var pack, requestInit, canonicalURI, signature, response, deleted;
            
            this.clearStatus();

            if (this.invalidSelection) {
                this.error = true;
                this.errorMessage = 'You must select at least on package.';
            } else {
                requestInit = {
                    method: 'DELETE',
                    headers: new Headers()
                }
                for (pack of this.selected) {
                    canonicalURI = `${this.baseEndpoint}/${pack}`;
                    signature = Vue.newSignature(
                        this.c2Password,
                        requestInit.method,
                        canonicalURI
                    );
                    requestInit.headers.set(
                        'Authorization',
                        Vue.newAuthorizationHeader('Client', signature)
                    );
                    try {
                        response = await fetch(`${this.c2URL}${canonicalURI}`, requestInit);
                        if (response.status == 204)
                            deleted = true;
                        else if (response.status == 404) {
                            alert(`Package '${pack}' does not exist`)
                            deleted = true;
                        }
                        else {
                            this.$emit('error', response);
                            deleted = false;
                        }
                    } catch (err) {
                        alert('Something went wrong when trying to contact the Command and Control server.');
                    }
                }
                if (deleted) {
                    this.selected = [];
                    this.$emit('packagesDeleted');
                }
            }
        },

        clearStatus() {
            this.error = false;
            this.errorMessage = '';
        }
    },

    computed: {
        rootOptions() {
            var options = [];
            var p;
            for (p of this.packages)
                options.push({text: p.name, value: p.name});
            return options;
        },

        invalidSelection() {
            return this.selected.length === 0;
        }
    }
};
</script>

<style scoped>
.black-background {
    background-color: rgb(51, 51, 51);
    color: white;
}
</style>