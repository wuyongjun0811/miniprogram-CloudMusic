// pages/playSong/playSong.js
import PubSub from 'pubsub-js'
import request from '../../../utils/request'
import moment from '../../../utils/moment'
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      isPlay:false,
      song:{}, //歌曲详情对象
      musicId:'',
      musicLink:'',
      currentTime:'00:00',
      totalTime:'00:00',
      barWidth:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
// options 用于接受路由跳转的参数
  let musicId = options.musicId;
  this.setData({
    musicId
  })
  this.getMusicInfo(musicId);
  // 判断当前页面是否在播放
  if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId ){
    this.setData({
      isPlay:true
    })
  }
  this.playControl(true,musicId)
// 监视音乐播放和暂停/停止
  this.backgroundAudioManager = wx.getBackgroundAudioManager();
  this.backgroundAudioManager.onPlay(()=>{
    this.changePlayState(true);
    appInstance.globalData.musicId = musicId;
  })
  this.backgroundAudioManager.onPause(()=>{
    this.changePlayState(false)
  })
  this.backgroundAudioManager.onStop(()=>{
      this.changePlayState(false)
  })
  // 监听音乐播放自然结束
  this.backgroundAudioManager.onEnded(()=>{
    PubSub.publish("switchType","next");
    this.setData({
      barWidth:0,
      currentTime:"00:00"
    })
})
//  监听音乐播放的进度
  this.backgroundAudioManager.onTimeUpdate(()=>{
    let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format("mm:ss");
    let barWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450
    this.setData({
      currentTime,
      barWidth
    })
  })
  
  },
  changePlayState(isPlay){
    this.setData({
      isPlay
    })
    appInstance.globalData.isMusicPlay = isPlay;
  },
  // 获取歌曲详情
  async getMusicInfo(musicId){
    let songData =  await request('/song/detail',{ids:musicId});
    // songData.songs[0].dt 单位是ms
    let totalTime = moment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song:songData.songs[0],
      totalTime
    })
  },
  // 点击播放/暂停
  musicPlay(){
    let isPlay = !this.data.isPlay;
    // this.setData({
    //   isPlay
    // })
    let {musicId,musicLink} = this.data
    this.playControl(isPlay,musicId,musicLink)
  },
  
  async playControl(isPlay,musicId,musicLink){
    if(isPlay){
      // 播放
      // 获取音乐播放链接
      if(!musicLink){
        let  getMucicLink =  await request('/song/url',{id:musicId});
        musicLink = getMucicLink.data[0].url;
        this.setData({
          musicLink
        })
      }
      this.backgroundAudioManager.src= musicLink;
      this.backgroundAudioManager.title= this.data.song.name;
    }else{
      this.backgroundAudioManager.pause();
    }
  },
  // 点击切歌的回调
  switchMusic(event){
    // 获取切歌的类型
    let type = event.currentTarget.id
    // 关闭当前正在播放的音乐
    this.backgroundAudioManager.stop();
    // 订阅来自recommend页面发布的musicId消息
    PubSub.subscribe("musicId",(msg,musicId)=>{
      // 获取音乐信息
      this.getMusicInfo(musicId);
      // 自动播放音乐
      this.playControl(true,musicId)
      PubSub.unsubscribe("musicId")
    })
    
    // 发布消息给recommend页面
    PubSub.publish("switchType",type)
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