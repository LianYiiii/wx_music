// base-ui/nav-bar/index.js
import {navBarHeight} from '../../constants/index';
Component({
  options:{
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    navBarHeight: navBarHeight
  },

  // 组件的生命周期
  lifetimes:{
    ready: function(){
      // const info = wx.getSystemInfoSync();
      // console.log(this.data.statusBarHeight);
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleLeftClick(){
      // 发送具体事件
      this.triggerEvent('click');
    }
  }
})
