# weapp-jssdk

`微信` 签名

## 安装

```bash
$ npm install --save weapp-jssdk
```

## 在微信中使用
```html
<html>
  <head>
    <script src="//res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>
  </head>
</html>
```
```javascript
import { Jweixin } from 'weapp-jssdk'

let jwexin = new Jweixin({
  sdkVersion: '1.3.2', // 引用的微信 jsSDK 版本 http://res.wx.qq.com/open/js/jweixin-1.3.2.js
  debug: true,
  signatureServer: 'https://aa.bb.com/weixinSignature'
})
jwexin.getSignature()
  .then((response) => {
    // 签名成功
    jweixin.injectShare({
      title: '分享标题',
      desc: '分享描述',
      link: '分享链接',
      imgUrl: '分享图标',
      success: () => {
        // 设置成功
      },
      fail: () => {
        // 接口调用失败时执行的回调函数。
      },
      complete: () => {
        // 接口调用完成时执行的回调函数，无论成功或失败都会执行。
      },
      cancel: () => {
        // 用户点击取消时的回调函数，仅部分有用户取消操作的api才会用到。
      },
      trigger: () => {
        // 监听Menu中的按钮点击时触发的方法，该方法仅支持Menu中的相关接口。
      }
    })
  })
  .catch((error) => {
    // 签名失败
  })
```

## 已封装的 js 接口列表
```javascript
jsApiList = [
  'closeWindow',
  'checkJsApi',
  'hideMenuItems',
  'showMenuItems',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  // 'updateAppMessageShareData', /* sdkVersion >= 1.4.0 */
  // 'updateTimelineShareData', /* sdkVersion >= 1.4.0 */
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
```
*已封装的 js 接口列表，均可通过 `Jweixin` 实例调用。例如：`jweixin.closeWindow()`*

