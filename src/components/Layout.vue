<template>
    <div id="layout" class="d-flex">
        <div id="navbar" class="d-flex flex-column">
            <div class="py-1 navbar-button" @click="changePanel('command-control-panel')">
                <b-icon-cloud-fill class="navbar-icon"></b-icon-cloud-fill>
            </div>
            <div class="py-1 navbar-button">
                <b-icon-laptop class="navbar-icon"></b-icon-laptop>
            </div>
            <div class="py-1 navbar-button">
                <b-icon-documents class="navbar-icon"></b-icon-documents>
            </div>
            <div class="py-1 navbar-button mt-auto" @click="changePanel('connection-form')">
                <b-icon-gear-fill class="navbar-icon"></b-icon-gear-fill>
            </div>
        </div>
        <component
            :is="currentPanel"
            v-if="panelConditions"
            v-bind="panelProps"
            v-on="panelEvents"
            class="main-content flex-grow-1"
        ></component>
    </div>
</template>

<script>
import CommandControlPanel from './view_panels/CommandControlPanel.vue';
import ConnectionForm from './ConnectionForm.vue';

export default {
    name: 'layout',

    components: {
        CommandControlPanel,
        ConnectionForm
    },

    data() {
        return {
            sessionStart: new Date(),
            environments: null,
            availablePackages: null,
            currentPanel: 'command-control-panel'
        };
    },

    props: {
        c2: {
            type: Object,
            required: true
        }
    },

    methods: {
        changePanel(panel) {
            this.currentPanel = panel;
        },

        newConnection(c2) {
            this.c2 = c2;
            this.sessionStart = new Date(),

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
    },

    computed: {
        panelConditions() {
            switch (this.currentPanel) {
                case 'command-control-panel':
                    return this.environments && this.availablePackages;
                default:
                    return true;
            }
        },

        panelProps() {
            switch (this.currentPanel) {
                case 'command-control-panel':
                    return {
                        c2: this.c2,
                        sessionStart: this.sessionStart,
                        environments: this.environments,
                        availablePackages: this.availablePackages
                    };
                default:
                    return null;
            }
        },

        panelEvents() {
            switch (this.currentPanel) {
                case 'connection-form':
                    return {connected: this.newConnection};
                default:
                    return null;
            }
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