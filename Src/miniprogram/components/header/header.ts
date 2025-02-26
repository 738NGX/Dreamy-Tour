Component({
  properties: {
    tabList: {
      type: Array,
      value: []
    }
  },
  methods: {
    onTabChange(e: { detail: { value: any; }; }) {
      const { value } = e.detail;
      this.triggerEvent('childPageChange', { value });
    }
  }
});
