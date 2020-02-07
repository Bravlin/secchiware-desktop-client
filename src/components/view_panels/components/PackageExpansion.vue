<template>
    <div>
        <div>Name: <b>{{ pack.name }}</b></div>
        <template v-if="pack.modules.length > 0">
            <div class="clickable" @click="toggleModules">Modules</div>
            <template v-if="modulesVisible">
                <module-expansion v-for="m in pack.modules" :key="m.name" :mod="m" class="pl-4" />
            </template>
        </template>
        <template v-if="pack.subpackages.length > 0">
            <div class="clickable" @click="toggleSubpackages">Subpackages</div>
            <template v-if="subpackagesVisible">
                <package-expansion 
                    :key="p.name"
                    :pack="p"
                    class="pl-4" v-for="p in pack.subpackages"
                />
            </template>
        </template>
    </div>
</template>

<script>
import ModuleExpansion from './ModuleExpansion.vue';

export default {
    name: 'package-expansion',

    components: {
        ModuleExpansion,
    },

    data() {
        return {
            modulesVisible: false,
            subpackagesVisible: false
        };
    },

    props: {
        pack: {
            type: Object,
            required: true
        }
    },

    methods: {
        toggleModules() {
            this.modulesVisible = !this.modulesVisible;
        },

        toggleSubpackages() {
            this.subpackagesVisible = !this.subpackagesVisible;
        }
    }
};
</script>

<style scoped>
.clickable:hover {
    color: grey;
    cursor: -webkit-grabbing;
}
</style>