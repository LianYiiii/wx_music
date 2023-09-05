// import { reject } from 'lodash';
import hyRequest from './index';
import { hyLoginRequest } from './index'

export function getLoginCode(){
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 1000,
      success: res => {
        console.log(res);
        const code = res.code;
        resolve(code);
      },
      fail: err => {
        console.log(err);
        reject(err);
      }
    });

  })
};

export function codeToToken(code){
  return hyLoginRequest.post('login', {code}, {
    token
  })
};

export function checkToken(token){
  return hyLoginRequest.post('auth', {}, {});
};  

export function checkSession(){
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success: () => {
        resolve(true);
      },
      fail: () => {
        reject(false);
      }
    })
  });
};