// components/song-item-v2/index.js
import {playerStore} from '../../store/index'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    rankingInfo: {
      type: Object,
      value: {}
    },
    index: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentSong: {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handlePlayClick(e){
      // 也可以存入 properties 中
      const id = e.currentTarget.dataset.id;
      // console.log(id);
      wx.navigateTo({
        url: `/pages/music-player/index?id=${id}`
      });
      
      // 对歌曲数据请求及操作
      playerStore.dispatch("playMusicWithSongIdAction", id);
    }
  }
})
