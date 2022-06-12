// pages/recommendDaily/recommend.js
import PubSub from 'pubsub-js'
import request from '../../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
      day:'',
      month:'',
      recommendList:[],
      index:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 判断用户是否登录
    let userProfile =  wx.getStorageSync('userProfile');
    if(!userProfile){
      wx.showToast({
        title: '请先登录',
        success:()=>{
          // 跳转至登陆页面
          wx.reLaunch({
            url: '../../../pages/login/login',
          })
        }
      })
    }
    this.setData({
      day: new Date().getDate()<10?"0"+new Date().getDate():new Date().getDate(),
      month: new Date().getMonth()+1<10?"0"+(new Date().getMonth()+1):new Date().getMonth()+1
    })

    this.getRecommendList()

    // 订阅来自playSong页面发布的消息
    PubSub.subscribe("switchType",(msg,type)=>{
      let {recommendList,index} = this.data
      if(type ==="pre"){
        (index===0) && (index = recommendList.length)
        index-=1
      }else{
        (index === recommendList.length) && (index=-1)
        index+=1
      }
      this.setData({
        index
      })
      let musicId =  recommendList[index].id
      // 将muisicId回传给playSong页面
      PubSub.publish("musicId",musicId)
    })
  },
  // 获取每日推荐的数据
    async getRecommendList(){
      let  recommendListData = await request('/recommend/songs')
      this.setData({
          recommendList:recommendListData.recommend
      })
    },

    // 跳转至播放页面
    toPlayMusic(event){
      let song = event.currentTarget.dataset.song;
      let index = event.currentTarget.dataset.index;
      this.setData({
        index
      })
      // 路由跳转参数，query参数
      wx.navigateTo({
        url: '/songPackage/pages/playSong/playSong?musicId=' + song.id,
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