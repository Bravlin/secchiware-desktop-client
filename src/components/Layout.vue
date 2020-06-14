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
            <div 
                class="py-1 navbar-button mt-auto"
                :class="{active: currentPanel == 'command-control-url-form'}"
                @click="changePanel('command-control-url-form')"
            >
                <b-icon-gear-fill class="navbar-icon" />
            </div>
        </div>
        <component
            :is="currentPanel"
            v-if="panelConditions"
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
import CommandControlURLForm from './CommandControlURLForm.vue';

export default {
    name: 'layout',

    components: {
        'command-control-panel': CommandControlPanel,
        'environments-panel': EnvironmentsPanel,
        'sessions-panel': SessionsPanel,
        'command-control-url-form': CommandControlURLForm,
    },

    data() {
        return {
            availablePackages: null,
            currentPanel: 'command-control-panel',
            eventSource: null
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
                    alert("Unexpected response from the Command an Control server when trying to recover its available tests.");
                else
                    this.availablePackages = await response.json();
            } catch (err) {
                alert("Something went wrong when trying to recover the tests available at the Command and Control server.");
            }
        },

        newC2URL(c2URL) {
            this.c2URL = c2URL;
            this.setAvailablePackages();
            if (this.eventSource)
                this.eventSource.close();
        },
    },

    computed: {
        panelConditions() {
            return this.currentPanel === 'command-control-panel' ? this.availablePackages : true;
        },

        panelProps() {
            switch (this.currentPanel) {
                case 'command-control-panel':
                    return {
                        c2URL: this.c2URL,
                        c2Password: this.c2Password,
                        availablePackages: this.availablePackages
                    };
                case 'environments-panel':
                    return {
                        c2URL: this.c2URL,
                        c2Password: this.c2Password,
                        availablePackages: this.availablePackages
                    };
                case 'sessions-panel':
                    return {
                        c2URL: this.c2URL,
                        c2Password: this.c2Password
                    }
                default:
                    return null;
            }
        },

        panelEvents() {
            switch (this.currentPanel) {
                case 'connection-form':
                    return {connected: this.newConnection};
                case 'command-control-panel':
                    return {
                        packagesDeleted: this.setAvailablePackages,
                        packagesUploaded: this.setAvailablePackages,
                    };
                default:
                    return null;
            }
        }
    },

    created() {
        this.setAvailablePackages();    }
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