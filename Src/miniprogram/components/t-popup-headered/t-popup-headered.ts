Component({
    properties: {
        visible: {
            type: Boolean,
            value: false,
        },
        title: {
            type: String,
            value: '',
        },
        placement: {
            type: String,
            value: 'bottom',
        },
        style: {
            type: String,
            value: '',
        },
    },
    methods: {
        onVisibleChange(e: any) {
            this.triggerEvent('visible-change', e.detail);
        },
        onCancel() {
            this.triggerEvent('Cancel');
        },
        onConfirm() {
            this.triggerEvent('Confirm');
        },
    }
});
