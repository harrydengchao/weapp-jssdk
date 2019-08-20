import axios from 'axios'

export default class Jwexin {
  constructor(config = {}) {
    let {
      sdkVersion,
      debug,
      jsApiList,
      signatureServer
    } = config
    sdkVersion = sdkVersion || '1.3.2'
    debug = debug || false
    if (!jsApiList) {
      jsApiList = [
        'closeWindow',
        'checkJsApi',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        // 'updateAppMessageShareData',
        // 'updateTimelineShareData',
        'onMenuShareAppMessage',
        'onMenuShareTimeline',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getLocalImgData',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'scanQRCode',
        'chooseWXPay'
      ]
      if (parseFloat(sdkVersion) >= parseFloat('1.4.0')) {
        jsApiList.push(
          'updateAppMessageShareData',
          'updateTimelineShareData'
        )
      }
    }
    if (!signatureServer) {
      throw new Error(`signatureServer is ${signatureServer}.`)
    }
    this.userConfig = { sdkVersion, debug, jsApiList } // 用户配置
    this.signatureServer = signatureServer // 签名服务器
  }

  /* 获取服务器签名 */
  getSignature(config = {}) {
    let {
      signatureUrl // 签名链接
    } = config
    signatureUrl = signatureUrl || window.location.href.split('#')[0]
    return new Promise((resolve, reject) => {
      axios
        .get(this.signatureServer, {
          params: { url: signatureUrl }
        })
        .then((res) => {
          if (String(res.status) !== '200') {
            return Promise.reject(new Error('服务请求出错'))
          }
          let { data } = res
          let userConfig = this.userConfig
          this.injectConfig({
            debug: userConfig.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            jsApiList: userConfig.jsApiList, // 必填，需要使用的JS接口列表
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature,// 必填，签名
          })
            .then(() => resolve(data))
            .catch(error => reject(error))
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /* 注入配置信息 */
  injectConfig(config = {}) {
    let { debug, appId, timestamp, nonceStr, signature, jsApiList } = config
    let that = this
    return new Promise((resolve, reject) => {
      wx.ready(function(response){
          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
          that.hideAllNonBaseMenuItem()
          that.showMenuItems({
            menuList: [
              'menuItem:share:appMessage',
              'menuItem:share:timeline',
              'menuItem:favorite',
              'menuItem:copyUrl'
            ]
          })
          resolve(response)
      })

      wx.error(function(error){
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          reject(error)
      })

      wx.config({ debug, appId, timestamp, nonceStr, signature, jsApiList })
    })
  }

  /* 关闭当前网页窗口接口 */
  closeWindow() {
    wx.closeWindow()
  }

  /* 判断当前客户端版本是否支持指定JS接口 */
  checkJsApi(config) {
    wx.checkJsApi({
        jsApiList: config.jsApiList || ['chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        success: config.success || function(res) {
        // 以键值对的形式返回，可用的api值true，不可用为false
        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
        }
    })
  }

  /* 批量隐藏功能按钮接口 */
  hideMenuItems(config = {}) {
    wx.hideMenuItems({
      menuList: config.menuList || [] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
    })
  }

  /* 批量显示功能按钮接口 */
  showMenuItems(config = {}) {
    wx.showMenuItems({
      menuList: config.menuList || [] // 要显示的菜单项，所有menu项见附录3
    })
  }

  /* 隐藏所有非基础按钮接口 */
  hideAllNonBaseMenuItem() {
    wx.hideAllNonBaseMenuItem() // “基本类”按钮详见附录3
  }

  /* 显示所有功能按钮接口 */
  showAllNonBaseMenuItem() {
    wx.showAllNonBaseMenuItem()
  }

  /* 注入分享 */
  injectShare(config = {}) {
    if (parseFloat(this.userConfig.sdkVersion) < parseFloat('1.4.0')) {
      // 获取“分享给朋友”按钮点击状态及自定义分享内容接口（即将废弃）
      wx.onMenuShareAppMessage({
        title: config.title || '', // 分享标题
        desc: config.desc || '', // 分享描述
        link: config.link || '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: config.imgUrl || '', // 分享图标
        type: config.type || 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: config.dataUrl || '', // 如果type是music或video，则要提供数据链接，默认为空
        success: config.success || function () {
          // 设置成功
        },
        fail: config.fail || function() {
          // 接口调用失败时执行的回调函数。
        },
        complete: config.complete || function() {
          // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
        },
        cancel: config.cancel || function() {
          // 用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到。
        },
        trigger: config.trigger || function() {
          // 监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口。
        }
      })
      // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃）
      wx.onMenuShareTimeline({
          title: config.title || '', // 分享标题
          link: config.link || '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: config.imgUrl || '', // 分享图标
          success: config.success || function () {
            // 设置成功
          },
          fail: config.fail || function() {
            // 接口调用失败时执行的回调函数。
          },
          complete: config.complete || function() {
            // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
          },
          cancel: config.cancel || function() {
            // 用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到。
          },
          trigger: config.trigger || function() {
            // 监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口。
          }
      })
    } else {
      // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
      wx.updateAppMessageShareData({ 
          title: config.title || '', // 分享标题
          desc: config.desc || '', // 分享描述
          link: config.link || '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: config.imgUrl || '', // 分享图标
          success: config.success || function () {
            // 设置成功
          },
          fail: config.fail || function() {
            // 接口调用失败时执行的回调函数。
          },
          complete: config.complete || function() {
            // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
          },
          cancel: config.cancel || function() {
            // 用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到。
          },
          trigger: config.trigger || function() {
            // 监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口。
          }
      })
      // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
      wx.updateTimelineShareData({ 
          title: config.title || '', // 分享标题
          link: config.link || '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: config.imgUrl || '', // 分享图标
          success: config.success || function () {
            // 设置成功
          },
          fail: config.fail || function() {
            // 接口调用失败时执行的回调函数。
          },
          complete: config.complete || function() {
            // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
          },
          cancel: config.cancel || function() {
            // 用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到。
          },
          trigger: config.trigger || function() {
            // 监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口。
          }
      })
    }
  }

  /* 拍照或从手机相册中选图接口 */
  chooseImage(config = {}) {
    wx.chooseImage({
      count: config.count || 1, // 默认9
      sizeType: config.sizeType || ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: config.sourceType || ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: config.success || function (res) {
        var localIds = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
      }
    })
  }

  /* 预览图片接口 */
  previewImage(config = {}) {
    wx.previewImage({
      current: config.current || '', // 当前显示图片的http链接
      urls: config.urls || [] // 需要预览的图片http链接列表
    })
  }

  /* 上传图片接口 */
  uploadImage(config = {}) {
    wx.uploadImage({
      localId: config.localId || '', // 需要上传的图片的本地ID，由chooseImage接口获得
      isShowProgressTips: config.isShowProgressTips || 1, // 默认为1，显示进度提示
      success: config.success || function (res) {
        var serverId = res.serverId // 返回图片的服务器端ID
      }
    })
  }

  /* 下载图片接口 */
  downloadImage(config = {}) {
    wx.downloadImage({
      serverId: config.serverId || '', // 需要下载的图片的服务器端ID，由uploadImage接口获得
      isShowProgressTips: config.isShowProgressTips || 1, // 默认为1，显示进度提示
      success: config.success || function (res) {
        var localId = res.localId // 返回图片下载后的本地ID
      }
    })
  }

  /* 获取本地图片接口 */
  getLocalImgData(config = {}) {
    wx.getLocalImgData({
      localId: config.localId || '', // 图片的localID
      success: config.success || function (res) {
        var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
      }
    })
  }

  /* 获取网络状态接口 */
  getNetworkType(config = {}) {
    wx.getNetworkType({
      success: config.success || function (res) {
        var networkType = res.networkType // 返回网络类型2g，3g，4g，wifi
      }
    })
  }

  /* 使用微信内置地图查看位置接口 */
  openLocation(config = {}) {
    wx.openLocation({
      latitude: config.latitude || 0, // 纬度，浮点数，范围为90 ~ -90
      longitude: config.longitude || 0, // 经度，浮点数，范围为180 ~ -180。
      name: config.name || '', // 位置名
      address: config.address || '', // 地址详情说明
      scale: config.scale || 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
      infoUrl: config.infoUrl || '' // 在查看位置界面底部显示的超链接,可点击跳转
    })
  }

  /* 获取地理位置接口 */
  getLocation(config = {}) {
    wx.getLocation({
      type: config.type || 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      success: config.success || function (res) {
        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        var speed = res.speed; // 速度，以米/每秒计
        var accuracy = res.accuracy; // 位置精度
      }
    })
  }

  /* 调起微信扫一扫接口 */
  scanQRCode(config = {}) {
    wx.scanQRCode({
      needResult: config.needResult || 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: config.scanType || ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: config.success || function (res) {
        var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
      }
    })
  }

  /* 发起一个微信支付请求 */
  chooseWXPay(config = {}) {
    wx.chooseWXPay({
      timestamp: config.timestamp || 0, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: config.nonceStr || '', // 支付签名随机串，不长于 32 位
      package: config.package || '', // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
      signType: config.signType || '', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: config.paySign || '', // 支付签名
      success: config.success || function (res) {
        // 支付成功后的回调函数
      }
    })
  }
}