// components/video-item-v1/index.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      default: {},
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    mvURLInfo: {},
    mvDetail:{},
    relatedMV: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemClick: function(e){
      // 获取id
      const id = e.currentTarget.dataset.item.id;
      // console.log(id);

      // 页面跳转
      wx.navigateTo({
        url: '/pages/detail-video/index?id=' + id
      })
    },

  }
})
