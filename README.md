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
    <script src="//res.wx.qq.com/open/js/jweixin-1.4.0.js"></script>
  </head>
</html>
```
```javascript
import { Jweixin } from 'weapp-jssdk'

let jwexin = new Jweixin({
  debug: true,
  
})
```
