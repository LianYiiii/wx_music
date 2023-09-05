import hyRequest from "./index";

// 轮播图
export function getBanner(){
  return hyRequest.get('banner',{
    type: 2
  });
};

// 推荐歌曲
export function getRanking(id){
  return hyRequest.get('playlist/detail',{
    id
  });
};

// 热门歌单
export function getHotSongMenu(cat="流行", limit = 6, offset = 0){
  return hyRequest.get('top/playlist',{
    cat, 
    limit,
    offset
  });
};

// 推荐歌单
export function getRecommendSongMenu(cat="全部", limit = 6, offset = 0){
  return hyRequest.get('top/playlist',{
    cat, 
    limit,
    offset
  });
};

// 巅峰榜
// 【飙升，新歌，原创】
// const rankingIds = [19723756, 3779629, 2884035];

export function getRankingList(id){
  return hyRequest.get('playlist/detail',{
    id
  });
};

// 搜索热词
export function getSearchHot(){
  return hyRequest.get('search/hot');
}

// 搜索建议
export function getSearchSuggest(keywords, type='mobile'){
  return hyRequest.get('search/suggest',{
    keywords,
    type
  })
};

// 搜索的具体结果
export function getSearchResult(keywords){
  return hyRequest.get('search',{
    keywords
  })
};

// 获取歌曲url
export function getSongsUrl(ids){
  return hyRequest.get('song/detail',{
    ids
  })
};

// 歌词获取
export function getSongLyric(id){
  return hyRequest.get('lyric',{
    id
  })
};