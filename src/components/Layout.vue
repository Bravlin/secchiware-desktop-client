<template>
    <div id="layout" class="d-flex">
        <div id="navbar" class="d-flex flex-column">
            <div class="py-1 navbar-button">
                <b-icon-cloud-fill class="navbar-icon"></b-icon-cloud-fill>
            </div>
            <div class="py-1 navbar-button">
                <b-icon-laptop class="navbar-icon"></b-icon-laptop>
            </div>
            <div class="py-1 navbar-button">
                <b-icon-documents class="navbar-icon"></b-icon-documents>
            </div>
            <div class="py-1 navbar-button mt-auto">
                <b-icon-gear-fill class="navbar-icon"></b-icon-gear-fill>
            </div>
        </div>
        <!-- <b-container id="main-content" fluid></b-container> -->
        <command-control-panel
            v-if="environments && availablePackages"
            :c2="c2"
            :sessionStart="sessionStart"
            :environments="environments"
            :availablePackages="availablePackages"
            class="main-content flex-grow-1">
        </command-control-panel>
    </div>
</template>

<script>
import CommandControlPanel from './view_panels/CommandControlPanel.vue'

export default {
    name: 'layout',

    components: {
        CommandControlPanel
    },

    data() {
        return {
            sessionStart: new Date(),
            environments: null,
            availablePackages: null
        };
    },

    props: {
        c2: {
            type: Object,
            required: true
        }
    },

    created() {
        fetch(this.c2.url + '/test_sets')
        .then(response => response.json())
        .then(data => {
            this.availablePackages = data;
        });

        fetch(this.c2.url + '/environments')
        .then(response => response.json())
        .then(data => {
            this.environments = data;
        });
    }
};
</script>

<style scoped>
#layout {
  height: 100vh;
}

#navbar, .navbar-button {
    width: 70px;
}

#navbar .navbar-button:hover {
    color:gray;
    cursor: -webkit-grabbing;
}

#navbar .navbar-icon {
    width: 50px;
    height: 50px;
    margin-left: auto;
    margin-right: auto;
}

.main-content {
    background-color: #424242;
}
</style>