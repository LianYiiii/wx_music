const BASE_URL = 'http://192.168.3.8:3000/';

class HYRequset{
  request(url,method,param,header={}){
    return new Promise((resolve, reject) => {
      wx.request({
        url: BASE_URL+url,
        method: method,
        header: header,
        data: param,
        success:function(res){
          // console.log('hyrequest里的');
          resolve(res);
          // console.log(res);
        },
        fail: function(err){
          reject(err);
          // console.log(err);
        }
      
      })
    })
  }

  // 封装 get 方法
  get(url, params, header){
    return this.request(url, 'get', params, header)
  }

  // 封装post方法
  post(url, params, header){
    return this.request(url, 'post', params, header)
  }
};

const hyRequest = new HYRequset();

export const hyLoginRequest = new HYRequset();

export default hyRequest;