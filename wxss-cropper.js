/**
 * wxss-cropper v1.0.0
 * (c) 2022 pixysoft
 * Email: 66767426@qq.com
 * Github: https://github.com/pixysoft/wxss-cropper
 * 
 * 有项目开发、外包需求的可以联系我们，专业政府外包团队。唯品会、阿里巴巴10年核心高并发高可用微服务研发经验。
 * 
 * @license MIT
 */

 const WxCanvas = {
  
  // 将 url 图片画到 canvas 上
  // 快速配置 {canvasId, path}
  // 高性能配置 {canvas, image, width, height}
  // 完全配置 {canvasId, canvas, path?, image?, mode?, width?, height? nodeWidth?, nodeHeight?, source?,  destination?, cropper?, background?, success?}
  // cropper 高光 对于图片的像素坐标尺寸
  // source 对于图片的像素坐标尺寸
  // destination 对于 canvas 整体的像素坐标尺寸
  drawImageToCanvas: function (config) {
    if (!(config.canvasId || config.canvas) || !(config.path || config.image)) {
      throw new Error('unknown canvasId / path');
    }
    if (config.image && !(config.width || config.width)) {
      throw new Error('unknown nodeWidth / nodeHeight');
    }

    if (!config.mode)
      config.mode = 'none';
    if (!config.margin)
      config.margin = 0;

    const createSelectorQueryCallback = function () {
      var getImageInfoCallback = function () {
        const canvas = config.canvas;

        if (!config.source) {
          config.source = {
            x: 0,
            y: 0,
            width: config.width,
            height: config.height
          };
        }

        if (!config.cropper) {
          config.cropper = {
            ...config.source
          };
        }

        if (!config.destination) {
          switch (config.mode) {
            case 'aspectFit': {
              // 缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。 
              let canvasWidth, canvasHeight = 0;
              if (config.cropper.width > config.cropper.height) {
                canvasWidth = config.cropper.width + config.margin * 2;
                canvasHeight = Math.trunc(config.cropper.width / (config.nodeWidth / config.nodeHeight)) + config.margin * 2;
              } else {
                canvasWidth = Math.trunc(config.cropper.height / (config.nodeHeight / config.nodeWidth)) + config.margin * 2;
                canvasHeight = config.cropper.height + config.margin * 2;
              }
              let scalex = 1;
              let scaley = 1;
              if (config.canvasWidth && config.canvasHeight) {
                scalex = config.canvasWidth / canvasWidth;
                scaley = config.canvasHeight / canvasHeight;
              }
              canvas.width = canvasWidth * scalex;
              canvas.height = canvasHeight * scaley;
              config.destination = {
                x: Math.trunc(((canvasWidth - config.cropper.width) / 2 - (config.cropper.x - config.source.x)) * scalex),
                y: Math.trunc(((canvasHeight - config.cropper.height) / 2 - (config.cropper.y - config.source.y)) * scaley),
                width: config.source.width * scalex,
                height: config.source.height * scaley
              };
              break;
            }
            case 'scaleToFill': {
              // 缩放模式，不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素  
              let canvasWidth, canvasHeight = 0;
              canvasWidth = config.cropper.width + config.margin * 2;
              canvasHeight = config.cropper.height + config.margin * 2;
              let scalex = 1;
              let scaley = 1;
              if (config.canvasWidth && config.canvasHeight) {
                scalex = config.canvasWidth / canvasWidth;
                scaley = config.canvasHeight / canvasHeight;
              }
              canvas.width = canvasWidth * scalex;
              canvas.height = canvasHeight * scaley;
              config.destination = {
                x: Math.trunc((0 + config.margin - (config.cropper.x - config.source.x)) * scalex),
                y: Math.trunc((0 + config.margin - (config.cropper.y - config.source.y)) * scaley),
                width: Math.trunc(config.source.width * scalex),
                height: Math.trunc(config.source.height * scaley)
              };
              break;
            }
            default: {
              // 默认模式 不拉伸 左上角对齐
              let canvasWidth, canvasHeight = 0;
              canvasWidth = config.nodeWidth;
              canvasHeight = config.nodeHeight;
              let scalex = 1;
              let scaley = 1;
              if (config.canvasWidth && config.canvasHeight) {
                scalex = config.canvasWidth / canvasWidth;
                scaley = config.canvasHeight / canvasHeight;
              }
              canvas.width = canvasWidth * scalex;
              canvas.height = canvasHeight * scaley;
              config.destination = {
                x: Math.trunc((0 + config.margin) * scalex),
                y: Math.trunc((0 + config.margin) * scaley),
                width: Math.trunc(config.source.width * scalex),
                height: Math.trunc(config.source.height * scaley)
              };
              break;
            }
          }
        } else {
          let canvasWidth, canvasHeight = 0;
          canvasWidth = config.destination.x + config.destination.width;
          canvasHeight = config.destination.y + config.destination.height;
          let scalex = 1,
            scaley = 1;
          if (config.canvasWidth && config.canvasHeight) {
            scalex = config.canvasWidth / canvasWidth;
            scaley = config.canvasHeight / canvasHeight;
          }
          canvas.width = canvasWidth * scalex;
          canvas.height = canvasHeight * scaley;
        }

        config.canvasWidth = canvas.width;
        config.canvasHeight = canvas.height;

        if (!config.context)
          config.context = canvas.getContext('2d');

        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (config.background) {
          config.context.fillStyle = config.background;
          config.context.fillRect(0, 0, canvas.width, canvas.height);
        }

        const imageOnload = () => {
          // console.log("Func_drawImageToCanvas::", config.canvasId, 'img.onload', e2);
          // 默认把图片全部像素画在目标尺寸上
          config.context.drawImage(config.image,
            config.source.x, config.source.y, config.source.width, config.source.height,
            config.destination.x, config.destination.y, config.destination.width, config.destination.height);
          var args = {
            ...config,
          };
          delete args.success;
          if (config.success) config.success(args);
        };
        if (config.image) {
          imageOnload();
        } else {
          config.image = canvas.createImage();
          config.image.onload = imageOnload;
          config.image.src = config.imageUrl;
        }
      };

      if (!config.image) {
        wx.getImageInfo({
          src: config.path,
          success: function (e3) {
            config.imageUrl = e3.path;
            config.width = e3.width;
            config.height = e3.height;
            // console.log('Func_drawImageToCanvas', config.canvasId, 'unknown config/width/height/path, wx.getImageInfo', e3, config);
            getImageInfoCallback();
          },
        })
      } else {
        getImageInfoCallback();
      }
    };

    if (!config.canvas) {
      const query = wx.createSelectorQuery();
      query.select('#' + config.canvasId).fields({
        node: true,
        size: true,
      }).exec(e1 => {
        // console.log('Func_drawImageToCanvas::', config.canvasId, 'unknown canvas/canvaswidth/canvasheight, wx.createSelectorQuery', e1);
        config.canvas = e1[0].node;
        config.nodeWidth = e1[0].width;
        config.nodeHeight = e1[0].height;
        createSelectorQueryCallback();
      });
    } else {
      if (!config.nodeWidth || !config.nodeHeight) {
        if (config.canvas._canvasRef) {
          config.nodeWidth = config.canvas._canvasRef.clientWidth;
          config.nodeHeight = config.canvas._canvasRef.clientHeight;
        } else {
          config.nodeWidth = config.canvas._width;
          config.nodeHeight = config.canvas._height;
        }
      }
      createSelectorQueryCallback();
    }
  },

  // { context, cropper, cropperAspectRatio, canvasHeight, canvasWidth }
  drawCropperToCanvas: function (config) {
    try {
      const cropper = config.cropper;
      const x = cropper.x;
      const y = cropper.y;
      let width = cropper.width;
      let height = cropper.height;

      const context = config.context;
      const color = '#04b00f';
      const lineWidth = 4;
      const half = lineWidth / 2;
      const mask = 'rgba(0, 0, 0, 0.3)';
      const cornerWidth = 10;

      var boundOption = [{
          start: {
            x: x - half,
            y: y + cornerWidth - half
          },
          step1: {
            x: x - half,
            y: y - half
          },
          step2: {
            x: x + cornerWidth - half,
            y: y - half
          }
        },
        {
          start: {
            x: x - half,
            y: y + height - cornerWidth + half
          },
          step1: {
            x: x - half,
            y: y + height + half
          },
          step2: {
            x: x + cornerWidth - half,
            y: y + height + half
          }
        },
        {
          start: {
            x: x + width - cornerWidth + half,
            y: y - half
          },
          step1: {
            x: x + width + half,
            y: y - half
          },
          step2: {
            x: x + width + half,
            y: y + cornerWidth - half
          }
        },
        {
          start: {
            x: x + width + half,
            y: y + height - cornerWidth + half
          },
          step1: {
            x: x + width + half,
            y: y + height + half
          },
          step2: {
            x: x + width - cornerWidth + half,
            y: y + height + half
          }
        }
      ];

      context.beginPath();
      context.fillStyle = mask;
      context.fillRect(0, 0, x, config.canvasHeight);
      context.fillRect(x, 0, width, y);
      context.fillRect(x, y + height, width, config.canvasHeight - y - height);
      context.fillRect(x + width, 0, config.canvasWidth - x - width, config.canvasHeight);
      context.fill();


      boundOption.forEach(function (op) {
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.moveTo(op.start.x, op.start.y);
        context.lineTo(op.step1.x, op.step1.y);
        context.lineTo(op.step2.x, op.step2.y);
        context.stroke();
      });

    } catch (e) {
      console.error('drawCropperToCanvas', e);
    }
  },

};

module.exports = {

  data: {
    touches0: {
      x0: 0,
      y0: 0,
      x1: 0,
      y1: 0
    }, // 对于 canvas 的界面尺寸
    touches1: {
      x0: 0,
      y0: 0,
      x1: 0,
      y1: 0
    }, // 对于 canvas 可见部分的界面尺寸
    cropper: null, // 对于 canvas 可见部分的像素尺寸
    cropperMode: 'none', // 运行时模式

    cropperAspectRatio: -1, // 宽比长
    zoom: 10, // 放大倍数

    pixelRatio: 1, // 分辨率

    lastCropper: null, // 裁剪窗口 缓存 cropper，用于判断单击的时候，是否存在裁剪框
    lastImageCropper: null, //缩放尺寸 缓存 config.cropper 窗口，用于计算双指缩放图片的起始状态
    config: null, // canvas 控制配置类

    onError: null,
    onLog: null,
  },

  init: function (e) {
    if (!e.canvasId)
      throw new Error('unknown');

    this.data.canvasId = e.canvasId;
    this.data.cropperAspectRatio = e.aspectRatio || -1;
    this.data.zoom = e.zoom || 10;
    this.data.onError = e.error;
    this.data.onLog = e.log;

    const device = wx.getSystemInfoSync();
    this.data.pixelRatio = device.pixelRatio;

    this.data.config = null;
    if (e.path) {
      this.loadImage(e);
    } else {
      if (e.success) e.success();
    }
  },

  updateCanvas: function (cropper) {
    var that = this;
    WxCanvas.drawImageToCanvas({
      ...this.data.config,
      success: function (e1) {
        that.data.config = e1;
        cropper = cropper || that.data.cropper;
        if (cropper) {
          WxCanvas.drawCropperToCanvas({
            ...that.data.config,
            cropper: cropper,
          });
        }
      },
    });
  },

  loadImage: function (e) {
    var that = this;
    WxCanvas.drawImageToCanvas({
      canvasId: this.data.canvasId,
      path: e.path,
      mode: 'aspectFit',
      background: 'black',
      success: function (e1) {
        that.onLog('loadImage', 'drawImageToCanvas', e1);
        that.data.config = e1;
        if (e.success) e.success(e1);
      },
    });
  },

  getCropperImage: function (callback) {
    if (!this.data.cropper) {
      return callback(null);
    }
    var that = this;
    var scalex = this.data.config.canvas._width / this.data.config.canvasWidth;
    var scaley = this.data.config.canvas._height / this.data.config.canvasHeight;
    wx.canvasToTempFilePath({
      fileType: "png",
      x: this.data.cropper.x * scalex,
      y: this.data.cropper.y * scaley,
      width: this.data.cropper.width * scalex,
      height: this.data.cropper.height * scaley,
      canvas: this.data.config.canvas,
      success: function (e) {
        callback({
          path: e.tempFilePath,
          width: that.data.cropper.width,
          height: that.data.cropper.height,
        });
      }
    })
  },

  // -----

  touchStart: function (e) {
    if (!this.data.config) {
      return;
    }
    try {
      if (e.touches.length <= 0)
        return;

      var that = this;
      const scale = this.data.config.canvasWidth / this.data.config.nodeWidth;
      const touches0 = {
        x0: e.touches[0].x,
        y0: e.touches[0].y,
      };
      const updateTouches = function (touches) {
        for (var i = 0; i < touches.length; i++) {
          that.data['touches' + i] = {
            x0: touches[i].x,
            y0: touches[i].y
          };
        }
      }

      if (e.touches.length > 2) {
        // do nothing
        this.data.cropperMode = 'none';

      } else if (e.touches.length == 2) {
        // 图片拖动放大
        updateTouches(e.touches);
        // 缓存缩放前状态
        this.data.lastImageCropper = {
          ...this.data.config.cropper
        };
        // 删除裁剪框
        this.data.lastCropper = {
          ...this.data.cropper
        };
        this.data.cropper = null;
        this.updateCanvas();
        this.data.cropperMode = 'scales';

      } else if (this.isCropperEmpty(this.data.cropper)) {
        // 没有 cropper，重新画图
        updateTouches(e.touches);
        this.data.lastCropper = this.data.cropper;
        this.data.cropper = null;
        this.data.cropperMode = 'draw';

      } else if (this.isInCropperCorner({
          cropper: this.data.cropper,
          touches: touches0,
          scale: scale,
        })) {
        // 点击边角，继续画图
        var touches = this.getCropperOppositeTouches({
          cropper: this.data.cropper,
          touches: touches0,
          scale: scale,
        });
        updateTouches([touches]);
        this.data.cropperMode = 'draw';

      } else if (this.isInCropper({
          cropper: this.data.cropper,
          touches: touches0,
          scale: scale,
        })) {
        // 点击内部，整体拖动
        updateTouches(e.touches);
        this.data.cropperMode = 'move';

      } else {
        // 点击外部，重新画图
        updateTouches(e.touches);
        this.data.lastCropper = this.data.cropper;
        this.data.cropper = null;
        this.data.cropperMode = 'draw';

      }

    } catch (e) {
      this.onError('touchStart', e);
    }

    this.onLog('touchStart', this.data.cropperMode, this.data.cropper, this.data.lastCropper);
  },

  touchMove: function (e) {
    if (!this.data.config) {
      return;
    }
    try {
      if (e.touches.length <= 0)
        return;
      for (var i = 0; i < e.touches.length; i++) {
        if (!this.data['touches' + i])
          continue;
        this.data['touches' + i].x1 = e.touches[i].x;
        this.data['touches' + i].y1 = e.touches[i].y;
      }

      const scale = this.data.config.canvasWidth / this.data.config.nodeWidth;
      switch (this.data.cropperMode) {
        case 'scales':
        case 'scalings': {
          this.scalingCanvas();
          this.data.cropperMode = 'scalings';
          break;
        }
        case 'draw':
        case 'drawing': {
          this.data.cropper = this.getCropper({
            canvasWidth: this.data.config.canvasWidth,
            canvasHeight: this.data.config.canvasHeight,
            scale: scale,
            cropperAspectRatio: this.data.cropperAspectRatio,
            touches: this.data.touches0,
          });
          this.updateCanvas(this.data.cropper);
          this.data.cropperMode = 'drawing';
          break;
        }
        case 'move':
        case 'moving': {
          var cropper = this.moveCropper({
            canvasWidth: this.data.config.canvasWidth,
            canvasHeight: this.data.config.canvasHeight,
            scale: scale,
            cropper: this.data.cropper,
            touches: this.data.touches0,
          });
          this.updateCanvas(cropper);
          this.data.cropperMode = 'moving';
          break;
        }
        default:
          return;
      }
    } catch (e) {
      this.onError('touchMove', e);
    }

    this.onLog('touchMove', this.data.cropperMode, this.data.cropper, this.data.lastCropper);
  },

  touchEnd: function (e) {
    if (!this.data.config) {
      return;
    }
    this.onLog('touchEnd', this.data.cropperMode, this.data.cropper, this.data.lastCropper);

    try {
      const scale = this.data.config.canvasWidth / this.data.config.nodeWidth;
      switch (this.data.cropperMode) {
        case 'scales': // 放大后，没有拖动，状态不变  
        case 'scalings': { // 放大拖动后，离开一个手指 进入可移动模式  
          this.data.cropperMode = 'none';
          break;
        }
        case 'draw': // 有 cropper用户点击了阴影部分，清空 cropper，无 cropper 用户点击图片，取消放大
          // 放大后，没有拖动，取消放大效果
          if (!this.data.lastCropper) {
            delete this.data.config.cropper;
            delete this.data.config.destination;
            delete this.data.lastImageCropper;
          }
          // 点击开始画图，但是没有画，结束的时候，清空 cropper 
          this.data.lastCropper = this.data.cropper;
          this.data.cropper = null;
          this.data.cropperMode = 'none';
          this.updateCanvas();
          break;
        case 'drawing': // 拖动结束，显示选择框 
          this.data.cropperMode = 'none';
          break;
        case 'move': //  点击cropper，没有拖动，效果，放大选择区域 ，清空 cropper
          //放大选择区域    
          this.data.config.cropper = this.scaleCropper();
          delete this.data.config.destination;
          // 记录缩放前的坐标
          this.data.lastImageCropper = {
            ...this.data.config.cropper
          };
          // 放大后，取消cropper
          this.data.lastCropper = {
            ...this.data.cropper
          };
          this.data.cropper = null;
          this.data.cropperMode = 'none';
          this.updateCanvas();
          break;
        case 'moving': // 点击cropper，并拖动了 更新的cropper坐标 
          this.data.cropper = this.moveCropper({
            canvasWidth: this.data.config.canvasWidth,
            canvasHeight: this.data.config.canvasHeight,
            scale: scale,
            cropper: this.data.cropper,
            touches: this.data.touches0,
          });
          this.data.cropperMode = 'none';
          break;
      }
    } catch (e) {
      this.onError('touchEnd', e);
    }

  },

  // ------

  movingCanvas: function (touches) {
    let deltax = touches.x1 - touches.x0;
    let deltay = touches.y1 - touches.y0;
    const zoomRatio = this.data.config.width / this.data.lastImageCropper.width;
    deltax = deltax / this.data.pixelRatio / zoomRatio * 3;
    deltay = deltay / this.data.pixelRatio / zoomRatio * 3;
    // 移动选择窗口
    this.data.config.cropper.x = Math.min(
      Math.max(this.data.lastImageCropper.x - deltax, -this.data.config.cropper.width / 2),
      this.data.config.width - this.data.lastImageCropper.width / 2);
    this.data.config.cropper.y = Math.min(
      Math.max(this.data.lastImageCropper.y - deltay, -this.data.lastImageCropper.height / 2),
      this.data.config.height - this.data.lastImageCropper.height / 2);
    delete this.data.config.destination;
    this.updateCanvas(this.data.cropper);
  },

  scalingCanvas: function () {
    // 计算二指最新距离
    var xMove, yMove, oldDistance, newDistance, distance;
    xMove = Math.round(this.data.touches1.x1 - this.data.touches0.x1);
    yMove = Math.round(this.data.touches1.y1 - this.data.touches0.y1);
    newDistance = Math.round(Math.sqrt(xMove * xMove + yMove * yMove));
    xMove = Math.round(this.data.touches1.x0 - this.data.touches0.x0);
    yMove = Math.round(this.data.touches1.y0 - this.data.touches0.y0);
    oldDistance = Math.round(Math.sqrt(xMove * xMove + yMove * yMove));
    distance = oldDistance - newDistance;
    const zoomRatio = this.data.config.width / this.data.lastImageCropper.width;
    distance = distance / this.data.pixelRatio / zoomRatio * 3;

    // // 范围限制
    const maxCropperWidth = this.data.config.width;
    const minCropperWidth = this.data.config.width / this.data.zoom;
    const maxCropperHeight = this.data.config.height;
    const minCropperHeight = this.data.config.height / this.data.zoom;

    // 设置窗口 
    const cropperWidth = Math.max(Math.min(this.data.lastImageCropper.width + distance, maxCropperWidth), minCropperWidth);
    const cropperHeight = Math.max(Math.min(this.data.lastImageCropper.height + distance, maxCropperHeight), minCropperHeight);
    distance = cropperWidth - this.data.lastImageCropper.width;

    // 计算中心点移动位置
    var xDiff = (this.data.touches0.x1 + this.data.touches1.x1) / 2 - (this.data.touches0.x0 + this.data.touches1.x0) / 2;
    var yDiff = (this.data.touches0.y1 + this.data.touches1.y1) / 2 - (this.data.touches0.y0 + this.data.touches1.y0) / 2;
    xDiff = xDiff / this.data.pixelRatio / zoomRatio * 3;
    yDiff = yDiff / this.data.pixelRatio / zoomRatio * 3;

    const cropperX = Math.min(
      Math.max(this.data.lastImageCropper.x - distance / 2 - xDiff, -this.data.config.cropper.width / 2),
      this.data.config.width - this.data.lastImageCropper.width / 2);
    const cropperY = Math.min(
      Math.max(this.data.lastImageCropper.y - distance / 2 - yDiff, -this.data.lastImageCropper.height / 2),
      this.data.config.height - this.data.lastImageCropper.height / 2);
    this.data.config.cropper.width = cropperWidth;
    this.data.config.cropper.height = cropperHeight;
    this.data.config.cropper.x = cropperX;
    this.data.config.cropper.y = cropperY;

    delete this.data.config.destination;
    this.updateCanvas(this.data.cropper);
  },

  // ------

  // cropper
  isCropperEmpty: function (cropper) {
    if (!cropper)
      return true;
    if (cropper.x0 && cropper.y0 && cropper.x1 && cropper.y1)
      return false;
    return true;
  },

  // {cropper, touches}
  isInCropper: function (config) {
    if (config.touches.x0 * config.scale < config.cropper.x0)
      return false;
    if (config.touches.x0 * config.scale > config.cropper.x1)
      return false;
    if (config.touches.y0 * config.scale < config.cropper.y0)
      return false;
    if (config.touches.y0 * config.scale > config.cropper.y1)
      return false;
    return true;
  },

  // {cropper, touches, scale}
  isInCropperCorner: function (config) {
    const cornerWidth = 20;
    const getCornerCropper = function (x, y) {
      return {
        x0: x - cornerWidth,
        x1: x + cornerWidth,
        y0: y - cornerWidth,
        y1: y + cornerWidth,
      };
    };
    if (this.isInCropper({
        cropper: getCornerCropper(config.cropper.x0, config.cropper.y0),
        touches: config.touches,
        scale: config.scale,
      }))
      return {
        x: config.cropper.x0,
        y: config.cropper.y0
      };
    if (this.isInCropper({
        cropper: getCornerCropper(config.cropper.x0, config.cropper.y1),
        touches: config.touches,
        scale: config.scale,
      }))
      return {
        x: config.cropper.x0,
        y: config.cropper.y1
      };
    if (this.isInCropper({
        cropper: getCornerCropper(config.cropper.x1, config.cropper.y0),
        touches: config.touches,
        scale: config.scale,
      }))
      return {
        x: config.cropper.x1,
        y: config.cropper.y0
      };
    if (this.isInCropper({
        cropper: getCornerCropper(config.cropper.x1, config.cropper.y1),
        touches: config.touches,
        scale: config.scale,
      }))
      return {
        x: config.cropper.x1,
        y: config.cropper.y1
      };
    return false;
  },

  // {cropper, touches, scale}
  getCropperOppositeTouches: function (config) {
    const cornerWidth = 20;
    const getCornerCropper = function (x, y) {
      return {
        x0: x - cornerWidth,
        x1: x + cornerWidth,
        y0: y - cornerWidth,
        y1: y + cornerWidth,
      };
    };
    if (this.isInCropper({
        cropper: getCornerCropper(config.cropper.x0, config.cropper.y0),
        touches: config.touches,
        scale: config.scale,
      }))
      return {
        x: config.cropper.x1 / config.scale,
        y: config.cropper.y1 / config.scale
      };
    if (this.isInCropper({
        cropper: getCornerCropper(config.cropper.x0, config.cropper.y1),
        touches: config.touches,
        scale: config.scale,
      }))
      return {
        x: config.cropper.x1 / config.scale,
        y: config.cropper.y0 / config.scale
      };
    if (this.isInCropper({
        cropper: getCornerCropper(config.cropper.x1, config.cropper.y0),
        touches: config.touches,
        scale: config.scale,
      }))
      return {
        x: config.cropper.x0 / config.scale,
        y: config.cropper.y1 / config.scale
      };
    if (this.isInCropper({
        cropper: getCornerCropper(config.cropper.x1, config.cropper.y1),
        touches: config.touches,
        scale: config.scale,
      }))
      return {
        x: config.cropper.x0 / config.scale,
        y: config.cropper.y0 / config.scale
      };
    return false;
  },

  // {touches, cropper AspectRatio, canavsWidth, canvasHeight, scale}
  getCropper: function (config) {

    // 计算坐标
    let cropper = {
      x0: Math.min(Math.max(config.touches.x0 * config.scale, 0), config.canvasWidth),
      y0: Math.min(Math.max(config.touches.y0 * config.scale, 0), config.canvasWidth),
      x1: Math.min(Math.max(config.touches.x1 * config.scale, 0), config.canvasHeight),
      y1: Math.min(Math.max(config.touches.y1 * config.scale, 0), config.canvasHeight),
    };

    // 计算长宽
    let width = Math.abs(cropper.x1 - cropper.x0);
    let height = Math.abs(cropper.y1 - cropper.y0);
    if (config.cropperAspectRatio > 0) {
      if (width > height) {
        width = config.cropperAspectRatio * height;
      } else {
        height = width / config.cropperAspectRatio;
      }
    }

    // 修正
    if (cropper.x1 > cropper.x0) {
      if (cropper.y1 > cropper.y0) {
        return {
          x0: cropper.x0,
          y0: cropper.y0,
          x1: cropper.x0 + width,
          y1: cropper.y0 + height,

          x: cropper.x0,
          y: cropper.y0,
          width: width,
          height: height,
        };
      } else {
        return {
          x0: cropper.x0,
          y0: cropper.y0 - height,
          x1: cropper.x0 + width,
          y1: cropper.y0,

          x: cropper.x0,
          y: cropper.y0 - height,
          width: width,
          height: height,
        };
      }
    } else {
      if (cropper.y1 > cropper.y0) {
        return {
          x0: cropper.x0 - width,
          y0: cropper.y0,
          x1: cropper.x0,
          y1: cropper.y0 + height,

          x: cropper.x0 - width,
          y: cropper.y0,
          width: width,
          height: height,
        };
      } else {
        return {
          x0: cropper.x0 - width,
          y0: cropper.y0 - height,
          x1: cropper.x0,
          y1: cropper.y0,

          x: cropper.x0 - width,
          y: cropper.y0 - height,
          width: width,
          height: height,
        };
      }
    }
  },

  // {cropper, touches, canvasWidth, canavsHeight, scale}
  moveCropper: function (config) {
    // 移动计算
    const deltax = (config.touches.x1 - config.touches.x0) * config.scale;
    const deltay = (config.touches.y1 - config.touches.y0) * config.scale;
    let x0 = config.cropper.x0 + deltax;
    let y0 = config.cropper.y0 + deltay;
    let x1 = config.cropper.x1 + deltax;
    let y1 = config.cropper.y1 + deltay;

    // 越界检测
    const regularx = Math.max(0, 0 - x0) + Math.min(0, config.canvasWidth - x1);
    x0 += regularx;
    x1 += regularx;
    const regulary = Math.max(0, 0 - y0) + Math.min(0, config.canvasHeight - y1);
    y0 += regulary;
    y1 += regulary;

    return {
      x0: config.cropper.x0 + deltax + regularx,
      y0: config.cropper.y0 + deltay + regulary,
      x1: config.cropper.x1 + deltax + regularx,
      y1: config.cropper.y1 + deltay + regulary,

      x: config.cropper.x + deltax + regularx,
      y: config.cropper.y + deltay + regulary,
      width: config.cropper.width,
      height: config.cropper.height,
    };
  },

  // {cropper, destination, scale}
  scaleCropper: function () {
    const scale = this.data.config.cropper.width / this.data.config.width;
    if (this.data.cropper.width * scale < this.data.config.width / this.data.zoom)
      return {
        x: this.data.config.cropper.x + this.data.cropper.x * scale,
        y: this.data.config.cropper.y + this.data.cropper.y * scale,
        width: this.data.config.cropper.width,
        height: this.data.config.cropper.height,
      };
    return {
      x: (this.data.cropper.x - this.data.config.destination.x) * scale,
      y: (this.data.cropper.y - this.data.config.destination.y) * scale,
      width: this.data.cropper.width * scale,
      height: this.data.cropper.height * scale,
    };
  },

  // ------

  onError: function (e) {
    if (!this.data.onError)
      return;
    this.data.onError(e);
  },

  onLog: function () {
    if (!this.data.onLog)
      return;
    this.data.onLog(arguments);
  },
};