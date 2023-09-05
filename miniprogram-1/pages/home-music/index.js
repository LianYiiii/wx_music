// pages/home-music/index.js
import {getBanner, getRecommendSongMenu, getHotSongMenu} from '../../service/api_music';
import queryRect from '../../utils/query-rect';
import {rankingStore, rankingMap, playerStore} from '../../store/index';
// import {throttle} from '../../utils/tesst'

// 生成节流后的函数
// const throttleQueryRect = throttle(queryRect, 1000, {leading: true, trailing: false});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [],
    swiperHeight: 60,
    recommendSongs: [],
    recommendSongsMenu: [],
    hotSongsMenu: [],
    rankings: [],

    currentSong: {},
    isPlaying: false,
    // 动画播放状态
    playAnimState: 'paused'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // const id = 2049512697
    // playerStore.dispatch("playMusicWithSongIdAction", id)

    // 获取页面数据
    this.getPageData();

    // 发起共享数据的请求
    rankingStore.dispatch("getRankingDataAction");

    this.setupPlayerStoreListener();

  }, 

  // 获取网络请求
  getPageData(){
    getBanner().then(res => {
      // console.log(res.data);
      this.setData({banner: res.data.banners})
    }).catch(err => {
      console.log(err);
    });

    getRecommendSongMenu().then(res => {
      // console.log(res);
      this.setData({recommendSongsMenu: res.data.playlists})
    }).catch(err => {
      console.log(err);
    });

    getHotSongMenu().then(res => {
      // console.log(res);
      this.setData({hotSongsMenu: res.data.playlists});
    }).catch(err => {
      console.log(err);
    })
  },  

  // 点击搜索框
  handleClickToSearch: function(){
    console.log('点击搜索框');
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },

  // Swiper图片加载完成
  handleSwiperImageLoaded(){
    // 获取某一组件的高度
    // const query = wx.createSelectorQuery();
    // query.select('.swiper-image').boundingClientRect();
    // query.exec(res => {
    //   const rect = res[0];
    //   // console.log(rect);
    //   this.setData({swiperHeight: rect.height})
    // })

    queryRect(".swiper-image").then(res => {
      const rect = res[0];
      // console.log(rect);
      this.setData({swiperHeight: rect.height})
    }).catch(err => {
      console.log(err);
    });
  },

  handleMoreClick(){
    // console.log('监听更多点击');
    this.navigateToDetailSongPage("hotRanking");
  },

  handleRankingItemClick(e){
    // console.log('巅峰榜点击');
    // console.log(e.currentTarget.dataset.idx);

    // console.log(rankingMap[e.currentTarget.dataset.idx]);
    this.navigateToDetailSongPage(rankingMap[e.currentTarget.dataset.idx]);
  },

  // navigateToDetailSongPage(rankingName){
  //   // console.log(rankingMap[rankingName]);
    
  //   wx.navigateTo({
  //     url: `/pages/detail-songs/index?rankingName=${rankingName}&type=rank`,
  //   })
  // },

  // 点击暂停/播放
  handlePlayBtnClick(){
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // 可以在此卸载
    // rankingStore.offState("newRanking", this.getNewRankingHandler)
  },

  // 获取榜单数据
  getRankingHandler: function(idx){
    return res => {
      if(Object.keys(res).length === 0) return;
      // console.log(res);
      const name = res.name;
      const coverImgUrl = res.coverImgUrl;
      const playCount = res.playCount;
      const songList = res.tracks.slice(0,3);
      const rankingObj = {name, coverImgUrl, songList, playCount};
      const nowRanking = {...this.data.rankings, [idx]:rankingObj};
      // nowRanking.add(rankingObj);
      this.setData({rankings: nowRanking});
    }
  },

  // 点击每首歌曲播放
  handleSongItemClick(e){
    const index = e.currentTarget.dataset.index;
    // console.log(this.data.recommendSongs);
    // console.log('in home');
    playerStore.setState("playListSongs", this.data.recommendSongs);
    playerStore.setState("playListIndex", index);
  },

  setupPlayerStoreListener(){
    // 1. 排行榜监听
    // 从 store 获取共享的数据
    rankingStore.onState("hotRanking", res => {
      // console.log(res);
      if(!res.tracks) return;
      const recommendSongs = res.tracks.slice(0,6);
      // console.log(recommendSongs);
      this.setData({recommendSongs});
      // console.log(this.data.recommendSongs);
    })
    // 共享榜单数据
    // 【飙升, 热歌，新歌，原创】
    // const rankingIds = [19723756,3778678, 3779629, 2884035];
    rankingStore.onState("newRanking", this.getRankingHandler(3779629));
    rankingStore.onState("originRanking", this.getRankingHandler(2884035));
    rankingStore.onState("upRanking", this.getRankingHandler(19723756));
    
    // 2. 播放器监听
    playerStore.onStates(["currentSong","isPlaying"], res => {
      // console.log(res, this.data.isPlaying);
      if(res.currentSong) this.setData({currentSong: res.currentSong});
      if(res.isPlaying !== undefined) {
        this.setData({isPlaying: res.isPlaying, playAnimState: res.isPlaying ? 'running' : 'paused'});
    }})
  },

  handleClickSongName(e){
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/music-player/index?id=${id}`
    })
  },
})