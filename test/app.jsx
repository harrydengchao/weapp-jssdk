import React, { Component } from 'react'
import VConsole from 'vconsole'
import axios from 'axios'
import { 
  WXSDK,
  WBSDK
} from '@lib/index'

new VConsole()
const UA = window.navigator.userAgent

export default class Index extends Component {
  componentDidMount() {

  }

  weixinAuth() {
    if (/MicroMessenger/i.test(UA)) {
      let signatureServer = 'https://bcs.link-us.com.cn/wechat_sit/frontend/directSelling/directSellingBank/weixinConfig'
      let instance = new WXSDK(signatureServer, {
        debug: true
      })
      instance.share({
        title: '1231',
        desc: 'sdfsd',
        imgUrl: 'http://bcs.link-us.com.cn/act_uat/static/shareImg.jpg?timestamp=1548567423885',
        success: () => {
          console.log('success..')
        }
      })
    }
  }

  handleWeixinScope() {
    axios
      .get('http://bcs.link-us.com.cn/wechat_sit/frontend/wechatAjaxRedirect')
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  weiboAuth() {
    if (/Weibo/i.test(UA)) {
      this.instance = new WBSDK()
      this.instance.share({
        title: '1231',
        desc: 'sdfsd',
        imgUrl: 'http://bcs.link-us.com.cn/act_uat/static/shareImg.jpg?timestamp=1548567423885'
      })
    }
  }

  qqAuth() {
    if (/\s+QQ\//i.test(UA)) {

    }
  }

  ucbrowserAuth() {
    if (/\S+UCBrowser\//i.test(UA)) {
      
    }
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <h3>调试微信</h3>
          <p><button onClick={this.weixinAuth.bind(this)}>微信 jssdk 签名</button></p>
          <div><button onClick={this.handleWeixinScope.bind(this)}>微信网页授权</button></div>
        </div>
        <div>
          <h3>调试微博</h3>
          <p><button>调用微博分享</button></p>
        </div>
      </React.Fragment>
    )
  }
}
