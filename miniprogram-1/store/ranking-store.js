import {HYEventStore} from 'hy-event-store';
import {getRanking} from '../service/api_music'

const rankingMap = {
  // id: rankingName
  19723756: "upRanking",
  3778678: "hotRanking",
  3779629: "newRanking",
  2884035: "originRanking"
}
const rankingStore = new HYEventStore({
  state: {
    upRanking:{},  //飙升榜单
    hotRanking:{},  //热门榜单
    newRanking:{},  //新歌榜单
    originRanking:{},  //原创榜单
  },
  actions: {
    getRankingDataAction(ctx){
      // 0 飙升榜  1 热门榜  2 新歌榜  3 原创榜
      // 【飙升, 热歌，新歌，原创】
      const rankingIds = [19723756,3778678, 3779629, 2884035];
      
      for(let i = 0;i < 4;i ++){
        getRanking(rankingIds[i]).then(res => {
          const rankingName = rankingMap[rankingIds[i]];
          ctx[rankingName] = res.data.playlist;
          // console.log(res.data.playlist);
          // console.log(ctx);  
          // ctx.hotRanking = res.data.playlist;
          // console.log(ctx.hotRanking);
        }).catch(err => {
          console.log(err);
        });
      }

      // 发送推荐歌曲
      // getRanking(5001).then(res => {
      //   // console.log(res.data.playlist);
      //   // console.log(ctx);
      //   ctx.hotRanking = res.data.playlist;
      //   // console.log(ctx.hotRanking);
      // }).catch(err => {
      //   console.log(err);
      // })
    }
  }
});

export {
  rankingStore,
  rankingMap,
};