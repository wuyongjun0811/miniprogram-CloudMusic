// pages/login/login.js
// 登录流程
// 1.收集表单项数据
// 2.前端验证  用户信息是否合法
// 3.后端验证  验证用户是否存在 验证密码

import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  handleInput(event){
    let type = event.currentTarget.id;
    this.setData({
      [type]:event.detail.value
    })
  },

   async login(){
    let {phone,password} = this.data;
    // 前端验证
    if(!phone){
      wx.showToast({
        title: '手机号不能为空',
        icon:'error'
      })
      return
    }
    // 正则表达式判断
    let phoneReg = /^1[3-9]\d{9}$/
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: '手机号不正确',
        icon:'error'
      })
      return
    }
    if(!password){
      wx.showToast({
        title: '密码不能为空',
        icon:'error'
      })
      return
    }
    wx.showToast({
      title: '成功',
    })
// 后端验证
   let result = await request('/login/cellphone',{phone,password,isLogin:true})
   if(result.code==200){
      wx.showToast({
        title: '登录成功',
        icon:'success'
      })
      // 将用户的信息存储在本地
      wx.setStorageSync("userProfile",JSON.stringify(result.profile))
      wx.reLaunch({
        url: '/pages/personal/personal',
      })
  }else if(result==400){
    wx.showToast({
      title: '手机号不正确',
      icon:'error'
    })
  }else if(result == 502){
    wx.showToast({
      title: '密码错误',
      icon:'error'
    })
  }else{
    wx.showToast({
      title: '登录失败',
      icon:'error'
    })
  } 

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