export default class SDK {
  /**
   * jssdk config
   * @param {Object} config 
   */
  constructor(config = {}) {
    this.config = Object.assign({}, {
      
    }, config)
  }

  /**
   * jssdk load
   */
  load() {
    let jssdkUrl = '//qzonestyle.gtimg.cn/qzone/qzact/common/share/share.js'
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
        scriptElement.addEventListener('load', () => {
          resolve()
        })
      } else {
        resolve()
      }
    })
  }

  /**
   * showShareMenu
   */
  showShareMenu() {
    // 显示分享菜单
    // mqq.ui.showShareMenu()
  }

  /**
   * jssdk ready
   * @param {Object} share 
   */
  ready(share) {
    (async () => {
      try {
        await this.load()
        await this.share(share)
      } catch (error) {
        console.error(error)
      }
    })()
  }

  /**
   * jssdk share
   * @param {Object} share 
   */
  share(share = {}) {
    setShareInfo({
      title: share.title,
      summary: share.desc,
      pic: share.imgUrl,
      url: share.link
    })
    // mqq.data.setShareInfo({
    //     title: share.title,
    //     desc: share.desc,
    //     share_url: share.link,
    //     image_url: share.imgUrl
    //   }, (result) => {
    //     if (result.retCode === 0) {
    //       share.success()
    //     }
    //   })
  }
}
