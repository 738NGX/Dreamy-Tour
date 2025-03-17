/**
 * 折叠栏组件
 */
Component({
  properties: {
    header: {
      type: String,
      value: ''
    },
    defaultActiveValues: {
      type: Array,
      value: []
    }
  },
  data: {
    activeValues: [] as any[]
  },
  attached() {
    this.setData({
      activeValues: this.data.defaultActiveValues
    });
  },
  methods: {
    handleChange(e:any) {
      this.setData({
        activeValues: e.detail.value
      });
    }
  }
});
