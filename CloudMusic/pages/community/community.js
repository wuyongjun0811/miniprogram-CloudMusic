// pages/community/community.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
      videoGroup:[],
      navId:'',
      videoList:[],
      videoId:'',
      isTrigger:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getVideoGroup()
  },
  // 获取导航数据的函数
    async getVideoGroup(){
      let videoGroupData =  await request('/video/group/list');
      let videoGroup = [videoGroupData.data[3],videoGroupData.data[13]]
      this.setData({
        videoGroup,
        navId:videoGroup[0].id+videoGroup[1].id
      })
      this.getVideoList(this.data.navId);

   },
   changeNav(event){
     let navId = event.currentTarget.id;
     this.setData({
       navId
     })
     wx.showLoading({
       title:'正在加载'
     })
     this.getVideoList(this.data.navId)
   },
// 获取视频列表数据函数
    async getVideoList(navId){
      let videoListData = await request('/video/group',{id:navId})
      // 关闭消息提示框
      wx.hideLoading()
      console.log(videoListData);
      let index = 0;
      let videoList= videoListData.datas.map(item=>{
        item.id=index++;
        return item; 
      })
      this.setData({
        videoList,
        isTrigger:false //关闭下拉刷新
      })
 },
//  需求：1.点击播放的事件中，需要找到上一个播放的视频
//       2. 再播放新的视频前关闭上一个正在播放的视频
//  关键：找到上一个视频的实例对象
//        如何保证点击的播放的视频和正在播放的视频不是同一个视频
    handlePlay(event){
      let vid = event.currentTarget.id
      // 关闭上一个播放的视频
      this.vid !== vid && this.videoContext && this.videoContext.stop();
      this.vid = vid;
      this.setData({
        videoId:vid,
      })
      // 创建控制video标签的实例对象
      this.videoContext = wx.createVideoContext(vid)
    },
    // 自定义下拉刷新的回调 scrollView
    handleRefresh(){
  // 再次发请求 当前的导航ID
    this.getVideoList(this.data.navId)
    },
    handleToLower(){

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