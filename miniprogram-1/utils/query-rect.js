export default function (selector){
  return new Promise(resolve => {
    const query = wx.createSelectorQuery();
    query.select(selector).boundingClientRect();
    query.exec(res => {
      // 把结果回调出去
      resolve(res);
    });
    // 相当于 query.exec(resolve)
  },reject => {
    reject();
  })
}