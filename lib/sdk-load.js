function sdkLoad(callback) {
  let jssdkUrl = '//res.wx.qq.com/open/js/jweixin-1.4.0.js'
  let re = new RegExp(jssdkUrl)
  let sdk = [...document.head.querySelectorAll('script')].filter(item => re.test(item.src))[0]
  if (!sdk) {
    let scriptFragment = document.createDocumentFragment()
    let scriptElement = document.createElement('script')
    scriptElement.setAttribute('src', jssdkUrl)
    scriptFragment.appendChild(scriptElement)
    document.head.appendChild(scriptFragment)
    scriptElement.addEventListener('load', function() {
      callback()
    })
  } else {
    callback()
  }
}

export default sdkLoad
