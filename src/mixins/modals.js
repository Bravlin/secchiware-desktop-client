export default {
    methods: {
        showErrorModal(message) {
            this.$bvModal.msgBoxOk(message, {
                title: 'Error',
                headerBgVariant: 'danger',
                headerTextVariant: 'light',
                okVariant: 'dark'
            });
        },

        showSuccessModal(message) {
            this.$bvModal.msgBoxOk(message, {
                title: 'Success',
                headerBgVariant: 'success',
                headerTextVariant: 'light',
                okVariant: 'dark'
            });
        }
    }
};