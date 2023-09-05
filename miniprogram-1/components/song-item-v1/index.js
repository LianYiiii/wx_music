// components/song-item-v1/index.js

import {playerStore} from '../../store/index'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value:{}
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
    handlePlayClick(e){
      // 也可以存入 properties 中
      const id = e.currentTarget.dataset.id;
      // console.log(id);
      wx.navigateTo({
        url: `/pages/music-player/index?id=${id}`,
      });

      console.log('in v1');
      // 对歌曲数据请求及操作
      playerStore.dispatch("playMusicWithSongIdAction", id);
    }
  }
})
