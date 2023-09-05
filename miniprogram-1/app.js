// app.js
import { getLoginCode, codeToToken, checkToken, checkSession } from './service/api_login'
App({  
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    deviceRadio: 0
  },
  onLaunch: async function(){
    // 1. 获取设备信息
    const info = wx.getSystemInfoSync();
    // console.log(info);
    this.globalData.screenWidth = info.screenWidth;
    this.globalData.screenHeight = info.screenHeight;
    this.globalData.statusBarHeight = info.statusBarHeight;

    const deviceRadio = info.screenHeight / info.screenWidth;
    this.globalData.deviceRadio = deviceRadio;

    // 2. 让用户默认登录
    const token = wx.getStorageInfo('token');
    // 判断token有没有过期
    const checkResult = await checkToken(token);
    console.log(checkResult);

    // 判断session有没有过期
    const isSessionExpire = await checkSession();

    if(token || checkResult.errorCode || !isSessionExpire) return;
    this.loginAction();
  },

  loginAction: async function(){
    // 1. 获取code
    const code = await getLoginCode();

    // 2. 将 code 发送给服务器
    // const result = codeToToken(code);
    // console.log(result);
    // cosnt token = result.token;
    // wx.setStorageSync('token', token);
  },

})
