// pages/mv/mv.js
import {getTopMV} from '../../service/api_videos'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // mv 的数据
    topMVs:[],
    // 是否有更多数据
    hasMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 封装网络请求
  getTopMVData: async function(offset){
    // 判断是否可以请求
    if(!this.data.hasMore && offset !== 0) return;

    // 展示加载动画
    wx.showNavigationBarLoading();
    
    //  请求数据
    const res = await getTopMV(offset);
    // console.log(res);
    console.log(res.data.data);
    let newData = this.data.topMVs;
    if(offset === 0){
      newData = res.data.data;
    }else{
      newData = newData.concat(res.data.data);
    }
    
    // 设置数据
    this.setData({topMVs: newData});
    this.setData({hasMore: res.data.hasMore});
    wx.hideNavigationBarLoading();
    if(offset === 0){
      wx.stopPullDownRefresh();
    }
  },

  onLoad(options) {
    getTopMV(10, 30).then(res => {
      // console.log('mv获取：'+res.data);
      // console.log('mv获取长度'+res.data.data.length);
      this.setData({topMVs: res.data.data});
      // console.log(topMVs);
    });
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
  onPullDownRefresh: async function() {
    // 下拉刷新，同时需要在json文件中配置 enablePulldownRefresh 为 true
    // const res = await getTopMV(0);
    // this.setData({topMVs: res.data});
    this.getTopMVData(0);
  },
  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function() {
    this.getTopMVData(this.data.topMVs.length); 
    // 没有后续数据就不再实现下拉刷新
    // if(!this.data.hasMore) return;
    // 下拉刷新，添加新的后10首歌曲
    // const res = await getTopMV(this.data.topMVs.length);
    // this.setData({topMVs: this.data.topMVs.concat(res.data)});
    // this.setData({hasMore: res.hasMore});
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})