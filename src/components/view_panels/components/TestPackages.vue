<template>
    <b-container fluid>
        <b-row>
            <b-col class="black-background p-3" cols="4">
                <h5>Root packages</h5>
                <b-form-radio-group v-model="selected" :options="rootOptions" stacked />
            </b-col>
            <b-col class="p-3" cols="8">
                <h5>Details</h5>
                <package-expansion :pack="selected" v-if="selected" />
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import PackageExpansion from './PackageExpansion.vue';

export default {
    name: 'test-packages',

    components: {
        'package-expansion': PackageExpansion
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

<style scoped>
.black-background {
    background-color: rgb(51, 51, 51);
    color: white;
}
</style>