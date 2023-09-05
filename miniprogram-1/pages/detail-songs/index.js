import { playerStore, rankingStore } from "../../store/index";
import {getRankingList} from '../../service/api_music'

// pages/detail-songs/index.js
Page({
  data: {
    // 歌单名称
    ranking: '',
    // 歌单信息
    songsInfo: {},
    type: '',
    songsList: [],
  },

  onLoad(options) {
    // console.log(options);
    const type = options.type;
    this.setData({type})

    if(type === 'menu'){
      const id = options.id;
      // console.log(id);
      getRankingList(id).then(res => {
        // console.log(res);
        this.setData({songsInfo: res.data.playlist});
        // console.log(res.data.playlist);
        this.setData({songsList: res.data.playlist.tracks})
      }).catch(err => {
        console.log(err);
      });
    }else if(type === 'rank'){
      const ranking  = options.rankingName;
      
      // 获取数据
      rankingStore.onState(ranking, this.getRankingHandler)
    }
  },

  handleSongItemClick(e){
    const index = e.currentTarget.dataset.index;
    console.log('in detail songs');
    if(this.data.songsList.length) playerStore.setState("playListSongs", this.data.songsList);
    if(this.data.songsIndex) playerStore.setState("playListIndex", index);
  },

  onUnload() {
    if(this.data.ranking){
      rankingStore.offState(this.data.ranking, this.getRankingHandler);
    }
  },

  getRankingHandler(res){
    console.log(res);
    this.setData({songsInfo: res })
  },
})