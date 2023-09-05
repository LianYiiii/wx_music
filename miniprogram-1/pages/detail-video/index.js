// pages/detail-video/index.js
import {getRelatedVideo, getMVDetail, getMVURL } from '../../service/api_videos';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvURLInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 1. 获取传入id
    const id = options.id;

    // 2. 获取页面数据
    this.getPageData(id);
    
    // 3. 其它逻辑
  },

  getPageData: function(id){
    // 1. 请求播放地址
    getMVURL(id).then(res => {
      this.setData({ mvURLInfo: res.data});
    });
    
    // 2. 请求视频信息
    getMVDetail(id).then(res => {
      this.setData({ mvDetail: res.data});
    })
    
    // 3. 请求相关视频
    getRelatedVideo(id).then(res => {
      console.log(res);
      this.setData({ relatedMV: res.data});
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})