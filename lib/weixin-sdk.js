import axios from 'axios'

/**
 * class WXSDK
 * @constructor {String, Object} {signatureServer, sdkCOnfig}
 * @share {Object} shareInfo 
 */
export default class WXSDK {
  constructor(signatureServer, sdkConfig) {
    this.signatureServer = signatureServer
    this.config = Object.assign({}, {
      debug: false,
      jsApiList: [
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone'
      ]
    }, sdkConfig)
    this.loadjs()
  }

  // 执行 share
  share(shareInfo) {
    this.shareInfo = shareInfo
    this.loadjs(() => {
      this.getSignature()
    })
  }

  /**
   * load jssdk
   */
  loadjs(callback) {
    let jssdkUrl = '//res.wx.qq.com/open/js/jweixin-1.3.2.js'
    let re = new RegExp(jssdkUrl)
    let sdk = [...document.head.querySelectorAll('script')].filter(item => re.test(item.src))[0]
    if (!sdk) {
      let scriptFragment = document.createDocumentFragment()
      let scriptElement = document.createElement('script')
      scriptElement.setAttribute('src', jssdkUrl)
      scriptElement.setAttribute('charset', 'utf-8')
      scriptFragment.appendChild(scriptElement)
      document.head.appendChild(scriptFragment)
      scriptElement.addEventListener('load', function() {
        callback && callback()
      })
    } else {
      this.isJssdkLoaded = true
      callback && callback()
    }
  }

  /**
   * 获取微信签名
   */
  getSignature() {
    axios
      .get(this.signatureServer, {
        params: { url: window.location.href.split('#')[0] }
      })
      .then((response) => {
        this.wxReady(response.data)
      })
      .catch((error) => {
        console.warn('getSignature: ', error)
      })
  }

  /**
   * 初始化微信签名
   * @param {Object} data 
   */
  wxReady(data) {
    wx.config(Object.assign({}, this.config, {
      appId: data.appId, // 必填，公众号的唯一标识
      timestamp: data.timestamp, // 必填，生成签名的时间戳
      nonceStr: data.nonceStr, // 必填，生成签名的随机串
      signature: data.signature,// 必填，签名
    }))
    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，
    // config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。
    // 对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    wx.ready(() => {
      this.isReady = true
      this.wxShareWrapper()
    })

    // config信息验证失败会执行error函数，如签名过期导致验证失败，
    // 具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    wx.error((res) => {
      this.isReady = false
      console.warn('wx.error: ', res)
    })
  }

  /**
   * 包含了所有微信分享
   */
  wxShareWrapper() {
    let share = this.shareInfo

    // 分享给朋友
    window.wx.onMenuShareAppMessage({
      title: share.title,
      desc: share.desc,
      link: share.link,
      imgUrl: share.imgUrl,
      success: share.success,
      fail: share.fail,
      complete: share.complete,
      cancel: share.cancel,
      trigger: share.trigger
    })

    // 分享到朋友圈
    window.wx.onMenuShareTimeline({
      title: share.title,
      desc: share.desc,
      link: share.link,
      imgUrl: share.imgUrl,
      success: share.success,
      fail: share.fail,
      complete: share.complete,
      cancel: share.cancel,
      trigger: share.trigger
    })
  }
}
