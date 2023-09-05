import {HYEventStore} from 'hy-event-store'
import {getSongsUrl, getSongLyric} from '../service/api_music';
import {parseLyric} from '../utils/parse-lyric'

// 这个是创建前台播放
// const audioContext = wx.createInnerAudioContext();
// 后台播放,获取全局唯一的背景音频管理器
const audioContext = wx.getBackgroundAudioManager();

const playerStore = new HYEventStore({
  state:{
    // 是否是第一次播放
    isFirstPlay: true,

    currentSong: {},
    durationTime: 0,
    lyricInfo: [],
    id: 0,

    currentTime: 0,
    currentLyricText: '',
    currentLyricIndex: 0,

    playModeIndex: 0,   //0 循环 1 单曲 2 随机
    isPlaying: false,

    // 歌单数据
    playListSongs: [],
    playListIndex: 0,
  },
  actions: {
    playMusicWithSongIdAction(ctx, payload){ // 相当于把payload里的id直接解构
      // console.log(ctx);
      // console.log(payload);
      const id = payload;
      // console.log(id);
      if(ctx.id === id){
        // 点击同首歌曲播放
        this.dispatch("changeMusicPlayStatusAction", true);
        return;
      }
      ctx.id = id;

      // 清空数据
      ctx.currentSong={};
      ctx.durationTime= 0;
      ctx.lyricInfo=[];
      ctx.currentTime= 0;
      ctx.currentLyricText='';
      ctx.currentLyricIndex= 0;

      // 0. 修改播放状态
      ctx.isPlaying = true;

      // 请求歌曲
      getSongsUrl(id).then(res => {
        // console.log(res.data.songs[0]);
        // console.log(id);
        ctx.currentSong = res.data.songs[0];
        ctx.durationTime = res.data.songs[0].dt;
        if(res.data.songs.length) audioContext.title = res.data.songs[0].name;
      }).catch(err => {
        console.log(err);
      });
      
      // 请求歌词
      getSongLyric(id).then(res => {
        // console.log(res);
        // console.log(res.data.lrc.lyric);
        const lyric = res.data.lrc.lyric;
        // this.setData({lyricString: lyric});
        const lyricString = lyric;
        // console.log(lyric);
        // console.log();
        const lyricInfo = parseLyric(lyricString);
        // this.setData({lyricInfo});
        ctx.lyricInfo = lyricInfo;
        // console.log(lyricInfo);
      }).catch(err => {
        console.log(err);
      })

      // 播放对应 id 的歌曲
      audioContext.stop();
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
      audioContext.title=id; 
      audioContext.autoplay = true;

      // 监听播放器的一些事件
      if(ctx.isFirstPlay){
        this.dispatch("setupAudioContextListenerAction");
        ctx.isFirstPlay = false;
      }
    },

    // 监听音乐播放的各种改变
    setupAudioContextListenerAction(ctx){
      // console.log(ctx);
      // 1. 监听是否可以播放
      audioContext.onCanplay(() => {
        audioContext.play();
      });
      
      // 2. 监听时间改变
      audioContext.onTimeUpdate(() => {   
        // 1. 获取当前时间     
        const currentTime = audioContext.currentTime * 1000;

        // 2. 修改当前时间和进度条
        ctx.currentTime = currentTime;
        
        // 3. 查找对应歌词
        if(!ctx.lyricInfo.length) return; 
        for(let i = 0; i < ctx.lyricInfo.length; i++){
          const info = ctx.lyricInfo[i];
          if(currentTime < info.time){
            const currentIndex = i - 1;
            if(ctx.currentLyricIndex !== currentIndex){
              // 修改当前歌词信息
              const currentLyricInfo = ctx.lyricInfo[currentIndex];
              const currentLyricText = currentLyricInfo.textLyric;
              ctx.currentLyricIndex = currentIndex;
              ctx.currentLyricText = currentLyricText;
              // 滚动高度放入全局
              // console.log(currentLyricText);
            }
            break;
          }
        }
      });

      // 3. 监听歌曲播放完成
      audioContext.onEnded(() => {
        this.dispatch("changeNewMusicAction");
      });

      // 4. 监听暂停与播放
      audioContext.onPlay(() =>{
        ctx.isPlaying = true;
        // if(ctx.isStoping){
        //   audioContext.seek(ctx.currentTime / 1000);
        //   ctx.isStoping = false;
        // }
      });

      audioContext.onPause(() =>{
        ctx.isPlaying = false;
      });

      audioContext.onStop(() =>{
        ctx.isPlaying = false;
      });
    },

    // 暂停与播放
    changeMusicPlayStatusAction(ctx, isPlaying = true){
      ctx.isPlaying = isPlaying;
      ctx.isPlaying ? audioContext.play() : audioContext.pause();
    },
  
    // 切下一首歌
    changeNewMusicNextAction(ctx){
      // // 1. 获取当前索引
      // let index = ctx.playListIndex;
      // // console.log(currentIndex);
      // console.log(index);

      // // 2. 根据不同播放模式，获取下一首歌索引
      // switch(ctx.playModeIndex){
      //   case 0:
      //     // 顺序
      //     index += 1;
      //     // 最后一首
      //     if(index === ctx.playListSongs.length) index = 0;
      //   case 1:
      //     // 单曲循环
      //     break;
      //   case 2:
      //     // 随机
      //     index = Math.floor(Math.random() * ctx.playListSongs.length);
      //     break;
      // }

      
      // // 3. 获取歌曲
      // let currentSong = ctx.playListSongs[index];
      // console.log(currentSong);
      // if(!currentSong) {
      //   currentSong = ctx.currentSong;
      // }else{
      //   // 记录新索引
      //   ctx.playListIndex = index;
      // }

      // // 4. 播放歌曲
      // this.dispatch("playMusicWithSongIdAction", currentSong.id)
    },

    // 切上一首歌
    changeNewMusicPrevAction(ctx){
      // 与切下一首歌曲同理，可以直接合并成 changeNewMusicAction
    },

    // 切歌
    changeNewMusicAction(ctx, isNext){
      // 通过 isNext 判断是否是下一首播放，true=下一首，false=上一首

      // 1. 获取当前索引
      let index = ctx.playListIndex;
      // console.log(currentIndex);
      // console.log(index);
    
      // 2. 根据不同播放模式，获取下一首歌索引
      switch(ctx.playModeIndex){
        case 0:
          if(isNext){
            // 顺序
            index += 1;
            // 最后一首
            if(index === ctx.playListSongs.length) index = 0;
          }else{
            // 顺序
            index -= 1;
            // 最后一首
            if(index === -1) index = ctx.playListSongs.length - 1;
          }
        case 1:
          // 单曲循环
          break;
        case 2:
          // 随机
          index = Math.floor(Math.random() * ctx.playListSongs.length);
          break;
      };
      
      console.log(ctx.playListSongs);
      // 3. 获取歌曲
      let currentSong = ctx.playListSongs[index];
      console.log(currentSong);
      if(!currentSong) {
        currentSong = ctx.currentSong;
      }else{
        // 记录新索引
        ctx.playListIndex = index;
      }
    
      // 4. 播放歌曲
      this.dispatch("playMusicWithSongIdAction", currentSong.id);
      // console.log('complete');
      
    },
  
  }
});

export {
  audioContext,
  playerStore
}