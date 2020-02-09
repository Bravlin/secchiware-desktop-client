<template>
    <b-card title="Test packages" align="left">
        <b-card no-body>
            <b-tabs card>
                <b-tab title="Root" active>
                    <b-form-radio-group v-model="selected" :options="rootOptions" stacked />
                </b-tab>
                <b-tab v-if="selected" title="Details">
                    <package-expansion :pack="selected" />
                </b-tab>
            </b-tabs>
        </b-card>
    </b-card>
</template>

<script>
import PackageExpansion from './PackageExpansion.vue';

export default {
    name: 'test-packages',

    components: {
        PackageExpansion
    },
    
    data() {
        return {
            selected: null,
        }
    },

    props: {
        packages: {
            type: Array,
            required: true
        }
    },

    computed: {
        rootOptions() {
            let options = [];
            this.packages.forEach(pack => {
                options.push({text: pack.name, value: pack});
            });
            return options;
        }
    }
};
</script>