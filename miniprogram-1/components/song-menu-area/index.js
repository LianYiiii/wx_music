// components/song-menu-area/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type: Object,
      value: {}
    },
    title: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleMenuClick(e){
      const item = e.currentTarget.dataset.item;
      // console.log(item);
      wx.navigateTo({
        // 保证扩展性——添加一个字段，告诉页面是从哪里跳转来的
        url: `/pages/detail-songs/index?id=${item.id}&type=menu`,
      })
    }
  }
})
