// pages/personal.js
import request from '../../utils/request'
let startY = 0;
let moveY = 0;
let moveDistance = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:'translateY(0)',
    userProfile:{},
    recentPlayList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 读取用户的信息
    let userProfile = wx.getStorageSync('userProfile')
    console.log(userProfile);
    if(userProfile){
      this.setData({
        userProfile:JSON.parse(userProfile)
      })
      // 获取用户播放记录
      this.getUserRecentPlay(this.data.userProfile.userId);
    }
  },
  async getUserRecentPlay(userId){
    let recentPlayListData = await request('/user/record',{uid:userId,type:1});
    // 给数字添加标识
    let index = 0;
    let recentPlayList = recentPlayListData.weekData.map(item =>{
      item.id=index++;
      return item
    })
    this.setData({
      recentPlayList
    })
  },

  handleTouchStart(event){
   startY = event.touches[0].clientY;
  },
  handleTouchMove(event){
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY;
    if(moveDistance<=0){
      return
    }else if(moveDistance>80){
      moveDistance = 80; 
    }
    this.setData({
      coverTransform:`translateY(${moveDistance})rpx`
    })
  },
  handleTouchEnd(){
    
  },
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
 },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})