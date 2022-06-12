

//封装ajax请求
import config from './config'
export default (url,data={},method='GET')=>{
  return new Promise((resolve,reject)=>{
    wx.request({
      url:config.baseUrl+url,
      data,
      method,
      header:{
        cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item=>item.indexOf('MUSIC_U')!==-1):''
      },
      success:(res)=>{
        if(data.isLogin){
          wx.setStorage({
            key:"cookies",
            data:res.cookies
          })
        }
        console.log('success',res)
        resolve(res.data)
      },
      fail:(err)=>{
        console.log('error',err)
        reject(err)
      }
    })
  })
  

}