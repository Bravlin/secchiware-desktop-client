<template>
    <b-card title="Test packages" align="left">
        <b-card no-body>
            <b-tabs card>
                <b-tab title="Root" active>
                    <b-form-group>
                        <b-form-radio
                            v-for="pack in availablePackages"
                            :key="pack.name"
                            v-model="selected"
                            :value="pack"
                        >
                            {{ pack.name }}
                        </b-form-radio>
                    </b-form-group>
                </b-tab>
                <b-tab v-if="selected" title="Details">
                    <package-expansion :pack="selected"></package-expansion>
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
        availablePackages: {
            type: Array,
            required: true
        }
    }
};
</script>