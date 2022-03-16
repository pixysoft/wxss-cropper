//https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/putImageData
// https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.html
 
import WxCropper from "wxss-cropper.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasWidth: 300,
    canvasHeight: 300,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    const device = wx.getSystemInfoSync();
    this.setData({
      canvasWidth: device.windowWidth,
      canvasHeight: device.windowWidth,
    });
    var url = "cloud://wxss-brick-0f77b1.7778-wxss-brick-0f77b1-1257336119/images/image1.jpeg";

    WxCropper.init({
      canvasId: 'previewCanvas',
      aspectRatio: 1,
      path: url,
      success: function (e) {},
      error: function (e) {
        console.log(e);
      },
      log: function (e) {
        if (['touchStart', 'touchEnd', 'loadImage', 'loadCanvas'].indexOf(e[0]))
          console.log(...e);
      },
    });

  },

  touchStart: function (e) {
    WxCropper.touchStart(e);
  },

  touchMove: function (e) {
    WxCropper.touchMove(e);
  },

  touchEnd: function (e) {
    WxCropper.touchEnd(e);
    var that = this;
    WxCropper.getCropperImage(e2 => {
      if (!e2) return;
      that.setData({
        image: e2.path,
        imageWidth: e2.width,
        imageHeight: e2.height
      });
    });
  },

})