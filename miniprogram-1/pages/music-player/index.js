// pages/music-player/index.js

import {navBarHeight} from '../../constants/index';
import {audioContext, playerStore} from '../../store/player-store';

const playModeNames = ['loop', 'loopOnlyOne','suiji'];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    musicId: 0,
    currentSong: {},
    currentPage: 0,
    contentHeight: 0,
    isMusicShow: true,
    songDuration: 0,
    currentTime: 0,
    sliderValue: 0,
    isSliderChanging: false,
    lyricString: '',
    lyricInfo: {},
    currentLyricText: '',
    currentLyricIndex: 0,

    lyricScrollTop: 0,

    playModeIndex: 0,    // 0 循环 1单曲 2 随机
    playModeName: '',    // 暂停、播放图标 
    isPlaying: false,
    playModeModel: 'loop'  // 播放模式 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 1. 获取传入id
    const id = options.id;
    this.setData({musicId: id});

    // playerStore.dispatch("playMusicWithSongIdAction", id);

    // 2. 根据id获取歌曲信息
    this.setupPlayerStoreListener();

    // 3. 动态计算content高度
    const globalData = getApp().globalData;
    const screenHeight = globalData.screenHeight;
    const statusHeight = globalData.statusBarHeight;
    // navBarHeight 也可以写入 app.js 的 globalData 中
    const contentHeight = screenHeight - statusHeight - navBarHeight;
    const deviceRadio = globalData.deviceRadio;
    this.setData({contentHeight, isMusicShow : deviceRadio >= 2 });

    // ·····················音乐监听·······················
    // 播放音乐
    // const audioContext = wx.createInnerAudioContext();
    // audioContext.stop();
    // audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
    // audioContext.autoplay = true;

    // 监视音乐是否可以播放
    // audioContext.onCanplay(() => {
    //   audioContext.play();
    //   this.setupPlayerStoreListener();
    // });

    // 监听音乐时间变化
  //   audioContext.onTimeUpdate(() => {
  //     // console.log(audioContext);
  //     // console.log(currentTime);
      
  //     const currentTime = audioContext.currentTime * 1000;
  //     if(!this.data.isSliderChanging){
  //       const sliderValue = currentTime / this.data.songDuration *100;
  //       this.setData({sliderValue, currentTime});
  //     };

  //     // 查找对应歌词
  //     for(let i = 0; i < this.data.lyricInfo.length; i++){
  //       // console.log(this.data.lyricInfo);
  //       // console.log(i);
  //       const info = this.data.lyricInfo[i];
  //       if(currentTime < info.time){
  //         // console.log(i);
  //         // console.log(info.textLyric);
  //         const currentIndex = i - 1;
  //         if(!this.data.lyricInfo.length) return;
  //         if(this.data.currentLyricIndex !== currentIndex){
  //           const currentLyricInfo = this.data.lyricInfo[currentIndex];
  //           this.setData({currentLyricText: currentLyricInfo.textLyric, currentLyricIndex: currentIndex,
  //           lyricScrollTop: currentIndex * 35})
  //           console.log(currentLyricInfo.textLyric);
  //         }
  //         break;
  //       }
  //     }
  //   })
  },

  // ·····························网络请求·····························
  // getPagesData(id){
    // getSongsUrl(id).then(res => {
    //   // console.log(res.data.songs[0]);
    //   this.setData({currentSong: res.data.songs[0], songDuration: res.data.songs[0].dt});
    // }).catch(err => {
    //   console.log(err);
    // });

    // // 请求歌词
    // getSongLyric(id).then(res => {
    //   // console.log(res.data.lrc.lyric);
    //   const lyric = res.data.lrc.lyric;
    //   this.setData({lyricString: lyric});
    //   // console.log(lyric);
    //   // console.log();
    //   const lyricInfo = parseLyric(lyric);
    //   this.setData({lyricInfo});
    //   console.log(lyricInfo);
    // }).catch(err => {
    //   console.log(err);
    // })
  // },

  // ····························事件处理···································
  
  // 歌曲 / 歌词
  handleSwiperChange(e){
    // console.log(e);
    const current = e.detail.current;
    // console.log(current);
    this.setData({currentPage: current});
  },

  // 点击改变进度条
  handleSliderChange: function(e){
    // console.log(e);
    const value = e.detail.value;

    const currentTime = this.data.songDuration * value / 100;
    // 调整位置
    // audioContext.pause();
    audioContext.seek(currentTime / 1000);

    this.setData({sliderValue: value, isSliderChanging: false});
  },

  // 正在拖动进度条
  handleSliderChanging(e){
    const value = e.detail.value;

    const currentTime = this.data.songDuration * value / 100;
    this.setData({isSliderChanging: true, currentTime: currentTime});
  },

  // 切换播放模式
  handleModeBtnClick(){
     // 0 循环 1单曲 2 随机
    let playModeIndex = this.data.playModeIndex + 1;
    if(playModeIndex === 3) {
      playModeIndex = 0;
    }

    this.setData({playModeModel: playModeNames[playModeIndex], playModeIndex});
    // console.log(this.data.playModeModel, playModeIndex);

    // 按照不同模式进行播放
    playerStore.setState("playModeIndex", playModeIndex);
  },

  // 暂停、播放
  handlePlayBtnClick(){
    // console.log(this.data.isPlaying);
    // console.log(this.data.playModeName);
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
  },

  // 监听数据
  setupPlayerStoreListener(){
    // 1. 监听"currentSong", "durationTime","lyricInfo"
    playerStore.onStates(["currentSong", "durationTime","lyricInfo"], res =>{
      // console.log(res.currentSong, res.durationTime, res.lyricInfo);

      // 改变 当前时间、歌曲总长、歌词信息
      if(res.currentSong) this.setData({currentSong: res.currentSong});
      if(res.durationTime) this.setData({songDuration: res.durationTime});
      if(res.lyricInfo) this.setData({lyricInfo:res.lyricInfo});
    });

    // 2. 监听"currentTime", "currentLyricIndex","currentLyricText"
    playerStore.onStates(["currentTime", "currentLyricIndex","currentLyricText"], res =>{
      // console.log(res.currentTime, res.currentLyricIndex, res.currentLyricText);
      // 时间变化
      if(res.currentTime && !this.data.isSliderChanging){
        const sliderValue = res.currentTime / this.data.songDuration * 100;
        // console.log(res.currentTime, this.data.songDuration);
        this.setData({currentTime: res.currentTime, sliderValue});
      };

      // 歌词变化
      if(res.currentLyricText) this.setData({currentLyricText: res.currentLyricText});
      if(res.currentLyricIndex) this.setData({currentLyricIndex:res.currentLyricIndex, lyricScrollTop: res.currentLyricIndex * 35});
    });

    // 3. 监听播放模式
    playerStore.onStates(["playModeIndex", "isPlaying"], res => {
      // console.log(res.playModeIndex, res.isPlaying);
      const isPlaying = res.isPlaying;
      const playModeIndex = res.playModeIndex;
      if(playModeIndex){
        this.setData({playModeIndex, playModeModel: playModeNames[playModeIndex]});
      }

      if(isPlaying !== undefined){
        this.setData({isPlaying, playModeName: isPlaying ? "pause" : "play"});
      }
    })
  },
  
  // 上一首
  handlePrevBtnClick(){
    playerStore.dispatch("changeNewMusicAction",false);
  },
  
  // 下一首
  handleNextBtnClick(){
    playerStore.dispatch("changeNewMusicAction", true);
  },

  // 点击回退图标
  handleBackClick(){
    // console.log('back');
    wx.navigateBack();
  },

})