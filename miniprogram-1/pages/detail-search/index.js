// pages/detail-search/index.js

import {getSearchHot, getSearchSuggest,getSearchResult} from '../../service/api_music';
// import {stringToNodes} from '../../utils/string2Nodes'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotKeyWords: [],
    searchSuggestList: [],
    searchValue: '',
    suggestSongsNodes: [],
    resultSongs: [],
    historyList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getPageData();
    // console.log(this.data.historyList);
  },

  getPageData: function(){
    getSearchHot().then(res => {
      // console.log(res.data.result.hots);
      this.setData({hotKeyWords: res.data.result.hots})
    }).catch(err => {
      console.log(err);
    })
  },

  getSearchChange:function(e){
    // console.log('change');
    // 1. 关键字
    const searchValue = e.detail;

    // 2. 保存关键字
    this.setData({searchValue});

    // 3.无关键字，清空推荐列表
    if(!searchValue.length) {
      // 即使 searchValue 为空，推荐歌曲列表中也可能有值，所以为了保证搜索栏中没有值的情况下显示默认页面
      // 需要清空歌曲列表
      this.setData({searchSuggestList:[]});
      this.setData({resultSongs:[]});
      // console.log('sesarch null');
      return;
    }

    // 4. 搜索
    getSearchSuggest(searchValue).then(res => {
      // console.log(res);
      // 1. 获取建议关键字列表
      this.setData({searchSuggestList: res.data.result.allMatch});

      // 2. 转成nodes节点
      const suggestSongs = res.data.result.allMatch;
      const suggestKeyWords = suggestSongs.map(item => item.keyword);
      // console.log(suggestKeyWords);
      const suggestSongsNodes = [];
      
      for(const keyword in suggestKeyWords){
        // stringToNodes();
        const nodes = [];
        if(suggestKeyWords[keyword].toUpperCase().startsWith(searchValue.toUpperCase())){
          // console.log(suggestKeyWords[keyword]);
          const key1 = suggestKeyWords[keyword].slice(0, searchValue.length);
          // console.log(key1);
          const node1 = {
            name: 'span',
            attrs: {style: "color: #26ce8a;"},
            children: [{type: "text", text: key1}]
          };
          nodes.push(node1);
          
          const key2 = suggestKeyWords[keyword].slice(searchValue.length);
          // console.log(key2);
          const node2 = {
            name: 'span',
            attrs: {style: "color: #000; font-size: 32rpx;"},
            children: [{type: "text", text: key2}]
          };
          nodes.push(node2);
        }else{
          // console.log(suggestKeyWords[keyword]);
          const node = {
            name: 'span',
            attrs: {style: "color: #000;"},
            children: [{type: "text", text: suggestKeyWords[keyword]}]
          };
          nodes.push(node);
        }
        suggestSongsNodes.push(nodes);
      }
      this.setData({suggestSongsNodes: suggestSongsNodes})
    }).catch(err => {
      console.log(err);
    })
  },

  // 点击搜索
  getSearchAction: function(){
    const searchValue = this.data.searchValue;
    const historyList = this.data.historyList;
    // console.log(searchValue);
    getSearchResult(searchValue).then(res=>{
      // console.log(res);
      this.setData({ resultSongs:res.data.result.songs });
      // console.log(this.data.resultSongs);
      if(searchValue && !historyList.includes(searchValue)){
        historyList.unshift(searchValue);
        console.log(historyList);
        this.setData({historyList});
      }else if(searchValue && historyList.includes(searchValue)){
        const newHistoryList = historyList.filter(item => item !== searchValue);
        newHistoryList.unshift(searchValue)
        this.setData({historyList: newHistoryList});
      }
      })
  },
  // 点击取消搜索
  getSearchCancel(){
    this.setData({resultSongs: []});
    this.setData({searchValue: ''});
  },
  // 聚焦搜索框
  getSearchFocus(){
    console.log('ehll');
  },
  // 搜索推荐
  handleSuggestItemClick(e){
    // console.log(e);
    const index = e.currentTarget.dataset.item;
    // console.log(index);
    // console.log(this.data.searchSuggestList[index]);
    const searchValue = this.data.searchSuggestList[index].keyword;
    // console.log(searchValue);
    this.setData({searchValue});

    this.getSearchAction();
  },
  // 热搜推荐
  handleHotSuggestItem(e){
    // 1. 获取点击关键字
    const keyword = e.currentTarget.dataset.item;
    const searchValue = this.data.searchValue;

    const historyList = this.data.historyList;

    // 2. 设置关键字到 searchValue 中
    this.setData({searchValue: keyword});
    if(searchValue && !historyList.includes(searchValue)){
      historyList.unshift(searchValue);
      console.log(historyList);
      this.setData({historyList});
    }else if(searchValue && historyList.includes(searchValue)){
      const newHistoryList = historyList.filter(item => item !== searchValue);
      newHistoryList.unshift(searchValue)
      this.setData({historyList: newHistoryList});
  }


    // 3.判断为空
    if(!this.data.searchValue.length){
      this.setData({suggestSongs: []});
      this.setData({resultSongs: []});
    }

    // 4. 发送网络请求
    this.getSearchAction();
  },
  // 历史搜索点击
  handleHistoryItemClick(e){
    // console.log(e);
    const index = e.currentTarget.dataset.item;
    // console.log(index);
    // console.log(this.data.searchSuggestList[index]);
    const searchValue = this.data.historyList[index];
    // console.log(searchValue);
    this.setData({searchValue});

    this.getSearchAction();
  },

})