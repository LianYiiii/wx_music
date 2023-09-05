import hyRequest from './index';

export function getTopMV(offset, limit=10){
  return hyRequest.get('top/mv/',{
    offset,
    limit
  })
};

export function getRelatedVideo(id) {
  return hyRequest.get('related/allvideo',{
   id
  })
};

export function getMVURL(id) {
  return hyRequest.get('mv/url',{
   id
  })
};

export function getMVDetail(mvid) {
  return hyRequest.get('mv/detail',{
   mvid
  })
};