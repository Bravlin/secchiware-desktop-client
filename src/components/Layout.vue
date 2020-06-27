<template>
    <div id="layout" class="d-flex">
        <div id="navbar" class="d-flex flex-column">
            <div
                class="py-1 navbar-button"
                :class="{active: currentPanel == 'command-control-panel'}"
                @click="changePanel('command-control-panel')"
            >
                <b-icon-cloud-fill class="navbar-icon" />
            </div>
            <div 
                class="py-1 navbar-button"
                :class="{active: currentPanel == 'environments-panel'}"
                @click="changePanel('environments-panel')"
            >
                <b-icon-laptop class="navbar-icon" />
            </div>
            <div class="py-1 navbar-button"
                :class="{active: currentPanel == 'sessions-panel'}"
                @click="changePanel('sessions-panel')"
            >
                <b-icon-documents class="navbar-icon" />
            </div>
        </div>
        <component
            :is="currentPanel"
            v-bind="panelProps"
            v-on="panelEvents"
            class="main-content flex-grow-1"
            style="overflow: auto;"
        />
    </div>
</template>

<script>
import CommandControlPanel from './view_panels/CommandControlPanel.vue';
import EnvironmentsPanel from './view_panels/EnvironmentsPanel.vue';
import SessionsPanel from './view_panels/SessionsPanel';

export default {
    name: 'layout',

    components: {
        'command-control-panel': CommandControlPanel,
        'environments-panel': EnvironmentsPanel,
        'sessions-panel': SessionsPanel,
    },

    data() {
        return {
            availablePackages: [],
            currentPanel: 'command-control-panel'
        };
    },

    props: {
        c2URL: {
            type: String,
            required: true
        },
        c2Password: {
            type: String,
            required: true
        }
    },

    methods: {
        changePanel(panel) {
            this.currentPanel = panel;
        },

        async setAvailablePackages() {
            try {
                let response = await fetch(`${this.c2URL}/test_sets`);
                if (response.status != 200)
                    this.$bvModal.msgBoxOk(
                        'Unexpected response from the Command an Control server when trying to '
                        + 'recover its available tests.'
                    );
                else
                    this.availablePackages = await response.json();
            } catch (err) {
                this.$bvModal.msgBoxOk(
                    'Something went wrong when trying to recover the tests available at the '
                    + 'Command and Control server. Please, verify that the application is '
                    + 'correctly configured.'
                );
            }
        },

        removePackages(deletedPackages) {
            this.availablePackages = this.availablePackages.filter(
                pack => !deletedPackages.has(pack.name)
            );
        },

        newC2URL(c2URL) {
            this.c2URL = c2URL;
            this.setAvailablePackages();
        },

        propagateNewC2Configuration(c2URL, c2Password) {
            this.$emit('newC2Configuration', c2URL, c2Password);
        }
    },

    computed: {
        panelProps() {
            var props = {};
            switch (this.currentPanel) {
                case 'command-control-panel':
                case 'environments-panel':
                    props.availablePackages = this.availablePackages;
                    // falls through
                case 'sessions-panel':
                    props.c2URL = this.c2URL;
                    props.c2Password = this.c2Password
                    return props;
                default:
                    return null;
            }
        },

        panelEvents() {
            switch (this.currentPanel) {
                case 'command-control-panel':
                    return {
                        packagesRefreshRequested: this.setAvailablePackages,
                        packagesDeleted: this.removePackages,
                        newC2Configuration: this.propagateNewC2Configuration
                    };
                case 'environments-panel':
                    return {packagesRefreshRequested: this.setAvailablePackages};
                default:
                    return null;
            }
        }
    },

    created() {
        this.setAvailablePackages();
    }
};
</script>

<style scoped>
#layout {
  height: 100vh;
}

#navbar, .navbar-button {
    width: 50px;
}

#navbar .navbar-button:hover {
    color:gray;
    cursor: pointer;
}

#navbar .active {
    color: gray;
    box-shadow: 5px 0px grey inset;
}

#navbar .navbar-icon {
    width: 40px;
    height: 40px;
    margin-left: auto;
    margin-right: auto;
}

.main-content {
    background-color: #424242;
}
</style>