<template>
    <div>
        <div>Name: <b>{{ pack.name }}</b></div>
        <template v-if="pack.modules">
            <div class="clickable" @click="toggleModules">{{ modulesAction }} Modules</div>
            <template v-if="modulesVisible">
                <module-expansion v-for="m in pack.modules" :key="m.name" :mod="m" class="pl-4" />
            </template>
        </template>
        <template v-if="pack.subpackages">
            <div
                class="clickable"
                @click="toggleSubpackages"
            >
                {{ subpackagesAction }} Subpackages
            </div>
            <template v-if="subpackagesVisible">
                <package-expansion 
                    v-for="p in pack.subpackages"
                    :key="p.name"
                    :pack="p"
                    class="pl-4"
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
            subpackagesVisible: false,
            modulesAction: '+',
            subpackagesAction: '+'
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
            this.modulesAction = this.modulesVisible ? '-' : '+';
        },

        toggleSubpackages() {
            this.subpackagesVisible = !this.subpackagesVisible;
            this.subpackagesAction = this.subpackagesVisible ? '-' : '+';
        }
    }
};
</script>

<style scoped>
.clickable:hover {
    color: grey;
    cursor: pointer;
}
</style>