import axios from 'axios'

export default class SDK {
  /**
   * jssdk config
   * @param {Object} config 
   */
  constructor(config = {}, { signatureServer } = {}) {
    this.config = Object.assign({}, {
      debug: false,
      jsApiList: [
        // 客户端6.7.2及JSSDK 1.4.0以上版本支持
        'updateAppMessageShareData',
        // 客户端6.7.2及JSSDK 1.4.0以上版本支持
        'updateTimelineShareData',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone'
      ]
    }, config)
    // 服务器签名URL
    this.signatureServer = signatureServer
    // 失败可重签次数
    this.maxNum = 2
  }

  /**
   * jssdk load
   */
  load(callback) {
    let jssdkUrl = '//res.wx.qq.com/open/js/jweixin-1.3.2.js'
    let re = new RegExp(jssdkUrl)
    let sdk = [...document.head.querySelectorAll('script')].filter(item => re.test(item.src))[0]
    return new Promise((resolve, reject) => {
      if (!sdk) {
        let scriptFragment = document.createDocumentFragment()
        let scriptElement = document.createElement('script')
        scriptElement.setAttribute('src', jssdkUrl)
        scriptElement.setAttribute('charset', 'utf-8')
        scriptFragment.appendChild(scriptElement)
        document.head.appendChild(scriptFragment)
        scriptElement.addEventListener('load', function() {
          callback && callback()
          resolve()
        })
      } else {
        resolve()
      }
    })
  }

  /**
   * showShareMenu
   * @param {Function} callback 
   */
  showShareMenu(callback) {
    callback()
  }

  /**
   * jssdk get signature
   */
  getSignature() {
    return new Promise((resolve, reject) => {
      axios
        .get(this.signatureServer, {
          params: { url: window.location.href.split('#')[0] }
        })
        .then(({ data }) => {
          // 在这里设置 signature， timestamp， nonceStr
          let {
            appId,
            timestamp,
            nonceStr,
            signature
          } = data
          this.config.appId = appId
          this.config.timestamp = timestamp
          this.config.nonceStr = nonceStr
          this.config.signature = signature
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /**
   * jssdk ready
   * @param {Object} share 
   */
  ready(share, loadCallback) {
    (async () => {
      try {
        await this.load(loadCallback)
        await this.getSignature()
        await this.init()
        await this.share(share)
      } catch (error) {
        console.error(error)
        if (this.maxNum < 0) {
          return Promise.reject(new Error(`signature maxnum.`))
        } else {
          this.ready(share)
        }
      }
    })()
  }

  /**
   * jssdk init
   */
  init() {
    return new Promise((resolve, reject) => {
      this.maxNum--

      window.wx.config(this.config)

      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，
      // config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。
      // 对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
      window.wx.ready(() => {
        resolve()
      })

      // config信息验证失败会执行error函数，如签名过期导致验证失败，
      // 具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      window.wx.error((res) => {
        reject(res)
      })
    })
  }

  /**
   * jssdk share
   * @param {Object} share 
   */
  share(share = {}) {
    // (1.4.0)分享给朋友 & 分享到QQ
    window.wx.updateAppMessageShareData && window.wx.updateAppMessageShareData({
      title: share.title,
      desc: share.desc,
      link: share.link,
      imgUrl: share.imgUrl,
      success: () => {
        share.success()
      }
    })

    // (1.4.0)分享到朋友圈 & 分享到QQ空间
    window.wx.updateTimelineShareData && window.wx.updateTimelineShareData({
      title: share.title,
      link: share.link,
      imgUrl: share.imgUrl,
      success: () => {
        share.success()
      }
    })

    // 分享给朋友
    !window.wx.updateAppMessageShareData && window.wx.onMenuShareAppMessage({
      title: share.title,
      desc: share.desc,
      link: share.link,
      success: () => {
        share.success()
      }
    })

    // 分享到朋友圈
    !window.wx.updateTimelineShareData && window.wx.onMenuShareTimeline({
      title: share.title,
      link: share.link,
      imgUrl: share.imgUrl,
      success: () => {
        share.success()
      }
    })

    // 分享到QQ
    !window.wx.updateAppMessageShareData && window.wx.onMenuShareQQ({
      title: share.title,
      desc: share.desc,
      link: share.link,
      imgUrl: share.imgUrl,
      success: () => {
        share.success()
      }
    })

    // 分享到QQ空间
    !window.wx.updateTimelineShareData && window.wx.onMenuShareQZone({
      title: share.title,
      desc: share.desc,
      link: share.link,
      imgUrl: share.imgUrl,
      success: () => {
        share.success()
      }
    })

    // 分享到腾讯微博
    window.wx.onMenuShareWeibo({
      title: share.title,
      desc: share.desc,
      link: share.link,
      imgUrl: share.imgUrl,
      success: () => {
        share.success()
      }
    })
  }
}
