import axios from 'axios'

export default class SDK {
  /**
   * jssdk config
   * @param {Object} config 
   */
  constructor(config = {}, { signatureServer } = {}) {
    this.config = Object.assign({}, {
      debug: false,
      scope: [
        // 设置分享内容
        'setSharingContent'
      ]
    }, config)
    // 服务器签名URL
    this.signatureServer = signatureServer
    // 失败可重签次数
    this.maxNum = 0
  }

  /**
   * jssdk load
   */
  load() {
    let jssdkUrl = '//tjs.sjs.sinajs.cn/open/thirdpart/js/jsapi/mobile.js'
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
  ready(share) {
    (async () => {
      try {
        await this.load()
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
      window.WeiboJS.init({
        ...this.config,
        callback: (res) => {
          resolve()
          console.log(res)
        }
      })
    })
  }

  /**
   * jssdk share
   * @param {Object} share 
   */
  share(share = {}) {
    window.WeiboJS && window.WeiboJS.invoke('setSharingContent', {
      title: share.title,
      desc: share.desc,
      icon: share.imgUrl
    }, (params, success, code) => {
      console.log(params, success, code)
    })
  }
}
