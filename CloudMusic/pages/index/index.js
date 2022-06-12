// index.js
// 获取应用实例
import request from '../../utils/request'
const app = getApp()

Page({
  data: {
    // motto: 'Hello World',
    // userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // canIUseGetUserProfile: false,
    // canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
    bannerList:[], //轮播图数据
    recommendList:[], //推荐歌单数据
    topList:[], //排行榜数据
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  toRecommendDaily() {
    wx.navigateTo({
      url: '../../songPackage/pages/recommendDaily/recommend'
    })
  },
  onLoad: async function() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    // 获取轮播图的接口
      let bannerListData = await request('/banner',{type:2})
        this.setData({
          bannerList:bannerListData.banners
     })
    // 获取推荐歌单的接口
      let recommendListData = await request('/personalized',{limit:10})
        this.setData({
          recommendList:recommendListData.result
         })
         console.log(this.data.recommendList)
    // 获取排行榜数据
    // 根据idx的值获取对应的排行榜数据
    // idx的取值范围为0-20，这里取0-4，发送5次请求
      let index = 0;
      let resultArr=[];
      while(index<5){
        index++;
        let topListData = await request('/top/list',{idx:index});
        let topListItem = {name:topListData.playlist.name,tracks:topListData.playlist.tracks.slice(0,3)};
        resultArr.push(topListItem);
        this.setData({
          topList:resultArr
       })
      }
  },
      
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
