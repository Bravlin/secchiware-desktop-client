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
        },

        showWarningModal(message) {
            this.$bvModal.msgBoxOk(message, {
                title: 'Warning',
                headerBgVariant: 'warning',
                headerTextVariant: 'light',
                okVariant: 'dark'
            });
        },

        showDangerousOperationConfirmationModal(message, okTitle) {
            return this.$bvModal.msgBoxConfirm(message, {
                title: 'Confirmation',
                headerBgVariant: 'dark',
                headerTextVariant: 'light',
                okVariant: 'danger',
                okTitle: okTitle,
                centered: true
            });
        }
    }
};