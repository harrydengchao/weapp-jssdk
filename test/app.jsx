import React, { Component } from 'react'
import VConsole from 'vconsole'
import { 
  WXSDK,
  QQSDK
} from '@lib/index'

new VConsole()
const UA = window.navigator.userAgent

export default class Index extends Component {
  componentDidMount() {
    if (/MicroMessenger/i.test(UA)) {
      let instance = new WXSDK({
        debug: true
      }, {
        signatureServer: 'http://bcs.link-us.com.cn/wechat_sit/frontend/directSelling/directSellingBank/weixinConfig'
      })
      instance.ready({
        title: '1231',
        desc: 'sdfsd',
        success: () => {
          console.log('success..')
        }
      })
    } else if (/\s+QQ\//i.test(UA)) {
      let instance = new QQSDK()
      instance.ready({
        title: '1231',
        desc: 'sdfsd',
        success: () => {
          console.log('success..')
        }
      })
    } else if (/\s+MQQBrowser\//i.test(UA)) {

    } else if (/Weibo/i.test(UA)) {

    } else if (/\S+UCBrowser\//i.test(UA)) {
      
    }
  }

  render() {
    return (
      <div>
        asdfasd
      </div>
    )
  }
}
